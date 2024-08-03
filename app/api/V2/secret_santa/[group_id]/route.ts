import {
    getGroupPersonCollection,
    getPersonCollection,
    getSecretSantaCollection,
} from '@/app/types/db/getCollections'
import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { NextRequest } from 'next/server'

export async function POST(
    req: NextRequest,
    { params }: { params: { group_id: string } }
) {
    try {
        if (!params.group_id || !ObjectId.isValid(params.group_id)) {
            throw new Error('No group id provided')
        }

        const secretSantaHistory = (await getSecretSantaCollection())
            .find({
                group_id: new ObjectId(params.group_id),
            })
            .sort({ year: -1, gifteeId: -1 })
            .toArray()

        const groupPersonCol = (await getGroupPersonCollection())
            .find({
                group_id: new ObjectId(params.group_id),
            })
            .sort({ _id: -1 })
            .toArray()

        const response = await Promise.all([
            secretSantaHistory,
            groupPersonCol,
        ]).then(async (values) => {
            let lastYear = 0
            if (values[0].length > 0) {
                lastYear = values[0][0].year + 1
            } else {
                lastYear = new Date().getFullYear()
            }

            const persons = values[1].map((groupPerson) => {
                return groupPerson.person_id
            })

            const personNamesCol = (
                await (await getPersonCollection())
                    .find({ _id: { $in: persons } })
                    .toArray()
            ).map((person, idx) => {
                return {
                    _id: person._id,
                    name: person.name,
                    idx,
                }
            })

            //each position represents a year
            //each year has the adyancent matrix of the group
            const AdyMatrix: Array<Array<number>> = Array(values[1].length)
                .fill(0)
                .map(() => Array(values[1].length).fill(0))
            //only the last 2 years

            values[0]
                .filter((secretSanta, idx, arr) => {
                    return secretSanta.year >= arr[0].year - 1
                })

                .forEach((secretSanta) => {
                    //this finds could be optimized, made outside the loop and stored in a map
                    const p = personNamesCol.find((person) => {
                        return person._id.equals(secretSanta.gifterId)
                    })

                    const g = personNamesCol.find((person) => {
                        return person._id.equals(secretSanta.gifteeId)
                    })

                    AdyMatrix[g!.idx][p!.idx] = 1
                })

            ///HERE GOES THE RANDOM GENERATION////
            //////////////////////////////////////

            ///AND THEN HERE GOES THE COMPARISON WITH THE PREVIOUS ADJ TABLE////
            ////////////////////////////////////////////////////////////////////
            return Response.json(
                { AdyMatrix, lastYear },
                { status: StatusCodes.OK }
            )
        })

        return response
    } catch (error) {
        console.error(error)

        return Response.json({ message: 'An error occurred!' })
    }
}

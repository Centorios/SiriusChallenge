import { SecretSanta } from '@/app/types'
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

        const groupPersonArr = await (
            await getGroupPersonCollection()
        )
            .find({
                group_id: new ObjectId(params.group_id),
            })
            .toArray()

        const persons = groupPersonArr.map((groupPerson) => {
            return groupPerson.person_id
        })

        const personNames = await (await getPersonCollection())
            .find({ _id: { $in: persons } })
            .toArray()

        //sort is mutable shuffledPersonNames is just a reference to personNames
        const shuffledPersonNames = personNames.sort(() => Math.random() - 0.5)

        /////////////////////////////////////////////////////////////////////////////
        const secretSantaTuples = shuffledPersonNames.map(
            (person, idx, arr) => {
                if (idx === arr.length - 1) {
                    return {
                        gifterId: person._id,
                        gifteeId: arr[0]._id,
                        gifterName: person.name,
                        gifteeName: arr[0].name,
                        year: new Date().getFullYear(),
                    }
                }

                return {
                    gifterId: person._id,
                    gifteeId: arr[idx + 1]._id,
                    gifterName: person.name,
                    gifteeName: arr[idx + 1].name,
                    year: new Date().getFullYear(),
                }
            }
        )
        /////////////////////////////////////////////////////////////////////////////

        const insert = await (
            await getSecretSantaCollection()
        ).insertMany(
            secretSantaTuples.map((tuple) => {
                return {
                    gifterId: tuple.gifterId,
                    gifteeId: tuple.gifteeId,
                    year: tuple.year,
                }
            })
        )

        if (!insert.acknowledged) {
            throw new Error('Insert to secret santa collection failed')
        }

        return Response.json(secretSantaTuples, { status: StatusCodes.OK })
    } catch (error) {
        console.error(error)

        return Response.json({ message: 'An error occurred!' })
    }
}

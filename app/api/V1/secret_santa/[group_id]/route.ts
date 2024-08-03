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
            .sort({ year: -1 })
            .toArray()

        const groupPersonCol = (await getGroupPersonCollection())
            .find({
                group_id: new ObjectId(params.group_id),
            })
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

            const personNamesCol = await (await getPersonCollection())
                .find({ _id: { $in: persons } })
                .toArray()

            //sort is mutable shuffledPersonNames is just a reference to personNames
            //js sort is O(n log(n))
            const shuffledPersonNames = personNamesCol.sort(
                () => Math.random() - 0.5
            )

            /////////////////////////////////////////////////////////////////////////////
            //this part is O(n) because it is just a map with an if statement (perfect matching algorithm)
            const secretSantaTuples = shuffledPersonNames.map(
                (person, idx, arr) => {
                    if (idx === arr.length - 1) {
                        return {
                            gifterId: person._id,
                            gifteeId: arr[0]._id,
                            gifterName: person.name,
                            gifteeName: arr[0].name,
                            year: lastYear,
                        }
                    }

                    return {
                        gifterId: person._id,
                        gifteeId: arr[idx + 1]._id,
                        gifterName: person.name,
                        gifteeName: arr[idx + 1].name,
                        year: lastYear,
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
                        group_id: new ObjectId(params.group_id),
                    }
                })
            )

            if (!insert.acknowledged) {
                throw new Error('Insert to secret santa collection failed')
            }

            //format response as stated in pdf like this: {giftee: gifter}
            const responseObj = new Object()
            secretSantaTuples.forEach((tuple) => {
                const res = new Object()
                Object.defineProperty(responseObj, tuple.gifteeName, {
                    value: tuple.gifterName,
                    writable: true,
                    enumerable: true,
                    configurable: true,
                })
                return res
            })

            return Response.json(responseObj, { status: StatusCodes.OK })
        })

        return response
    } catch (error) {
        console.error(error)

        return Response.json({ message: 'An error occurred!' })
    }
}

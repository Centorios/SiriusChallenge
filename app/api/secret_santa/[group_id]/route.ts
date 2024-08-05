import {
    getGroupPersonCollection,
    getPersonCollection,
    getSecretSantaCollection,
} from '@/app/types/db/getCollections'
import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { NextRequest } from 'next/server'

export async function GET(
    req: NextRequest,
    { params }: { params: { group_id: string } }
) {
    try {
        if (!params.group_id || !ObjectId.isValid(params.group_id)) {
            throw new Error('No group id provided')
        }

        //ORDER BY YEAR
        const secretSantaCol = (await getSecretSantaCollection())
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

        const response = Promise.all([secretSantaCol, groupPersonCol]).then(
            async (values) => {
                //non null assertion covered here
                if (values[0].length === 0) {
                    return new Response(null, {
                        status: StatusCodes.NO_CONTENT,
                    })
                }

                if (values[1].length === 0) {
                    return new Response(null, {
                        status: StatusCodes.NO_CONTENT,
                    })
                }

                const persons = values[1].map((groupPerson) => {
                    return groupPerson.person_id
                })

                const personNamesCol = await (
                    await getPersonCollection()
                )
                    .find({
                        _id: { $in: persons },
                    })
                    .toArray()
                //non null assertion covered here

                //this shoudlnt fail ever
                if (personNamesCol.length === 0) {
                    return new Response(null, {
                        status: StatusCodes.NO_CONTENT,
                    })
                }

                const responseObj: Record<number, { name: string }> = {}

                values[0].forEach((secretSanta) => {
                    const gifteeName = personNamesCol.find((person) => {
                        return person._id.equals(secretSanta.gifteeId)
                    })

                    const gifterName = personNamesCol.find((person) => {
                        return person._id.equals(secretSanta.gifterId)
                    })

                    if (!gifteeName || !gifterName) {
                        return new Response(null, {
                            status: StatusCodes.NO_CONTENT,
                        })
                    }

                    if (!responseObj.hasOwnProperty(secretSanta.year)) {
                        Object.defineProperty(responseObj, secretSanta.year, {
                            value: {},
                            writable: true,
                            enumerable: true,
                            configurable: true,
                        })
                    }

                    Object.defineProperty(
                        responseObj[secretSanta.year],
                        gifteeName.name,
                        {
                            value: gifterName.name,
                            writable: true,
                            enumerable: true,
                            configurable: true,
                        }
                    )
                })

                return Response.json(responseObj, {
                    status: StatusCodes.OK,
                })
            }
        )
        return response
    } catch (error) {
        console.error(error)
        return Response.json(
            { message: 'An error occurred!' },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        )
    }
}

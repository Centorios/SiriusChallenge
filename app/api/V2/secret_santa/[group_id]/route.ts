import {
    getGroupPersonCollection,
    getPersonCollection,
    getSecretSantaCollection,
} from '@/app/types/db/getCollections'
import { getSettings } from '@/app/types/getSettings'
import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { NextRequest } from 'next/server'

export async function POST(
    req: NextRequest,
    { params }: { params: { group_id: string } }
) {
    try {
        const secret_santa_condition = Number(getSettings().secret_santa_years)
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

            if (values[0].length === secret_santa_condition) {
                console.error(
                    'The number of years is equal to the secret santa condition, non repetition is not possible'
                )
            }

            //each position represents a year
            //each year has the adyancent matrix of the group
            const AdyMatrix: Array<Array<number>> = Array(values[1].length)
                .fill(0)
                .map(() => Array(values[1].length).fill(0))
            //only the last 2 years

            values[0]
                .filter((secretSanta, idx, arr) => {
                    return (
                        secretSanta.year >=
                        arr[0].year - secret_santa_condition - 1
                    )
                })

                .forEach((secretSanta) => {
                    //this finds could be optimized, made outside the loop and stored in a map
                    const p = personNamesCol.find((person) => {
                        return person._id.equals(secretSanta.gifterId)
                    })

                    const g = personNamesCol.find((person) => {
                        return person._id.equals(secretSanta.gifteeId)
                    })

                    if (!p || !g) {
                        console.error('Person not found')
                        return
                    }

                    AdyMatrix[g.idx][p.idx] = 1
                })

            ///HERE GOES THE RANDOM GENERATION////

            const shuffledPersonNames = personNamesCol.sort(
                () => Math.random() - 0.5
            )

            const newSecretSantaTuples = shuffledPersonNames.map(
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

            //////////////////////////////////////

            ///AND THEN HERE GOES THE COMPARISON WITH THE PREVIOUS ADJ TABLE////

            newSecretSantaTuples.forEach((tuple) => {
                const p = personNamesCol.find((person) => {
                    return person._id.equals(tuple.gifterId)
                })

                const g = personNamesCol.find((person) => {
                    return person._id.equals(tuple.gifteeId)
                })

                if (!p || !g) {
                    console.error('Person not found')
                    return
                }

                if (AdyMatrix[g.idx][p.idx] === 1) {
                    for (let i = 0; i < AdyMatrix[g.idx].length; i++) {
                        if (AdyMatrix[g.idx][i] === 0) {
                            const newP = personNamesCol.find((person) => {
                                return person.idx === i
                            })

                            if (newP) {
                                tuple.gifteeId = newP._id
                            } else {
                                console.error(
                                    'there are no more people to assign, no duplicates isnt possible'
                                )
                            }
                        }
                    }
                }
            })

            const insert = await (
                await getSecretSantaCollection()
            ).insertMany(
                newSecretSantaTuples.map((tuple) => {
                    return {
                        gifterId: tuple.gifterId,
                        gifteeId: tuple.gifteeId,
                        year: tuple.year,
                        group_id: new ObjectId(params.group_id),
                    }
                })
            )

            if (!insert.acknowledged) {
                throw new Error('Insert failed')
            }

            //format response as stated in pdf like this: {giftee: gifter}
            type genericObject = { [key: string]: string }

            const responseObj: genericObject = {}

            newSecretSantaTuples.forEach((tuple) => {
                responseObj[tuple.gifteeName] = tuple.gifterName
            })

            return Response.json(responseObj, { status: StatusCodes.OK })
        })

        ////////////////////////////////////////////////////////////////////
        return response
    } catch (error) {
        console.error(error)

        return Response.json(
            { message: 'An error occurred!' },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        )
    }
}

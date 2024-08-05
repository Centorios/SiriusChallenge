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

            if (values[1].length === secret_santa_condition) {
                console.error(
                    'The number of years is equal to the secret santa condition, non repetition is not secured'
                )
            }

            //each position represents a year
            //each year has the adyancent matrix of the group
            const AdyMatrix: Array<Array<number>> = Array(values[1].length)
                .fill(0)
                .map(() => Array(values[1].length).fill(0))

            const latestYear = values[0]
                .map((secretSanta) => secretSanta.year)
                .reduce((a, b) => Math.max(a, b), 0)

            let currentYear = 0
            if (latestYear) {
                currentYear = latestYear + 1
            } else {
                currentYear = new Date().getFullYear()
            }

            //+1 because the year is the year of the gift, not the year of the secret santa
            //if i have 3 years of history, the fourth year is the first year that i can repeat
            const v2condition = values[0].filter((secretSanta) => {
                return (
                    secretSanta.year > latestYear - secret_santa_condition + 1
                )
            })

            v2condition.forEach((secretSanta) => {
                //this finds could be optimized, made outside the loop and stored in a map
                const gifter = personNamesCol.find((person) => {
                    return person._id.equals(secretSanta.gifterId)
                })

                const giftee = personNamesCol.find((person) => {
                    return person._id.equals(secretSanta.gifteeId)
                })

                if (!gifter || !giftee) {
                    console.error('Person not found')
                    return
                }

                AdyMatrix[giftee.idx][gifter.idx] = 1
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
                            year: currentYear,
                        }
                    }

                    return {
                        gifterId: person._id,
                        gifteeId: arr[idx + 1]._id,
                        gifterName: person.name,
                        gifteeName: arr[idx + 1].name,
                        year: currentYear,
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
                            //if the person is the same, skip it, one person can't gift to itself
                            if (i === g.idx) {
                                continue
                            }

                            const newGifter = personNamesCol.find((person) => {
                                return person.idx === i
                            })

                            if (newGifter) {
                                tuple.gifterId = newGifter._id
                                tuple.gifterName = newGifter.name
                            }
                            //skip the loop after finding a new gifter
                            break
                        }
                    }
                }
            })

            console.log(newSecretSantaTuples)

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

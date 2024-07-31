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

        const groupPersonCol = await (
            await getGroupPersonCollection()
        )
            .find({
                group_id: new ObjectId(params.group_id),
            })
            .toArray()

        const persons = groupPersonCol.map((groupPerson) => {
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
        //this part is O(n) because it is just a map with an if
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
                    groupId: new ObjectId(params.group_id),
                }
            })
        )

        if (!insert.acknowledged) {
            throw new Error('Insert to secret santa collection failed')
        }

        //format response as stated in pdf like this: {gifter: giftee}
        const response = secretSantaTuples.map((tuple) => {
            const res = new Object()
            Object.defineProperty(res, tuple.gifterName, {
                value: tuple.gifteeName,
                writable: true,
                enumerable: true,
                configurable: true,
            })
            return res
        })

        return Response.json(response, { status: StatusCodes.OK })
    } catch (error) {
        console.error(error)

        return Response.json({ message: 'An error occurred!' })
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: { group_id: string } }
) {
    try {
        if (!params.group_id || !ObjectId.isValid(params.group_id)) {
            throw new Error('No group id provided')
        }

        const groupPersonCol = await (
            await getGroupPersonCollection()
        )
            .find({
                group_id: new ObjectId(params.group_id),
            })
            .toArray()

        return Response.json(groupPersonCol, { status: StatusCodes.OK })
    } catch (error) {
        console.error(error)
        return Response.json({ message: 'An error occurred!' })
    }
}

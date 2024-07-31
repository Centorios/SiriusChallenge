import { Long, ObjectId } from 'mongodb'
import { Group } from '@/app/types'
import {
    getGroupCollection,
    getGroupPersonCollection,
    getPersonCollection,
} from '@/app/types/db/getCollections'
import { NextRequest } from 'next/server'

export async function POST(
    req: NextRequest,
    { params }: { params: { person_id: string } }
) {
    try {
        if (!req.body) {
            throw new Error('No body provided')
        }

        const data: {
            name: string
        } = await req.json()

        if (!data.name) {
            throw new Error('No name provided')
        }

        const parsedGroup: Group = {
            name: new Long(data.name),
        }

        if (!params.person_id || !ObjectId.isValid(params.person_id)) {
            throw new Error('No person id provided')
        }

        const group = (await getGroupCollection()).findOne({
            name: parsedGroup.name,
        })

        const person = (await getPersonCollection()).findOne({
            _id: new ObjectId(params.person_id),
        })

        await Promise.all([group, person]).then(async (values) => {
            if (!values[0]) {
                throw new Error('Group not found')
            }

            if (!values[1]) {
                throw new Error('Person not found')
            }

            const entityExists = await (
                await getGroupPersonCollection()
            ).findOne({
                group_id: values[0]._id,
                person_id: values[1]._id,
            })

            if (entityExists) {
                throw new Error('Person already in group')
            }

            await (
                await getGroupPersonCollection()
            ).insertOne({
                group_id: values[0]._id,
                person_id: values[1]._id,
            })
        })

        return Response.json({
            message: `Person ${params.person_id} added to group ${parsedGroup.name}`,
        })
    } catch (error) {
        console.error(error)
        return Response.json({ message: 'An error occurred!' }, { status: 400 })
    }
}

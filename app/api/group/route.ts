import { Group } from '@/app/types'
import { getGroupCollection } from '@/app/types/db/getCollections'
import { StatusCodes } from 'http-status-codes'
import { Long } from 'mongodb'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        if (!req.body) {
            throw new Error('No body provided')
        }

        const data: {
            name: string
        } = await req.json()

        if (!data.name || data.name === '') {
            throw new Error('No name provided')
        }

        const parsedGroup: Group = {
            name: new Long(data.name),
        }

        const insert = await (await getGroupCollection()).insertOne(parsedGroup)

        if (!insert.acknowledged) {
            throw new Error('Failed to insert data')
        }
        return Response.json(
            {
                message: `Group ${parsedGroup.name} created! id: ${insert.insertedId}`,
            },
            { status: StatusCodes.OK }
        )
    } catch (error) {
        console.error(error)
        return Response.json(
            { message: 'An error occurred!' },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        )
    }
}

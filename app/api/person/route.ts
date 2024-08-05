import { Person } from '@/app/types'
import { getPersonCollection } from '@/app/types/db/getCollections'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        if (!req.body) {
            throw new Error('No body provided')
        }

        const data: Person = await req.json()

        console.log(data)

        if (!data.name) {
            throw new Error('No name provided')
        }

        const insert = await (await getPersonCollection()).insertOne(data)

        if (!insert.acknowledged) {
            throw new Error('Failed to insert data')
        }
        return Response.json({
            message: `Person ${data.name} created! id: ${insert.insertedId}`,
        })
    } catch (error) {
        console.error(error)
        return Response.json({ message: 'An error occurred!' }, { status: 400 })
    }
}

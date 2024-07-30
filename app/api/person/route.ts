import { getPersonCollection } from '@/app/types/db/getCollections'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        console.log(req.body)
        return Response.json({ message: 'Hello from the API!' })
    } catch (error) {
        console.error(error)

        return Response.json({ message: 'An error occurred!' })
    }
}

export async function GET(req: NextRequest) {
    try {
        const personCol = await getPersonCollection()
        console.log(await personCol.find().toArray())
        return Response.json({ message: 'Hello from the API!' })
    } catch (error) {
        console.error(error)

        return Response.json({ message: 'An error occurred!' })
    }
}

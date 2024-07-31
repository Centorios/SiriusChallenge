import { getGroupPersonCollection } from '@/app/types/db/getCollections'
import { ObjectId } from 'mongodb'
import { NextRequest } from 'next/server'

export async function POST(
    req: NextRequest,
    { params }: { params: { group_id: string } }
) {
    try {
        if (!params.group_id || !ObjectId.isValid(params.group_id)) {
            throw new Error('No person id provided')
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
        const group_id = params.group_id
        console.log(req.body)

        return Response.json({
            message: `Hello from the API!, group_id: ${group_id}`,
        })
    } catch (error) {
        console.error(error)

        return Response.json({ message: 'An error occurred!' }, { status: 400 })
    }
}

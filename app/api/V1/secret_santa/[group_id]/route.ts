import { NextRequest } from 'next/server'

export async function POST(
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

        return Response.json({ message: 'An error occurred!' })
    }
}

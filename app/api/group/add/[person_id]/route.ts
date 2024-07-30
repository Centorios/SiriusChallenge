import { NextRequest } from 'next/server'

export async function POST(
    req: NextRequest,
    { params }: { params: { person_id: string } }
) {
    try {
        const person_id = params.person_id
        console.log(req.body)

        return Response.json({
            message: `Hello from the API!, person_id: ${person_id}`,
        })
    } catch (error) {
        console.error(error)

        return Response.json({ message: 'An error occurred!' })
    }
}

import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const body = req.body

        console.log(body)

        return Response.json({ message: 'Hello from the API!' })
    } catch (error) {
        console.error(error)

        return Response.json({ message: 'An error occurred!' })
    }
}

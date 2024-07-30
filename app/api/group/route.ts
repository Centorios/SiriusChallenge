import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    console.log(req.body);
    return Response.json({ message: 'Hello from the API!' });
  } catch (error) {
    console.error(error);

    return Response.json({ message: 'An error occurred!' });
  }
}

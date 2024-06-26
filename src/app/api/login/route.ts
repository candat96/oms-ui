import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const response = await req.json()

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json(
      {
        message: ['Email or Password is invalid']
      },
      {
        status: 401,
        statusText: 'Unauthorized Access'
      }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  
  const response = await fetch('http://localhost:3001/api/match', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to process resume' }, { status: 500 })
  }

  const data = await response.json()
  return NextResponse.json(data)
}


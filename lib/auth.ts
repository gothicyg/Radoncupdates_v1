import { NextRequest, NextResponse } from 'next/server'

export function requireAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) return false

  const encoded = authHeader.split(' ')[1]
  const decoded = Buffer.from(encoded, 'base64').toString()
  const [_, password] = decoded.split(':')

  return password === process.env.ADMIN_PASSWORD
}

export function withAdminAuth(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    if (!requireAuth(req)) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin"',
        },
      })
    }

    return handler(req)
  }
}
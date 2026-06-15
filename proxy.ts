import { NextRequest, NextResponse } from 'next/server'

export function proxy(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const auth = req.headers.get('authorization')

  if (!auth) {
    return new Response('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    })
  }

  const encoded = auth.split(' ')[1]
  const decoded = atob(encoded)

  const [, password] = decoded.split(':')

  if (password !== process.env.ADMIN_PASSWORD) {
    return new Response('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/auth/signin') return;

  const token = await getToken({ req: request });

  if (!token) {
    const url = new URL(`/auth/signin`, request.url);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: '/',
};

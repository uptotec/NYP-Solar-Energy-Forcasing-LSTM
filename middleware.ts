import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

const protectedFront = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const protectedPaths = ['/'];
  const adminPaths = ['/admin'];
  const ownerPaths: string[] = [];

  const matchesProtectedPath = protectedPaths.some((path) => pathname === path);
  const matchesAdminPath = adminPaths.some((path) => pathname.startsWith(path));
  const matchesOwnerPath = ownerPaths.some((path) => pathname.startsWith(path));

  if (matchesProtectedPath || matchesAdminPath || matchesOwnerPath) {
    const token = await getToken({ req: request });

    if (!token) {
      const url = new URL(`/auth/signin`, request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }

    if (
      matchesAdminPath &&
      token.userType !== 'admin' &&
      token.userType !== 'owner'
    ) {
      const url = new URL(`/`, request.url);
      return NextResponse.redirect(url);
    }

    if (matchesOwnerPath && token.userType !== 'owner') {
      const url = new URL(`/`, request.url);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
};

const protectedApi = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const protectedApiPaths = ['/api/auth/me', '/api/auth/editProfile'];
  const protectedAdminApiPaths = [
    '/api/auth/getUsers',
    '/api/auth/deleteUser',
    '/api/auth/getUsersFile',
  ];
  const protectedOwnerApiPaths = ['/api/auth/addAdmin', '/api/auth/getAdmins'];

  const matchesProtectedPath = protectedApiPaths.some((path) =>
    pathname.startsWith(path)
  );
  const matchesAdminPath = protectedAdminApiPaths.some((path) =>
    pathname.startsWith(path)
  );
  const matchesOwnerPath = protectedOwnerApiPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (matchesProtectedPath || matchesAdminPath || matchesOwnerPath) {
    const token = await getToken({ req: request });

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (
      matchesAdminPath &&
      token.userType !== 'admin' &&
      token.userType !== 'owner'
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (matchesOwnerPath && token.userType !== 'owner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  NextResponse.next();
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api')) return await protectedApi(request);
  else return await protectedFront(request);
}

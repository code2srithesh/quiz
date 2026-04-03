import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = [
    '/',
    '/sign-in',
    '/sign-up',
];

export default function middleware(request: NextRequest) {
    const { userId } = auth();
    const isPublic = publicRoutes.includes(request.nextUrl.pathname) ||
        request.nextUrl.pathname.startsWith('/sign-in') ||
        request.nextUrl.pathname.startsWith('/sign-up') ||
        request.nextUrl.pathname.startsWith('/api/public');

    if (!isPublic && !userId) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    if ((request.nextUrl.pathname.startsWith('/sign-in') ||
        request.nextUrl.pathname.startsWith('/sign-up')) && userId) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};

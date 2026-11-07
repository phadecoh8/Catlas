// TODO: apps/web/src/middleware.ts
import {
    NextResponse,
    type NextRequest,
} from 'next/server';

export function proxy(
    request: NextRequest,
    url: string,
) {
    return NextResponse.next();
}
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { APIResponse } from '@/types';
import { revokeAllSessions } from '@/lib/firebase/admin';

export async function GET() {
    const sessionCookie = (await cookies()).get('__session')?.value;

    if (!sessionCookie)
        return NextResponse.json<APIResponse<string>>(
            { success: false, error: 'Session not found.' },
            { status: 400 }
        );

    (await cookies()).delete('__session');

    await revokeAllSessions(sessionCookie);

    return NextResponse.json<APIResponse<string>>({
        success: true,
        data: 'Signed out successfully.',
    });
}

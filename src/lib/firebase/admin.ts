// https://stackademic.com/blog/next-js-14-server-side-authentication-using-cookies-with-firebase-admin-sdk
import 'server-only';

import { cookies } from 'next/headers';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth, SessionCookieOptions } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

export const firebaseApp =
    getApps().find((it) => it.name === 'firebase-admin-app') ||
    initializeApp({ credential: cert({}) }, 'firebase-admin-app');

export const authAdmin = getAuth(firebaseApp);
export const firestoreAdmin = getFirestore(firebaseApp);

/**
 * Checks whether a user is authenticated or not by controlling the session cookie.
 * This function is only accessible inside server components, server actions or route handlers.
 */
export async function isUserAuthenticated(session?: string) {
    const _session = session ?? (await getSession());
    if (!_session) return false;

    try {
        const isRevoked = !(await authAdmin.verifySessionCookie(_session, true));
        return !isRevoked;
    } catch (error) {
        console.log(error);
        return false;
    }
}

/** Gets current user’s information if user is authenticated */
export async function getCurrentUser() {
    const session = await getSession();

    if (!(await isUserAuthenticated(session))) {
        return null;
    }

    const decodedIdToken = await authAdmin.verifySessionCookie(session!);
    const currentUser = await authAdmin.getUser(decodedIdToken.uid);

    return currentUser;
}

/** Gets the user's session from the cookie */
async function getSession() {
    try {
        return (await cookies()).get('__session')?.value;
    } catch {
        return undefined;
    }
}

/** Wrapper function on top of the Firebase admin’s auth function */
export async function createSessionCookie(
    idToken: string,
    sessionCookieOptions: SessionCookieOptions
) {
    return authAdmin.createSessionCookie(idToken, sessionCookieOptions);
}

/** Revokes all sessions */
export async function revokeAllSessions(session: string) {
    const decodedIdToken = await authAdmin.verifySessionCookie(session);

    return await authAdmin.revokeRefreshTokens(decodedIdToken.sub);
}

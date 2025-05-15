// https://github.com/vercel/platforms/blob/main/lib/subdomains.ts
import { firestoreAdmin } from './firebase/admin';

export async function getSubdomainData(subdomain: string) {
    const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
    // const data = await redis.get<SubdomainData>(`subdomain:${sanitizedSubdomain}`);
    const data = await firestoreAdmin.collection('subdomains').doc(sanitizedSubdomain).get();
    return data;
}

export async function getAllSubdomains() {
    // const keys = await redis.keys('subdomain:*');
    const snapshot = await firestoreAdmin.collection('subdomains').get();
    const keys = snapshot.docs.map((doc) => doc.id);

    if (!keys.length) {
        return [];
    }

    // const values = await redis.mget<SubdomainData[]>(...keys);

    return keys.map((key, index) => {
        const subdomain = key.replace('subdomain:', '');
        // const data = values[index];

        return {
            subdomain,
            // emoji: data?.emoji || '❓',
            // createdAt: data?.createdAt || Date.now(),
        };
    });
}

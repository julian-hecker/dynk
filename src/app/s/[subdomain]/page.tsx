import { AsyncParams } from '@/types';

export type SubdomainPageProps = AsyncParams<{ subdomain: string }>;

export default async function SubdomainPage({ params }: SubdomainPageProps) {
    const { subdomain } = await params;
    return <div>{subdomain} Subdomain Page</div>;
}

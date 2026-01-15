import { Metadata } from 'next';
import { CompanyDetailRedesign } from '@/components/company-detail-redesign';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  // Format company name from slug
  const companyName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${companyName} - Company Profile`,
    description: `View detailed information for ${companyName} including company metrics, products, partnerships, and customers.`,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  return <CompanyDetailRedesign companyId={slug} />;
}

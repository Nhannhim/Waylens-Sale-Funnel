import { Metadata } from 'next';
import { CompanyDetailPage } from '@/components/company-detail-page';
import companyDataset from '@/public/data/companies-dataset.json';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all companies
export async function generateStaticParams() {
  return companyDataset.companies.map((company: any) => ({
    slug: company.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = companyDataset.companies.find((c: any) => c.id === slug);
  
  if (!company) {
    return {
      title: 'Company Not Found',
    };
  }

  return {
    title: `${company.name} - Company Profile`,
    description: `View detailed information about ${company.name} including revenue, fleet size, markets, and more.`,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  
  return <CompanyDetailPage companyId={slug} />;
}

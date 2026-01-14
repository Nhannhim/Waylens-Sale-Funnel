import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Search query required' }, { status: 400 });
  }

  try {
    // Mock documents that would come from various sources
    // In production, this would fetch from:
    // - News APIs
    // - Research databases
    // - Company filings
    // - Industry reports
    // - Social media
    
    const documents = [
      {
        id: '1',
        type: 'news',
        title: `${query} Announces Q4 2024 Financial Results`,
        snippet: `${query} reported strong quarterly earnings with revenue growth of 25% year-over-year in the fleet management sector...`,
        source: 'Business Wire',
        date: '2024-01-10',
        category: 'Earnings & Events',
        relevance: 95
      },
      {
        id: '2',
        type: 'research',
        title: `Fleet Management Market Analysis: ${query}'s Position`,
        snippet: `Industry analysis shows ${query} maintains a leading position in the telematics market with significant customer adoption...`,
        source: 'Gartner Research',
        date: '2024-01-08',
        category: 'Research',
        relevance: 88
      },
      {
        id: '3',
        type: 'partnership',
        title: `${query} Partners with Major Fleet Operators`,
        snippet: `Strategic partnership announcement reveals ${query} expanding into new verticals with enterprise customers...`,
        source: 'TechCrunch',
        date: '2024-01-05',
        category: 'Integrations & Notes',
        relevance: 82
      },
      {
        id: '4',
        type: 'product',
        title: `${query} Launches New Video Telematics Solution`,
        snippet: `Product launch includes AI-powered safety features and driver behavior monitoring for commercial fleets...`,
        source: 'FleetOwner',
        date: '2024-01-03',
        category: 'Company Docs',
        relevance: 78
      },
      {
        id: '5',
        type: 'customer',
        title: `Case Study: Enterprise Fleet Management with ${query}`,
        snippet: `Customer success story highlights 30% reduction in operational costs and improved fleet efficiency...`,
        source: 'Customer Reference',
        date: '2023-12-28',
        category: 'Expert Calls',
        relevance: 75
      },
      {
        id: '6',
        type: 'market',
        title: `${query} Market Share Analysis 2024`,
        snippet: `Market research indicates ${query}'s growth in North American fleet management with focus on SMB segment...`,
        source: 'Frost & Sullivan',
        date: '2023-12-20',
        category: 'Research',
        relevance: 72
      },
      {
        id: '7',
        type: 'technology',
        title: `${query} Technology Stack and Platform Overview`,
        snippet: `Technical deep-dive into ${query}'s cloud-based architecture and API integrations for fleet operations...`,
        source: 'Tech Report',
        date: '2023-12-15',
        category: 'Company Docs',
        relevance: 68
      }
    ];

    return NextResponse.json({
      query,
      totalResults: documents.length,
      documents
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

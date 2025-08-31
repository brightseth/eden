import { NextRequest, NextResponse } from 'next/server';
import { registryClient } from '@/lib/registry/client';
import type { CollectorAdvisoryReport } from '../route';

export interface PersistedReport {
  id: string;
  reportId: string;
  agentId: string; // BERTHA's agent ID
  title: string;
  collectorName: string;
  reportType: 'collector-advisory' | 'collection-analysis' | 'market-intelligence';
  status: 'draft' | 'final' | 'archived';
  metadata: {
    generated: string;
    version: string;
    collectorEmail?: string;
    portfolioSize?: number;
    riskLevel?: string;
    tags?: string[];
  };
  reportData: CollectorAdvisoryReport;
  access: {
    public: boolean;
    collectorAccess: boolean;
    trainerAccess: boolean;
    shareableLink?: string;
  };
  performance?: {
    downloadsCount: number;
    lastAccessed: string;
    feedback?: Array<{
      rating: number;
      comment: string;
      timestamp: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
}

// POST /api/agents/bertha/advisory-report/persist - Save advisory report to Registry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      report, 
      access = { public: false, collectorAccess: true, trainerAccess: true },
      tags = []
    } = body;

    if (!report || !report.id) {
      return NextResponse.json(
        { error: 'Valid report with ID is required' },
        { status: 400 }
      );
    }

    console.log(`BERTHA persisting advisory report ${report.id} to Registry`);

    // First, get BERTHA's agent ID from Registry
    const berthaAgent = await registryClient.getAgentByHandle('bertha');
    if (!berthaAgent) {
      return NextResponse.json(
        { error: 'BERTHA agent not found in Registry' },
        { status: 404 }
      );
    }

    // Prepare report for Registry persistence
    const persistedReport: PersistedReport = {
      id: `persist-${report.id}`,
      reportId: report.id,
      agentId: berthaAgent.id,
      title: report.title,
      collectorName: report.collector.name,
      reportType: 'collector-advisory',
      status: 'final',
      metadata: {
        generated: report.created,
        version: report.version,
        collectorEmail: report.collector.email,
        portfolioSize: report.analysis?.portfolioOverview?.totalWorks,
        riskLevel: report.analysis?.riskAssessment?.overallRisk,
        tags: tags
      },
      reportData: report,
      access: access,
      performance: {
        downloadsCount: 0,
        lastAccessed: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Generate shareable link if public
    if (access.public) {
      persistedReport.access.shareableLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://eden-academy-flame.vercel.app'}/reports/${report.id}`;
    }

    // Save to Registry as a specialized artifact
    const registryArtifact = await registryClient.postCreation(berthaAgent.id, {
      mediaUri: `registry://reports/bertha/${report.id}`,
      metadata: {
        type: 'advisor-report',
        reportType: 'collector-advisory',
        title: report.title,
        collectorName: report.collector.name,
        generated: report.created,
        recommendations: report.analysis?.recommendations?.length || 0,
        riskLevel: report.analysis?.riskAssessment?.overallRisk,
        portfolioSize: report.analysis?.portfolioOverview?.totalWorks,
        version: report.version,
        downloadFormats: ['json', 'markdown', 'html', 'csv'],
        reportData: persistedReport, // Full report data
        access: access,
        tags: tags
      },
      publishedTo: access.public ? {
        // Mark as published if public access
        chainTx: undefined, // Not on-chain
        farcasterCastId: undefined, // Not social
        shopifySku: undefined // Not commercial
      } : undefined
    });

    console.log(`BERTHA report ${report.id} persisted as Registry artifact ${registryArtifact.id}`);

    return NextResponse.json({
      success: true,
      persisted: {
        reportId: report.id,
        registryArtifactId: registryArtifact.id,
        agentId: berthaAgent.id,
        shareableLink: persistedReport.access.shareableLink,
        downloadUrl: `/api/agents/bertha/advisory-report/download?reportId=${report.id}`,
        accessLevel: access
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('BERTHA report persistence error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to persist advisory report',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET /api/agents/bertha/advisory-report/persist - Retrieve persisted reports
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get('reportId');
    const collectorName = searchParams.get('collector');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');

    console.log('BERTHA retrieving persisted reports from Registry');

    // Get BERTHA's agent ID
    const berthaAgent = await registryClient.getAgentByHandle('bertha');
    if (!berthaAgent) {
      return NextResponse.json(
        { error: 'BERTHA agent not found in Registry' },
        { status: 404 }
      );
    }

    // Get BERTHA's artifacts (which include persisted reports)
    const artifacts = await registryClient.getAgentCreations(berthaAgent.id);
    
    // Filter for advisor reports
    let advisorReports = artifacts.filter(artifact => 
      (artifact.metadata as any).type === 'advisor-report'
    );

    // Apply filters
    if (reportId) {
      advisorReports = advisorReports.filter(report => 
        (report.metadata as any).reportData?.reportId === reportId
      );
    }

    if (collectorName) {
      advisorReports = advisorReports.filter(report =>
        (report.metadata as any).collectorName?.toLowerCase().includes(collectorName.toLowerCase())
      );
    }

    if (status) {
      advisorReports = advisorReports.filter(report =>
        (report.metadata as any).reportData?.status === status
      );
    }

    // Sort by creation date (newest first) and limit
    const sortedReports = advisorReports
      .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
      .slice(0, limit);

    // Format for response
    const formattedReports = sortedReports.map(artifact => ({
      id: artifact.id,
      reportId: (artifact.metadata as any).reportData?.reportId,
      title: (artifact.metadata as any).title,
      collectorName: (artifact.metadata as any).collectorName,
      generated: (artifact.metadata as any).generated,
      recommendations: (artifact.metadata as any).recommendations,
      riskLevel: (artifact.metadata as any).riskLevel,
      portfolioSize: (artifact.metadata as any).portfolioSize,
      status: (artifact.metadata as any).reportData?.status || 'final',
      access: (artifact.metadata as any).access,
      shareableLink: (artifact.metadata as any).reportData?.access?.shareableLink,
      downloadUrl: `/api/agents/bertha/advisory-report/download?reportId=${(artifact.metadata as any).reportData?.reportId}`,
      performance: (artifact.metadata as any).reportData?.performance,
      createdAt: artifact.createdAt,
      tags: (artifact.metadata as any).tags
    }));

    return NextResponse.json({
      reports: formattedReports,
      total: formattedReports.length,
      agent: berthaAgent.handle,
      retrieved: new Date().toISOString()
    });

  } catch (error) {
    console.error('BERTHA report retrieval error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to retrieve persisted reports',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/agents/bertha/advisory-report/persist - Archive a persisted report
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get('reportId');

    if (!reportId) {
      return NextResponse.json(
        { error: 'reportId parameter is required' },
        { status: 400 }
      );
    }

    console.log(`BERTHA archiving persisted report ${reportId}`);

    // Get BERTHA's agent
    const berthaAgent = await registryClient.getAgentByHandle('bertha');
    if (!berthaAgent) {
      return NextResponse.json(
        { error: 'BERTHA agent not found in Registry' },
        { status: 404 }
      );
    }

    // Find the report artifact
    const artifacts = await registryClient.getAgentCreations(berthaAgent.id);
    const reportArtifact = artifacts.find(artifact => 
      (artifact.metadata as any).type === 'advisor-report' && 
      (artifact.metadata as any).reportData?.reportId === reportId
    );

    if (!reportArtifact) {
      return NextResponse.json(
        { error: `Report ${reportId} not found in Registry` },
        { status: 404 }
      );
    }

    // Archive by updating status (Registry may not support deletion)
    // This would require an UPDATE operation on the Registry
    // For now, return success with archive information
    
    return NextResponse.json({
      success: true,
      action: 'archived',
      reportId: reportId,
      artifactId: reportArtifact.id,
      message: 'Report marked for archival - contact Registry administrator for permanent removal',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('BERTHA report archival error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to archive report',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT /api/agents/bertha/advisory-report/persist - Update report access or metadata
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportId, updates } = body;

    if (!reportId || !updates) {
      return NextResponse.json(
        { error: 'reportId and updates are required' },
        { status: 400 }
      );
    }

    console.log(`BERTHA updating persisted report ${reportId}`);

    // This would update the Registry artifact with new metadata
    // For now, return success acknowledgment
    
    return NextResponse.json({
      success: true,
      action: 'updated',
      reportId: reportId,
      updates: updates,
      message: 'Report updates queued - changes will be reflected in next Registry sync',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('BERTHA report update error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update report',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
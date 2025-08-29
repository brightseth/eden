import { NextRequest, NextResponse } from 'next/server';
import type { CollectorAdvisoryReport } from '../route';

// GET /api/agents/bertha/advisory-report/download - Download advisory report as various formats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get('reportId');
    const format = searchParams.get('format') || 'json';
    const collectorName = searchParams.get('collector') || 'Unknown';

    if (!reportId) {
      return NextResponse.json(
        { error: 'reportId parameter is required' },
        { status: 400 }
      );
    }

    // For now, generate a sample report - in production, this would fetch from storage
    const report = await generateDownloadableReport(reportId, collectorName);

    switch (format.toLowerCase()) {
      case 'json':
        return downloadAsJSON(report);
      
      case 'pdf':
        return downloadAsPDF(report);
      
      case 'markdown':
      case 'md':
        return downloadAsMarkdown(report);
      
      case 'csv':
        return downloadAsCSV(report);
      
      default:
        return NextResponse.json(
          { error: `Unsupported format: ${format}. Supported formats: json, pdf, markdown, csv` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('BERTHA report download error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to download advisory report',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/agents/bertha/advisory-report/download - Generate and download custom report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportData, format = 'json', filename } = body;

    if (!reportData) {
      return NextResponse.json(
        { error: 'reportData is required' },
        { status: 400 }
      );
    }

    const customFilename = filename || `bertha-advisory-${Date.now()}`;

    switch (format.toLowerCase()) {
      case 'json':
        return downloadAsJSON(reportData, customFilename);
      
      case 'pdf':
        return downloadAsPDF(reportData, customFilename);
      
      case 'markdown':
        return downloadAsMarkdown(reportData, customFilename);
      
      case 'csv':
        return downloadAsCSV(reportData, customFilename);
      
      default:
        return NextResponse.json(
          { error: `Unsupported format: ${format}` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('BERTHA custom report download error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate custom report download',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper functions for different download formats

function downloadAsJSON(report: any, filename?: string): NextResponse {
  const jsonContent = JSON.stringify(report, null, 2);
  const reportFilename = filename || `bertha-advisory-${report.id || Date.now()}.json`;
  
  return new NextResponse(jsonContent, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${reportFilename}"`,
      'Content-Length': jsonContent.length.toString()
    }
  });
}

function downloadAsMarkdown(report: any, filename?: string): NextResponse {
  const markdownContent = generateMarkdownReport(report);
  const reportFilename = filename || `bertha-advisory-${report.id || Date.now()}.md`;
  
  return new NextResponse(markdownContent, {
    headers: {
      'Content-Type': 'text/markdown',
      'Content-Disposition': `attachment; filename="${reportFilename}"`,
      'Content-Length': markdownContent.length.toString()
    }
  });
}

function downloadAsPDF(report: any, filename?: string): NextResponse {
  // Generate HTML content for PDF conversion
  const htmlContent = generateHTMLReport(report);
  const reportFilename = filename || `bertha-advisory-${report.id || Date.now()}.html`;
  
  // For now, return HTML that can be printed to PDF
  // In production, this would use a PDF generation library like puppeteer
  return new NextResponse(htmlContent, {
    headers: {
      'Content-Type': 'text/html',
      'Content-Disposition': `attachment; filename="${reportFilename}"`,
      'Content-Length': htmlContent.length.toString(),
      'X-PDF-Instructions': 'Use browser print-to-PDF for best results'
    }
  });
}

function downloadAsCSV(report: any, filename?: string): NextResponse {
  const csvContent = generateCSVReport(report);
  const reportFilename = filename || `bertha-advisory-${report.id || Date.now()}.csv`;
  
  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${reportFilename}"`,
      'Content-Length': csvContent.length.toString()
    }
  });
}

// Content generation functions

function generateMarkdownReport(report: CollectorAdvisoryReport): string {
  const date = new Date(report.created).toLocaleDateString();
  
  return `# ${report.title}

**Generated:** ${date}  
**Collector:** ${report.collector.name}  
**Report ID:** ${report.id}  
**Version:** ${report.version}

---

## Executive Summary

This collection advisory report provides comprehensive analysis and recommendations for ${report.collector.name}'s art collection strategy. The analysis leverages BERTHA's trained collector archetypes and real-time market intelligence to deliver actionable insights.

## Portfolio Analysis

### Overview
- **Total Works Analyzed:** ${report.analysis?.portfolioOverview?.totalWorks || 'N/A'}
- **Overall Quality Score:** ${report.analysis?.portfolioOverview?.overallScore ? Math.round(report.analysis.portfolioOverview.overallScore * 100) + '%' : 'N/A'}

### Quality Distribution
${report.analysis?.portfolioOverview?.qualityDistribution ? `
- **Exceptional:** ${report.analysis.portfolioOverview.qualityDistribution.exceptional} works
- **Strong:** ${report.analysis.portfolioOverview.qualityDistribution.strong} works
- **Solid:** ${report.analysis.portfolioOverview.qualityDistribution.solid} works
- **Emerging:** ${report.analysis.portfolioOverview.qualityDistribution.emerging} works
` : ''}

### Key Strengths
${report.analysis?.portfolioOverview?.keyStrengths?.map(strength => `- ${strength}`).join('\n') || 'No strengths identified'}

### Areas for Improvement
${report.analysis?.portfolioOverview?.improvementAreas?.map(area => `- ${area}`).join('\n') || 'No improvement areas identified'}

## Market Intelligence

### Current Trends
${report.analysis?.marketIntelligence?.currentTrends?.map(trend => `- ${trend}`).join('\n') || 'Market trends analysis not available'}

### Emerging Opportunities
${report.analysis?.marketIntelligence?.emergingOpportunities?.map(opp => `- ${opp}`).join('\n') || 'No emerging opportunities identified'}

### Market Risks
${report.analysis?.marketIntelligence?.marketRisks?.map(risk => `- ${risk}`).join('\n') || 'No specific market risks identified'}

## Collection Recommendations

${report.analysis?.recommendations?.map((rec, index) => `
### ${index + 1}. ${rec.category} (${rec.priority.toUpperCase()} PRIORITY)

**Action:** ${rec.action.toUpperCase()}  
**Timeline:** ${rec.timeline}  
**Budget:** ${rec.budget}  

**Rationale:** ${rec.rationale}

${rec.specificWorks ? `**Specific Works:** ${rec.specificWorks.join(', ')}` : ''}
`).join('\n') || 'No specific recommendations available'}

## Risk Assessment

**Overall Risk Level:** ${report.analysis?.riskAssessment?.overallRisk?.toUpperCase() || 'UNKNOWN'}  
**Diversification Score:** ${report.analysis?.riskAssessment?.diversificationScore ? Math.round(report.analysis.riskAssessment.diversificationScore * 100) + '%' : 'N/A'}

### Risk Factors
${report.analysis?.riskAssessment?.riskFactors?.map(factor => `
- **${factor.factor}** (${factor.severity.toUpperCase()})
  - Mitigation: ${factor.mitigation}
`).join('\n') || 'No specific risk factors identified'}

### Risk Mitigation Recommendations
${report.analysis?.riskAssessment?.recommendations?.map(rec => `- ${rec}`).join('\n') || 'No risk mitigation recommendations available'}

---

## Methodology & Disclaimers

### Analysis Methodology
${report.appendix?.methodologyNotes?.map(note => `- ${note}`).join('\n') || 'Methodology notes not available'}

### Data Sources
${report.appendix?.dataSourcesUsed?.map(source => `- ${source}`).join('\n') || 'Data sources not specified'}

### Important Disclaimers
${report.appendix?.disclaimers?.map(disclaimer => `> ${disclaimer}`).join('\n\n') || 'Standard disclaimers apply'}

---

*This report was generated by BERTHA, Eden Academy's Collection Intelligence Agent, using trained collector psychology models and real-time market data. For questions about this analysis, contact the Eden Academy team.*

**Report Generated:** ${new Date().toISOString()}
`;
}

function generateHTMLReport(report: CollectorAdvisoryReport): string {
  const date = new Date(report.created).toLocaleDateString();
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${report.title}</title>
    <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
        .title { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .meta { color: #666; font-size: 14px; }
        .section { margin-bottom: 30px; }
        .section h2 { border-bottom: 1px solid #ddd; padding-bottom: 10px; }
        .section h3 { color: #444; margin-top: 20px; }
        .recommendation { background: #f9f9f9; padding: 15px; margin: 10px 0; border-left: 4px solid #007acc; }
        .priority-high { border-left-color: #e74c3c; }
        .priority-medium { border-left-color: #f39c12; }
        .priority-low { border-left-color: #27ae60; }
        .risk-high { color: #e74c3c; font-weight: bold; }
        .risk-medium { color: #f39c12; font-weight: bold; }
        .risk-low { color: #27ae60; font-weight: bold; }
        .disclaimer { background: #fff9c4; padding: 15px; border: 1px solid #f0d000; margin-top: 30px; font-size: 12px; }
        ul { padding-left: 20px; }
        @media print {
            body { max-width: none; padding: 10px; }
            .header { page-break-after: avoid; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">${report.title}</div>
        <div class="meta">
            Generated: ${date} | Collector: ${report.collector.name} | Report ID: ${report.id}
        </div>
    </div>

    <div class="section">
        <h2>Executive Summary</h2>
        <p>This collection advisory report provides comprehensive analysis and recommendations for ${report.collector.name}'s art collection strategy. The analysis leverages BERTHA's trained collector archetypes and real-time market intelligence to deliver actionable insights.</p>
    </div>

    <div class="section">
        <h2>Portfolio Analysis</h2>
        <h3>Overview</h3>
        <ul>
            <li><strong>Total Works:</strong> ${report.analysis?.portfolioOverview?.totalWorks || 'N/A'}</li>
            <li><strong>Overall Quality:</strong> ${report.analysis?.portfolioOverview?.overallScore ? Math.round(report.analysis.portfolioOverview.overallScore * 100) + '%' : 'N/A'}</li>
        </ul>

        ${report.analysis?.portfolioOverview?.qualityDistribution ? `
        <h3>Quality Distribution</h3>
        <ul>
            <li>Exceptional: ${report.analysis.portfolioOverview.qualityDistribution.exceptional} works</li>
            <li>Strong: ${report.analysis.portfolioOverview.qualityDistribution.strong} works</li>
            <li>Solid: ${report.analysis.portfolioOverview.qualityDistribution.solid} works</li>
            <li>Emerging: ${report.analysis.portfolioOverview.qualityDistribution.emerging} works</li>
        </ul>
        ` : ''}
    </div>

    ${report.analysis?.recommendations?.length ? `
    <div class="section">
        <h2>Collection Recommendations</h2>
        ${report.analysis.recommendations.map((rec, index) => `
        <div class="recommendation priority-${rec.priority}">
            <h3>${index + 1}. ${rec.category}</h3>
            <p><strong>Action:</strong> ${rec.action.toUpperCase()}</p>
            <p><strong>Priority:</strong> ${rec.priority.toUpperCase()}</p>
            <p><strong>Timeline:</strong> ${rec.timeline}</p>
            <p><strong>Rationale:</strong> ${rec.rationale}</p>
        </div>
        `).join('')}
    </div>
    ` : ''}

    <div class="section">
        <h2>Risk Assessment</h2>
        <p><strong>Overall Risk:</strong> <span class="risk-${report.analysis?.riskAssessment?.overallRisk || 'medium'}">${report.analysis?.riskAssessment?.overallRisk?.toUpperCase() || 'UNKNOWN'}</span></p>
        ${report.analysis?.riskAssessment?.diversificationScore ? `<p><strong>Diversification Score:</strong> ${Math.round(report.analysis.riskAssessment.diversificationScore * 100)}%</p>` : ''}
    </div>

    <div class="disclaimer">
        <h3>Important Disclaimers</h3>
        ${report.appendix?.disclaimers?.map(disclaimer => `<p>${disclaimer}</p>`).join('') || '<p>Standard disclaimers apply</p>'}
        <p><em>Generated by BERTHA Collection Intelligence Agent - ${new Date().toISOString()}</em></p>
    </div>
</body>
</html>`;
}

function generateCSVReport(report: CollectorAdvisoryReport): string {
  const headers = ['Category', 'Priority', 'Action', 'Timeline', 'Rationale'];
  const rows = report.analysis?.recommendations?.map(rec => [
    `"${rec.category}"`,
    `"${rec.priority}"`,
    `"${rec.action}"`,
    `"${rec.timeline}"`,
    `"${rec.rationale.replace(/"/g, '""')}"`
  ]) || [];

  return [
    `# BERTHA Collection Advisory Report - ${report.collector.name}`,
    `# Generated: ${new Date(report.created).toLocaleDateString()}`,
    `# Report ID: ${report.id}`,
    '',
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
}

async function generateDownloadableReport(reportId: string, collectorName: string): Promise<CollectorAdvisoryReport> {
  // This would normally fetch from storage/registry
  // For now, generate a sample report
  return {
    id: reportId,
    title: `Collection Advisory Report for ${collectorName}`,
    created: new Date().toISOString(),
    collector: {
      name: collectorName,
      portfolio: 'Sample Portfolio'
    },
    analysis: {
      portfolioOverview: {
        totalWorks: 25,
        mediumBreakdown: { 'Digital Art': 15, 'Photography': 6, 'Generative': 4 },
        qualityDistribution: { exceptional: 3, strong: 12, solid: 8, emerging: 2 },
        overallScore: 0.78,
        keyStrengths: [
          'Strong digital art focus',
          'High-quality curation standards',
          'Diverse artistic approaches'
        ],
        improvementAreas: [
          'Add more exceptional flagship pieces',
          'Consider emerging AI categories',
          'Expand cross-platform presence'
        ]
      },
      marketIntelligence: {
        currentTrends: [
          'AI-generated art gaining institutional recognition',
          'Digital photography commanding premium prices',
          'Cross-chain collections showing resilience'
        ],
        emergingOpportunities: [
          'Eden Academy agent works showing strong trajectory',
          'Registry-verified pieces becoming standard',
          'Multi-modal AI art expanding market'
        ],
        marketRisks: [
          'Platform concentration risk',
          'Regulatory uncertainty in digital collectibles',
          'Market volatility affecting pricing'
        ],
        priceTargets: [
          {
            category: 'Digital Art',
            recommendation: 'Accumulate quality pieces at current levels',
            rationale: 'Strong institutional adoption driving long-term value'
          }
        ]
      },
      recommendations: [
        {
          priority: 'high',
          category: 'Exceptional Quality Works',
          action: 'acquire',
          rationale: 'Portfolio needs flagship exceptional pieces to anchor collection value',
          timeline: 'Next 30 days',
          budget: 'Primary allocation',
          specificWorks: ['Registry-verified exceptional pieces', 'Agent-created masterworks']
        },
        {
          priority: 'medium',
          category: 'Medium Diversification',
          action: 'acquire',
          rationale: 'Reduce concentration risk by expanding into complementary mediums',
          timeline: '3-6 months',
          budget: 'Secondary allocation'
        }
      ],
      riskAssessment: {
        overallRisk: 'medium',
        riskFactors: [
          {
            factor: 'Medium Concentration',
            severity: 'medium',
            mitigation: 'Diversify across artistic mediums and techniques'
          }
        ],
        diversificationScore: 0.72,
        recommendations: [
          'Maintain Registry verification for new acquisitions',
          'Monitor agent performance metrics',
          'Consider cross-platform distribution'
        ]
      }
    },
    appendix: {
      methodologyNotes: [
        'Analysis based on BERTHA\'s trained collector archetypes',
        'Market intelligence from real-time data sources',
        'Registry Works evaluated for significance'
      ],
      dataSourcesUsed: [
        'Eden Genesis Registry',
        'Live market intelligence',
        'BERTHA trained models'
      ],
      disclaimers: [
        'This report is for informational purposes only',
        'Art investments carry inherent risk',
        'BERTHA is experimental - human verification recommended'
      ]
    },
    version: '1.0.0'
  };
}
# /research - Comprehensive Business Research Command

## Description
Orchestrates multiple specialized research agents to conduct thorough business intelligence gathering and analysis. Creates individual reports from each agent and a final consolidated MISI report.

## Usage
```
/research --company="CompanyName" [--product="ProductName"] [--rfp-file="path/to/rfp.pdf"]
```

## Parameters
- `company` (required): Target company name for research
- `product` (optional): Specific product to research
- `rfp-file` (optional): Path to RFP document for analysis

## Agent Orchestration Flow

1. **Market Research Analyst** → `market-analysis-{company}.md`
2. **Product Research Analyst** → `product-research-{company}.md`  
3. **Stakeholder Psychologist** → `stakeholder-profiles-{company}.md`
4. **Trend Researcher** → `market-trends-{company}.md`
5. **RFP Analyzer** (if RFP provided) → `rfp-analysis-{company}.md`
6. **MISI Report Synthesizer** → `misi-report-{company}.md`

## Implementation

```javascript
export const researchCommand = {
  name: 'research',
  description: 'Conduct comprehensive business research using multiple specialized agents',
  
  parameters: [
    {
      name: 'company',
      type: 'string',
      required: true,
      description: 'Target company name for research'
    },
    {
      name: 'product', 
      type: 'string',
      required: false,
      description: 'Specific product to research'
    },
    {
      name: 'rfp-file',
      type: 'string', 
      required: false,
      description: 'Path to RFP document for analysis'
    }
  ],

  async execute(args) {
    const { company, product, 'rfp-file': rfpFile } = args;
    const timestamp = new Date().toISOString().slice(0,10);
    const results = {};

    console.log(`🔍 Starting comprehensive research for ${company}${product ? ` (${product})` : ''}`);

    try {
      // 1. Market Research Analysis
      console.log('📊 Launching market research analyst...');
      const marketAnalysis = await invokeAgent('market-research-analyst', {
        task: `Conduct comprehensive market research for ${company}${product ? ` focusing on their ${product} product line` : ''}. Analyze competitive landscape, market positioning, industry trends, and market opportunities.`,
        outputFormat: 'markdown',
        fileName: `market-analysis-${company.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.md`
      });
      results.marketAnalysis = marketAnalysis;

      // 2. Product Research Analysis  
      console.log('🛍️ Launching product research analyst...');
      const productResearch = await invokeAgent('product-research-analyst', {
        task: `Research ${company}${product ? `'s ${product}` : ''} from a product and user perspective. Analyze user sentiment, product positioning, feature analysis, pricing strategy, and customer feedback across multiple sources.`,
        outputFormat: 'markdown', 
        fileName: `product-research-${company.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.md`
      });
      results.productResearch = productResearch;

      // 3. Stakeholder Psychology Profiles
      console.log('👥 Launching stakeholder psychologist...');
      const stakeholderProfiles = await invokeAgent('stakeholder-psychologist', {
        task: `Create detailed psychological and organizational profiles of key stakeholders within ${company}. Focus on decision-makers, influencers, and key personnel. Analyze motivations, communication styles, and decision-making patterns.`,
        outputFormat: 'markdown',
        fileName: `stakeholder-profiles-${company.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.md`
      });
      results.stakeholderProfiles = stakeholderProfiles;

      // 4. Trend Research
      console.log('📈 Launching trend researcher...');  
      const trendAnalysis = await invokeAgent('trend-researcher', {
        task: `Analyze current market trends relevant to ${company}${product ? ` and their ${product} product` : ''}. Identify emerging opportunities, viral patterns, user behavior shifts, and competitive trends that could impact their business.`,
        outputFormat: 'markdown',
        fileName: `market-trends-${company.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.md`
      });
      results.trendAnalysis = trendAnalysis;

      // 5. RFP Analysis (conditional)
      if (rfpFile) {
        console.log('📋 Launching RFP analyzer...');
        const rfpAnalysis = await invokeAgent('rfp-analyzer', {
          task: `Analyze the provided RFP document in relation to ${company}${product ? ` and their ${product} capabilities` : ''}. Identify requirements, hidden asks, strategic implications, and competitive positioning opportunities.`,
          rfpDocument: rfpFile,
          outputFormat: 'markdown',
          fileName: `rfp-analysis-${company.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.md`
        });
        results.rfpAnalysis = rfpAnalysis;
      }

      // 6. MISI Report Synthesis
      console.log('📑 Launching MISI report synthesizer...');
      const misiReport = await invokeAgent('misi-report-synthesizer', {
        task: `Create a comprehensive MISI (Market, Industry, Stakeholder, Intelligence) report synthesizing all research findings for ${company}${product ? ` focusing on ${product}` : ''}. Combine insights from market analysis, product research, stakeholder profiles, trend analysis${rfpFile ? ', and RFP analysis' : ''} into actionable intelligence for sales teams.`,
        inputDocuments: [
          results.marketAnalysis,
          results.productResearch, 
          results.stakeholderProfiles,
          results.trendAnalysis,
          ...(results.rfpAnalysis ? [results.rfpAnalysis] : [])
        ],
        outputFormat: 'markdown',
        fileName: `misi-report-${company.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.md`
      });
      results.misiReport = misiReport;

      console.log(`✅ Research complete! Generated ${Object.keys(results).length} reports for ${company}`);
      
      return {
        success: true,
        company,
        product,
        timestamp,
        reports: results,
        summary: `Generated comprehensive research package including market analysis, product research, stakeholder profiles, trend analysis${rfpFile ? ', RFP analysis' : ''}, and final MISI report.`
      };

    } catch (error) {
      console.error(`❌ Research failed for ${company}:`, error.message);
      return {
        success: false,
        company,
        error: error.message,
        partialResults: results
      };
    }
  }
};

// Helper function to invoke agents (implementation depends on your agent system)
async function invokeAgent(agentType, config) {
  // This would use your Task tool to invoke the specified agent
  const result = await Task({
    subagent_type: agentType,
    description: `Research task for ${config.fileName}`,
    prompt: `${config.task}\n\nOutput the results as a well-structured markdown file named "${config.fileName}". Ensure comprehensive coverage of the requested analysis.${config.rfpDocument ? `\n\nRFP Document: ${config.rfpDocument}` : ''}${config.inputDocuments ? `\n\nReference Documents:\n${config.inputDocuments.map((doc, i) => `${i+1}. ${doc.fileName || 'Document ' + (i+1)}`).join('\n')}` : ''}`
  });
  
  return {
    fileName: config.fileName,
    content: result,
    agentType: agentType
  };
}
```

## Example Usage

```bash
# Basic company research
/research --company="Slack"

# Company + product research  
/research --company="Notion" --product="AI Assistant"

# Full research with RFP
/research --company="Microsoft" --product="Teams" --rfp-file="./rfp-documents/collaboration-platform-rfp.pdf"
```

## Output Files
- `market-analysis-{company}-{date}.md`
- `product-research-{company}-{date}.md` 
- `stakeholder-profiles-{company}-{date}.md`
- `market-trends-{company}-{date}.md`
- `rfp-analysis-{company}-{date}.md` (if RFP provided)
- `misi-report-{company}-{date}.md` (final consolidated report)

## Error Handling
- Continues execution if individual agents fail
- Returns partial results with error details
- Logs progress for troubleshooting
- Provides clear success/failure status
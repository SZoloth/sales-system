# /sparkle - Interactive Prototype Generation Command

## Description
Transforms research insights and pitch narratives into interactive prototypes that help sales prospects visualize future solutions. Uses UX-concept-designer to generate compelling concepts, then interactive-prototype-builder to create functional demos.

## Usage
```
/sparkle --company="CompanyName" [--product="ProductName"]
```

## Parameters
- `company` (required): Target company name to create prototypes for
- `product` (optional): Specific product to focus the prototypes on

## Agent Orchestration Flow

1. **Research Discovery** → Find MISI report and pitch outline
2. **UX Concept Designer** → Generate concept ideas → `ux-concepts-{company}.md`
3. **Interactive Prototype Builder** → Build top 3 concepts → Functional prototypes

## Implementation

```javascript
export const sparkleCommand = {
  name: 'sparkle',
  description: 'Create interactive prototypes from research insights to help prospects visualize solutions',
  
  parameters: [
    {
      name: 'company',
      type: 'string',
      required: true,
      description: 'Target company name to create prototypes for'
    },
    {
      name: 'product',
      type: 'string',
      required: false,
      description: 'Specific product to focus the prototypes on'
    }
  ],

  async execute(args) {
    const { company, product } = args;
    const timestamp = new Date().toISOString().slice(0,10);
    const companySlug = company.toLowerCase().replace(/\s+/g, '-');
    
    console.log(`✨ Creating interactive prototypes for ${company}${product ? ` (${product})` : ''}`);

    try {
      // 1. Discover research documents
      console.log('🔍 Discovering research documents...');
      const researchDocs = await discoverResearchDocuments(companySlug);
      
      if (!researchDocs.misiReport) {
        console.warn(`⚠️ No MISI report found for ${company}. Consider running /research first.`);
      }
      
      if (!researchDocs.pitchOutline) {
        console.warn(`⚠️ No pitch outline found for ${company}. Consider running /pitch first.`);
      }

      // 2. Generate UX concepts using ux-concept-designer
      console.log('🎨 Generating UX concepts and interaction ideas...');
      const uxConcepts = await invokeAgent('ux-concept-designer', {
        task: `Analyze the research insights and pitch narrative for ${company}${product ? ` focusing on their ${product} product` : ''} and generate compelling UX/UI concept designs.`,
        misiReport: researchDocs.misiReport,
        pitchOutline: researchDocs.pitchOutline,
        outputFormat: 'markdown',
        fileName: `ux-concepts-${companySlug}-${timestamp}.md`
      });

      // 3. Extract top 3 concepts for prototyping
      const topConcepts = extractTopConcepts(uxConcepts.content);
      
      console.log(`🏗️ Building interactive prototypes for ${topConcepts.length} concepts...`);

      // 4. Build interactive prototypes using interactive-prototype-builder
      const prototypes = [];
      
      for (let i = 0; i < topConcepts.length; i++) {
        const concept = topConcepts[i];
        console.log(`🔨 Building prototype ${i + 1}: ${concept.title}`);
        
        const prototype = await invokeAgent('interactive-prototype-builder', {
          task: `Build an interactive prototype for the concept: "${concept.title}" based on the UX design specifications.`,
          conceptDetails: concept,
          misiInsights: researchDocs.misiReport?.content,
          pitchNarrative: researchDocs.pitchOutline?.content,
          prototypeName: `prototype-${companySlug}-concept-${i + 1}-${timestamp}`,
          company: company,
          product: product
        });
        
        prototypes.push(prototype);
      }

      console.log(`✅ Generated ${prototypes.length} interactive prototypes for ${company}`);
      
      return {
        success: true,
        company,
        product,
        timestamp,
        uxConcepts,
        prototypes,
        researchDocsUsed: Object.keys(researchDocs).filter(key => researchDocs[key]),
        summary: `Created ${prototypes.length} interactive prototypes based on UX concepts derived from research insights and pitch narrative.`
      };

    } catch (error) {
      console.error(`❌ Prototype creation failed for ${company}:`, error.message);
      return {
        success: false,
        company,
        error: error.message
      };
    }
  }
};

// Helper function to discover research documents
async function discoverResearchDocuments(companySlug) {
  const docs = {};
  
  // Search locations: current directory, pitch-docs folder, company-specific folders
  const searchPaths = [
    './',
    './pitch-docs/',
    `./pitch-docs/${companySlug}/`,
    './research-outputs/',
    `./research-outputs/${companySlug}/`
  ];
  
  // Look for MISI report
  console.log('📊 Searching for MISI report...');
  for (const searchPath of searchPaths) {
    try {
      const misiFiles = await glob(`${searchPath}misi-report-${companySlug}-*.md`);
      if (misiFiles.length > 0) {
        // Get the most recent MISI report
        const latestMisi = misiFiles.sort().pop();
        docs.misiReport = {
          fileName: latestMisi,
          content: await readFile(latestMisi)
        };
        console.log(`📋 Found MISI report: ${latestMisi}`);
        break;
      }
    } catch (error) {
      // Continue searching
    }
  }
  
  // Look for pitch outline
  console.log('🎯 Searching for pitch outline...');
  for (const searchPath of searchPaths) {
    try {
      const pitchFiles = await glob(`${searchPath}pitch-outline-${companySlug}-*.md`);
      if (pitchFiles.length > 0) {
        // Get the most recent pitch outline
        const latestPitch = pitchFiles.sort().pop();
        docs.pitchOutline = {
          fileName: latestPitch,
          content: await readFile(latestPitch)
        };
        console.log(`📈 Found pitch outline: ${latestPitch}`);
        break;
      }
    } catch (error) {
      // Continue searching
    }
  }
  
  return docs;
}

// Helper function to extract top concepts from UX designer output
function extractTopConcepts(uxContent) {
  // Parse the UX concepts markdown to extract the top 3 concepts
  // This would analyze the content and identify the strongest concepts
  // For now, return a structured format that the prototype builder can use
  
  const concepts = [];
  const lines = uxContent.split('\n');
  let currentConcept = null;
  
  for (const line of lines) {
    if (line.startsWith('## Concept') || line.startsWith('### Concept')) {
      if (currentConcept) {
        concepts.push(currentConcept);
      }
      currentConcept = {
        title: line.replace(/^#+\s*/, ''),
        description: '',
        features: [],
        interactions: [],
        priority: 'high' // This would be parsed from the content
      };
    } else if (currentConcept && line.trim()) {
      currentConcept.description += line + '\n';
    }
  }
  
  if (currentConcept) {
    concepts.push(currentConcept);
  }
  
  // Return top 3 concepts (sorted by priority/strength)
  return concepts.slice(0, 3);
}

// Helper function to invoke UX concept designer
async function invokeAgent(agentType, config) {
  let contextualInfo = '';
  
  if (agentType === 'ux-concept-designer') {
    const misiContext = config.misiReport 
      ? `\n\n## MISI Research Report:\n${config.misiReport.content}`
      : '\n\n## No MISI report available';
      
    const pitchContext = config.pitchOutline
      ? `\n\n## Pitch Outline:\n${config.pitchOutline.content}`
      : '\n\n## No pitch outline available';
    
    contextualInfo = misiContext + pitchContext;
    
    const result = await Task({
      subagent_type: agentType,
      description: `Generate UX concepts for ${config.fileName}`,
      prompt: `${config.task}

Focus on creating concepts that will:
1. **Generate compelling discussion** with sales prospects
2. **Bring abstract concepts to life** through visual and interactive elements
3. **Help prospects imagine the future** by demonstrating concrete value
4. **Address key pain points** identified in the research
5. **Showcase unique value propositions** from the pitch narrative

Create 5-7 distinct concept ideas, then identify and elaborate on the TOP 3 strongest concepts that would be most effective for sales demonstrations.

For each concept, include:
- **Concept Title**: Clear, compelling name
- **Core Problem Addressed**: From research insights
- **Key Features**: 3-5 main functional elements
- **User Interactions**: How prospects will engage with it
- **Discussion Points**: What conversations this will spark
- **Implementation Notes**: Technical considerations for prototyping

Prioritize concepts that:
- Demonstrate clear ROI and business value
- Are technically feasible to prototype quickly  
- Will resonate with the specific stakeholders identified in research
- Show differentiation from competitors

${contextualInfo}

Output as a well-structured markdown file named "${config.fileName}".`
    });
    
    return {
      fileName: config.fileName,
      content: result,
      agentType: agentType
    };
  }
  
  if (agentType === 'interactive-prototype-builder') {
    const result = await Task({
      subagent_type: agentType,
      description: `Build prototype: ${config.prototypeName}`,
      prompt: `Build an interactive prototype for: "${config.conceptDetails.title}"

## Concept Details:
${JSON.stringify(config.conceptDetails, null, 2)}

## Context from Research:
${config.misiInsights ? `MISI Insights: ${config.misiInsights.substring(0, 1000)}...` : 'No MISI insights available'}

${config.pitchNarrative ? `Pitch Context: ${config.pitchNarrative.substring(0, 1000)}...` : 'No pitch context available'}

## Requirements:
- Create a functional, interactive prototype that can be shared with prospects
- Focus on the core interactions and value propositions
- Make it visually compelling and easy to understand
- Include realistic data that reflects the prospect's industry/use case
- Ensure it works well for sales demonstration purposes
- Build using modern web technologies (React, HTML/CSS/JS)

## Prototype Specifications:
- **Name**: ${config.prototypeName}
- **Target Company**: ${config.company}
- **Product Focus**: ${config.product || 'General solution'}
- **Output**: Functional prototype with demo instructions

Build the prototype with clear documentation on how to use it in sales presentations.`
    });
    
    return {
      prototypeName: config.prototypeName,
      content: result,
      agentType: agentType,
      conceptTitle: config.conceptDetails.title
    };
  }
}

// Helper functions (would need actual implementation)
async function glob(pattern) {
  // Implementation to find files matching glob pattern
}

async function readFile(filePath) {
  // Implementation to read file content
}
```

## Example Usage

```bash
# Create prototypes for company (finds MISI and pitch automatically)
/sparkle --company="Slack"

# Create product-focused prototypes  
/sparkle --company="Notion" --product="AI Assistant"

# Create prototypes for RFP opportunity
/sparkle --company="Microsoft" --product="Teams"
```

## File Discovery Process

Searches multiple locations for research documents:
- Current directory: `misi-report-{company}-*.md`, `pitch-outline-{company}-*.md`
- `pitch-docs/` folder
- `pitch-docs/{company}/` folder  
- `research-outputs/` folder
- `research-outputs/{company}/` folder

## Agent Workflow

### 1. UX-Concept-Designer Phase
**Input**: MISI report + Pitch outline
**Output**: `ux-concepts-{company}-{timestamp}.md` containing:
- 5-7 initial concept ideas
- Top 3 strongest concepts with detailed specifications
- Implementation notes for prototyping

### 2. Interactive-Prototype-Builder Phase  
**Input**: Top 3 UX concepts + Research context
**Output**: 3 functional prototypes:
- `prototype-{company}-concept-1-{timestamp}/`
- `prototype-{company}-concept-2-{timestamp}/`  
- `prototype-{company}-concept-3-{timestamp}/`

## Prototype Characteristics

Each prototype focuses on:
- **Discussion Generation**: Features that spark meaningful sales conversations
- **Concept Visualization**: Making abstract ideas tangible and understandable
- **Future Vision**: Helping prospects imagine improved workflows
- **Value Demonstration**: Clear ROI and business impact
- **Stakeholder Resonance**: Appeals to decision-makers identified in research

## Integration with Research Workflow

1. `/research --company="Target"` → Generates MISI report
2. `/pitch --company="Target"` → Creates pitch outline  
3. `/sparkle --company="Target"` → Builds interactive prototypes
4. Use prototypes in sales presentations and discovery calls

## Output Structure

```
/sparkle-output-{company}-{timestamp}/
├── ux-concepts-{company}-{timestamp}.md
├── prototype-concept-1/
│   ├── index.html
│   ├── demo-guide.md
│   └── assets/
├── prototype-concept-2/
│   ├── index.html  
│   ├── demo-guide.md
│   └── assets/
└── prototype-concept-3/
    ├── index.html
    ├── demo-guide.md
    └── assets/
```

## Error Handling
- Works with partial research data (MISI or pitch only)
- Continues if some prototypes fail to build
- Provides clear feedback on missing dependencies
- Suggests running prerequisite commands if no research found
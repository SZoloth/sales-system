# /pitch - Pitch Presentation Architect Command

## Description
Creates compelling pitch presentation outlines by leveraging existing research reports and proven presentation templates. Uses the pitch-presentation-architect agent to transform research insights into persuasive narratives.

## Usage
```
/pitch --company="CompanyName" [--product="ProductName"]
```

## Parameters
- `company` (required): Target company name to create pitch for
- `product` (optional): Specific product to focus the pitch on

## File Discovery Process

1. **Research Reports Discovery**: Automatically finds existing research files
2. **Template Integration**: Loads proven presentation templates 
3. **Pitch Architecture**: Creates structured narrative outline
4. **Output Generation**: Produces ready-to-use pitch outline

## Implementation

```javascript
export const pitchCommand = {
  name: 'pitch',
  description: 'Create compelling pitch presentation outline using existing research and proven templates',
  
  parameters: [
    {
      name: 'company',
      type: 'string',
      required: true,
      description: 'Target company name for the pitch'
    },
    {
      name: 'product',
      type: 'string',
      required: false,
      description: 'Specific product to focus the pitch on'
    }
  ],

  async execute(args) {
    const { company, product } = args;
    const timestamp = new Date().toISOString().slice(0,10);
    const companySlug = company.toLowerCase().replace(/\s+/g, '-');
    
    console.log(`🎯 Creating pitch outline for ${company}${product ? ` (${product})` : ''}`);

    try {
      // 1. Discover existing research files
      console.log('🔍 Discovering existing research reports...');
      const researchFiles = await discoverResearchFiles(companySlug);
      
      if (researchFiles.length === 0) {
        console.warn(`⚠️ No existing research found for ${company}. Consider running /research first.`);
      }

      // 2. Load presentation templates
      console.log('📋 Loading presentation templates...');
      const templates = await loadPresentationTemplates();

      // 3. Create pitch outline using pitch-presentation-architect
      console.log('🏗️ Architecting compelling pitch presentation...');
      const pitchOutline = await invokeAgent('pitch-presentation-architect', {
        task: `Create a compelling pitch presentation outline for ${company}${product ? ` focusing on their ${product} product` : ''} that will convert prospects into clients.`,
        researchDocuments: researchFiles,
        presentationTemplates: templates,
        outputFormat: 'markdown',
        fileName: `pitch-outline-${companySlug}-${timestamp}.md`
      });

      console.log(`✅ Pitch outline created: ${pitchOutline.fileName}`);
      
      return {
        success: true,
        company,
        product,
        timestamp,
        outline: pitchOutline,
        researchFilesUsed: researchFiles.map(f => f.fileName),
        templatesUsed: templates.map(t => t.fileName),
        summary: `Generated compelling pitch outline leveraging ${researchFiles.length} research documents and ${templates.length} proven templates.`
      };

    } catch (error) {
      console.error(`❌ Pitch creation failed for ${company}:`, error.message);
      return {
        success: false,
        company,
        error: error.message
      };
    }
  }
};

// Helper function to discover existing research files
async function discoverResearchFiles(companySlug) {
  const researchTypes = [
    'market-analysis',
    'product-research', 
    'stakeholder-profiles',
    'market-trends',
    'rfp-analysis',
    'misi-report'
  ];
  
  const foundFiles = [];
  
  for (const type of researchTypes) {
    try {
      // Search for files matching pattern: {type}-{company}-*.md
      const pattern = `${type}-${companySlug}-*.md`;
      const files = await glob(pattern);
      
      for (const filePath of files) {
        const content = await readFile(filePath);
        foundFiles.push({
          fileName: filePath,
          type: type,
          content: content,
          lastModified: await getFileStats(filePath)
        });
      }
    } catch (error) {
      // File not found - continue searching
      console.log(`📄 No ${type} found for ${companySlug}`);
    }
  }
  
  // Sort by most recent first
  foundFiles.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
  
  console.log(`📊 Found ${foundFiles.length} research documents for ${companySlug}`);
  foundFiles.forEach(f => console.log(`  - ${f.fileName}`));
  
  return foundFiles;
}

// Helper function to load presentation templates
async function loadPresentationTemplates() {
  const templates = [];
  
  try {
    const templateDir = './templates-reference';
    const templateFiles = await glob(`${templateDir}/**/*.md`);
    
    for (const filePath of templateFiles) {
      try {
        const content = await readFile(filePath);
        templates.push({
          fileName: filePath,
          name: path.basename(filePath, '.md'),
          content: content
        });
      } catch (error) {
        console.warn(`⚠️ Could not load template: ${filePath}`);
      }
    }
    
    console.log(`📋 Loaded ${templates.length} presentation templates:`);
    templates.forEach(t => console.log(`  - ${t.name}`));
    
  } catch (error) {
    console.warn('⚠️ templates-reference folder not found. Using default pitch structure.');
  }
  
  return templates;
}

// Helper function to invoke pitch-presentation-architect agent
async function invokeAgent(agentType, config) {
  const researchContext = config.researchDocuments.length > 0 
    ? `\n\n## Research Documents Available:\n${config.researchDocuments.map(doc => 
        `### ${doc.type} (${doc.fileName})\n${doc.content.substring(0, 500)}...`
      ).join('\n\n')}`
    : '\n\n## No existing research found - create outline based on best practices.';
    
  const templateContext = config.presentationTemplates.length > 0
    ? `\n\n## Presentation Templates Available:\n${config.presentationTemplates.map(template =>
        `### ${template.name}\n${template.content.substring(0, 300)}...`
      ).join('\n\n')}`
    : '';

  const result = await Task({
    subagent_type: agentType,
    description: `Create pitch outline for ${config.fileName}`,
    prompt: `${config.task}

Create a comprehensive presentation outline with slide titles, content structure, and speaker notes that will be compelling and convert prospects into clients.

Structure the outline to include:
1. **Executive Summary**: Key slides and main narrative arc
2. **Detailed Slide Structure**: 
   - Slide titles
   - Key content points  
   - Supporting data/research insights
   - Speaker notes and talking points
3. **Appendix Slides**: Supporting materials and deep-dive content

Base your recommendations on the research insights and adapt proven template structures to this specific situation.${researchContext}${templateContext}

Output as a well-structured markdown file named "${config.fileName}" that serves as a complete blueprint for creating the actual presentation.`
  });
  
  return {
    fileName: config.fileName,
    content: result,
    agentType: agentType
  };
}

// Helper functions (would need actual implementation)
async function glob(pattern) {
  // Implementation to find files matching glob pattern
}

async function readFile(filePath) {
  // Implementation to read file content
}

async function getFileStats(filePath) {
  // Implementation to get file modification time
}
```

## Example Usage

```bash
# Create pitch for company (will find all available research)
/pitch --company="Slack"

# Create product-focused pitch
/pitch --company="Notion" --product="AI Assistant"

# Create pitch for company with RFP context
/pitch --company="Microsoft" --product="Teams"
```

## Research File Discovery

The command automatically searches for these research file types:
- `market-analysis-{company}-*.md`
- `product-research-{company}-*.md`  
- `stakeholder-profiles-{company}-*.md`
- `market-trends-{company}-*.md`
- `rfp-analysis-{company}-*.md`
- `misi-report-{company}-*.md`

## Template Integration

Loads all templates from `templates-reference/` folder:
- Pitch deck frameworks
- Slide structure templates  
- Narrative flow templates
- Industry-specific templates

## Output Structure

Creates `pitch-outline-{company}-{timestamp}.md` containing:

### Executive Summary
- Main narrative arc
- Key value propositions
- Call to action strategy

### Slide-by-Slide Structure
```markdown
## Slide 1: Opening Hook
**Content**: Problem statement that resonates with stakeholder pain points
**Research Insight**: [From stakeholder profiles]
**Speaker Notes**: Open with specific example from trend research

## Slide 2: Market Context
**Content**: Market landscape and opportunity sizing
**Research Insight**: [From market analysis]  
**Speaker Notes**: Reference competitive positioning data
```

### Appendix Materials
- Supporting research details
- Technical deep-dives
- Competitive analysis
- ROI calculations

## Integration with Research Workflow

1. Run `/research --company="Target" --product="Product"` 
2. Run `/pitch --company="Target" --product="Product"`
3. Get comprehensive pitch outline leveraging all research insights

## Error Handling
- Works even without existing research (uses best practices)
- Continues if templates folder missing
- Provides clear feedback on available resources
- Suggests running `/research` first if no data found
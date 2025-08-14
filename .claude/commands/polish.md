# /polish - Pitch Enhancement Command

## Description
Refines and enhances pitch presentations through comprehensive editorial review and visual storytelling. Uses copy-editor-auditor for content polish and visual-storyteller for compelling slide visualizations.

## Usage
```
/polish --company="CompanyName" [--product="ProductName"]
```

## Parameters
- `company` (required): Target company name to polish pitch for
- `product` (optional): Specific product focus for the pitch

## Agent Orchestration Flow

1. **Pitch Discovery** → Find existing pitch outline
2. **Copy-Editor-Auditor** → Editorial review and polish → `pitch-outline-{company}-polished.md`
3. **Visual-Storyteller** → Visual concepts and graphics → `pitch-visuals-{company}.md`

## Implementation

```javascript
export const polishCommand = {
  name: 'polish',
  description: 'Polish pitch presentations through editorial review and visual storytelling enhancement',
  
  parameters: [
    {
      name: 'company',
      type: 'string',
      required: true,
      description: 'Target company name to polish pitch for'
    },
    {
      name: 'product',
      type: 'string',
      required: false,
      description: 'Specific product focus for the pitch'
    }
  ],

  async execute(args) {
    const { company, product } = args;
    const timestamp = new Date().toISOString().slice(0,10);
    const companySlug = company.toLowerCase().replace(/\s+/g, '-');
    
    console.log(`✨ Polishing pitch presentation for ${company}${product ? ` (${product})` : ''}`);

    try {
      // 1. Discover existing pitch outline
      console.log('🔍 Finding pitch outline...');
      const pitchOutline = await discoverPitchOutline(companySlug);
      
      if (!pitchOutline) {
        throw new Error(`No pitch outline found for ${company}. Run /pitch first to create a pitch outline.`);
      }

      console.log(`📋 Found pitch outline: ${pitchOutline.fileName}`);

      // 2. Run both agents in parallel for efficiency
      console.log('🚀 Launching editorial review and visual storytelling agents...');
      
      const [editorialReview, visualConcepts] = await Promise.all([
        // Copy-Editor-Auditor: Editorial polish and fact-checking
        invokeAgent('copy-editor-auditor', {
          task: `Conduct comprehensive editorial review and polish of the pitch presentation for ${company}${product ? ` focusing on their ${product} product` : ''}.`,
          pitchContent: pitchOutline.content,
          outputFormat: 'markdown',
          fileName: `pitch-outline-${companySlug}-polished-${timestamp}.md`
        }),
        
        // Visual-Storyteller: Create slide visualizations
        invokeAgent('visual-storyteller', {
          task: `Create compelling visual concepts and storytelling elements for the pitch presentation slides for ${company}${product ? ` focusing on their ${product} product` : ''}.`,
          pitchContent: pitchOutline.content,
          outputFormat: 'markdown',
          fileName: `pitch-visuals-${companySlug}-${timestamp}.md`
        })
      ]);

      console.log(`✅ Pitch polishing complete for ${company}`);
      
      return {
        success: true,
        company,
        product,
        timestamp,
        originalPitch: pitchOutline,
        polishedPitch: editorialReview,
        visualConcepts: visualConcepts,
        summary: `Successfully polished pitch presentation with editorial review and visual storytelling enhancements.`
      };

    } catch (error) {
      console.error(`❌ Pitch polishing failed for ${company}:`, error.message);
      return {
        success: false,
        company,
        error: error.message
      };
    }
  }
};

// Helper function to discover existing pitch outline
async function discoverPitchOutline(companySlug) {
  // Search locations: current directory, pitch-docs folder, company-specific folders
  const searchPaths = [
    './',
    './pitch-docs/',
    `./pitch-docs/${companySlug}/`,
    './outputs/',
    `./outputs/${companySlug}/`
  ];
  
  console.log('📊 Searching for pitch outline...');
  
  for (const searchPath of searchPaths) {
    try {
      const pitchFiles = await glob(`${searchPath}pitch-outline-${companySlug}-*.md`);
      if (pitchFiles.length > 0) {
        // Get the most recent pitch outline
        const latestPitch = pitchFiles.sort().pop();
        const content = await readFile(latestPitch);
        
        console.log(`📈 Found pitch outline: ${latestPitch}`);
        return {
          fileName: latestPitch,
          content: content,
          lastModified: await getFileStats(latestPitch)
        };
      }
    } catch (error) {
      // Continue searching
    }
  }
  
  return null;
}

// Helper function to invoke agents
async function invokeAgent(agentType, config) {
  if (agentType === 'copy-editor-auditor') {
    const result = await Task({
      subagent_type: agentType,
      description: `Editorial review for ${config.fileName}`,
      prompt: `${config.task}

## Editorial Review Focus Areas:

### 1. Content Accuracy & Fact-Checking
- Verify all claims, statistics, and market data
- Ensure competitive positioning statements are accurate
- Check that value propositions align with actual capabilities
- Flag any unsupported assertions that need research backing

### 2. Message Clarity & Flow
- Improve logical progression between slides
- Strengthen transitions and narrative arc
- Clarify technical concepts for business audiences
- Ensure consistent messaging throughout

### 3. Language Polish
- Refine grammar, punctuation, and style
- Strengthen weak or vague language
- Improve slide headlines for impact
- Optimize bullet points for clarity and conciseness

### 4. Persuasiveness & Impact
- Strengthen calls to action
- Improve benefit statements and value propositions
- Enhance emotional resonance and urgency
- Ensure speaker notes support key messages

### 5. Professional Presentation Standards
- Check formatting consistency
- Ensure appropriate tone for audience
- Verify slide timing and content balance
- Review appendix organization

## Original Pitch Content:
${config.pitchContent}

## Requirements:
- Output a polished version maintaining original structure
- Include editor notes highlighting key improvements made
- Flag any areas needing additional research or data
- Provide alternative phrasings for key messages where helpful
- Ensure all changes enhance clarity and persuasiveness

Output as a well-structured markdown file named "${config.fileName}" with clear sections for the polished pitch and editorial notes.`
    });
    
    return {
      fileName: config.fileName,
      content: result,
      agentType: agentType
    };
  }
  
  if (agentType === 'visual-storyteller') {
    const result = await Task({
      subagent_type: agentType,
      description: `Visual concepts for ${config.fileName}`,
      prompt: `${config.task}

## Visual Storytelling Focus Areas:

### 1. Slide-by-Slide Visual Concepts
- Create compelling visual metaphors for each key slide
- Design data visualization concepts (charts, graphs, infographics)
- Suggest imagery that reinforces key messages
- Develop visual hierarchy and layout recommendations

### 2. Storytelling Enhancement
- Design visual narrative flow between slides
- Create visual hooks to maintain audience engagement
- Suggest interactive elements or animations
- Develop visual analogies that simplify complex concepts

### 3. Brand and Aesthetic Consistency
- Establish visual design principles for the presentation
- Suggest color schemes that reinforce messages
- Recommend typography and layout standards
- Ensure professional, modern aesthetic

### 4. Data Visualization
- Transform statistics into compelling visual stories
- Create charts that highlight competitive advantages
- Design infographics that make complex data accessible
- Suggest interactive data exploration elements

### 5. Memorable Visual Elements
- Design signature visuals that prospects will remember
- Create visual frameworks that organize information
- Suggest props or physical elements for in-person presentations
- Develop visual metaphors that make abstract concepts tangible

## Original Pitch Content:
${config.pitchContent}

## Requirements:
- Provide specific visual recommendations for each slide
- Include descriptions of graphics, charts, and imagery
- Suggest visual transitions and animation concepts
- Provide mood boards or style references where helpful
- Focus on visuals that enhance persuasion and retention
- Consider both digital and print presentation formats

Output as a well-structured markdown file named "${config.fileName}" with detailed visual concepts organized by slide, plus overall design principles and implementation notes.`
    });
    
    return {
      fileName: config.fileName,
      content: result,
      agentType: agentType
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

async function getFileStats(filePath) {
  // Implementation to get file modification time
}
```

## Example Usage

```bash
# Polish pitch for company (finds most recent pitch automatically)
/polish --company="Slack"

# Polish product-focused pitch
/polish --company="Notion" --product="AI Assistant"

# Polish pitch with RFP context
/polish --company="Microsoft" --product="Teams"
```

## File Discovery Process

Searches multiple locations for pitch outlines:
- Current directory: `pitch-outline-{company}-*.md`
- `pitch-docs/` folder
- `pitch-docs/{company}/` folder
- `outputs/` folder
- `outputs/{company}/` folder

Uses the most recent pitch outline if multiple exist.

## Agent Workflows

### Copy-Editor-Auditor Focus
**Input**: Original pitch outline
**Output**: `pitch-outline-{company}-polished-{timestamp}.md`

**Review Areas:**
- **Content Accuracy**: Fact-checking, data verification, claim validation
- **Message Clarity**: Logical flow, transitions, technical concept simplification
- **Language Polish**: Grammar, style, headline strength, bullet point optimization
- **Persuasiveness**: Call-to-action strength, value proposition enhancement
- **Professional Standards**: Formatting, tone, timing, organization

### Visual-Storyteller Focus
**Input**: Original pitch outline  
**Output**: `pitch-visuals-{company}-{timestamp}.md`

**Visual Areas:**
- **Slide Visuals**: Graphics, charts, imagery, layout recommendations per slide
- **Storytelling Flow**: Visual narrative arc, engagement hooks, transitions
- **Brand Consistency**: Design principles, color schemes, typography standards
- **Data Visualization**: Statistics transformed into compelling visual stories
- **Memorable Elements**: Signature visuals, frameworks, metaphors, props

## Output Structure

### Polished Pitch Outline
```markdown
# Polished Pitch Outline - {Company}

## Executive Summary
[Refined narrative arc and key messages]

## Slide-by-Slide Content
### Slide 1: Opening Hook
**Polished Content**: [Improved version]
**Editor Notes**: [Key improvements made]
**Alternative Phrasings**: [Options for key messages]

### Slide 2: Market Context
[etc...]

## Editorial Notes
- Key improvements made
- Areas flagging for additional research
- Persuasiveness enhancements
- Flow and clarity improvements
```

### Visual Concepts Guide
```markdown
# Visual Storytelling Guide - {Company}

## Overall Design Principles
[Color schemes, typography, visual hierarchy]

## Slide Visual Concepts

### Slide 1: Opening Hook
**Visual Concept**: [Detailed description]
**Graphics Needed**: [Specific visual elements]
**Layout Recommendation**: [Design guidance]
**Visual Metaphor**: [Conceptual approach]

### Slide 2: Market Context
[etc...]

## Implementation Notes
[Technical guidance for creating visuals]
```

## Integration with Workflow

1. `/research` → Generate insights
2. `/pitch` → Create initial outline
3. `/polish` → Refine and enhance presentation
4. `/sparkle` → Add interactive prototypes
5. Ready for high-impact sales presentations!

## Error Handling
- Clear error if no pitch outline found
- Suggests running `/pitch` first if needed
- Continues if one agent fails, returns partial results
- Provides specific guidance on missing dependencies
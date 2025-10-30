import path from 'node:path';
import process from 'node:process';
import { query, type Options, type SDKMessage } from '@anthropic-ai/claude-agent-sdk';

function parseArg(flag: string): string | undefined {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (typeof a !== 'string') continue;
    if (a === flag) return i + 1 < args.length ? args[i + 1] : undefined;
    if (a.startsWith(`${flag}=`)) return a.substring(flag.length + 1);
  }
  return undefined;
}

async function main() {
  const explicitPrompt = parseArg('--prompt');
  const model = parseArg('--model');
  const permissionMode = (parseArg('--permissionMode') as Options['permissionMode']) || 'default';

  // Resolve project root so the SDK can load .claude/agents and commands
  // If run from agent/, set cwd to repo root (../)
  const repoRoot = path.resolve(process.cwd(), '..');

  const options: Options = {
    cwd: repoRoot,
    settingSources: ['project', 'local'],
    permissionMode,
    includePartialMessages: false,
  };
  if (model) options.model = model;

  const prompt =
    explicitPrompt ||
    'Review this project and list available slash commands. Then propose a next best action.';

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ERROR: ANTHROPIC_API_KEY is not set.');
    process.exit(1);
  }

  const stream = query({ prompt, options });

  let finalPrinted = false;
  for await (const message of stream as AsyncIterable<SDKMessage>) {
    switch (message.type) {
      case 'system': {
        if (message.subtype === 'init') {
          console.log(
            `Initialized session in ${message.cwd}. Model=${message.model} PermissionMode=${message.permissionMode}`
          );
          if (message.slash_commands?.length) {
            console.log(`Slash commands: ${message.slash_commands.join(', ')}`);
          }
        }
        break;
      }
      case 'assistant': {
        // Assistant message arrived; typically followed by a result event
        break;
      }
      case 'result': {
        if (message.subtype === 'success') {
          console.log(message.result);
        } else {
          console.error(`Agent ended with ${message.subtype}`);
        }
        console.log('\n—');
        console.log(
          `Turns=${message.num_turns} Cost=$${message.total_cost_usd.toFixed(4)} InputTokens=${message.usage.input_tokens} OutputTokens=${message.usage.output_tokens}`
        );
        finalPrinted = true;
        break;
      }
      default:
        break;
    }
  }

  if (!finalPrinted) {
    console.error('No final result received from agent.');
    process.exit(2);
  }
}

main().catch(err => {
  console.error('Agent run failed:', err);
  process.exit(1);
});

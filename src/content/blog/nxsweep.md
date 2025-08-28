---
title: "NXSweep: Fighting AI with AI in Modern Supply Chain Defense"
date: "2025-08-28"
description: "Analyzing the unprecedented Nx supply chain attack that weaponized AI CLI tools for reconnaissance"
tags: ["security", "supply chain", "AI", "malware", "npm"]
---

**TL;DR:** Nx exploit that weaponized AI CLIs for credential theft; I built a safe scanner to replicate/detect its behaviors; I chained open-source + commercial AI agents to create it without writing code by hand.

**[Download NXSweep Script](https://github.com/Yash1hi/NXSweep)**  

## What is the NX Exploit?  
On **August 26, 2025**, the popular [Nx build system](https://nx.dev/) was compromised when attackers pushed multiple malicious versions to **npm**. The packages contained a post-install script (`telemetry.js`) that exfiltrated **SSH keys**, **npm tokens**, **GitHub credentials**, and even **cryptocurrency wallets**. The attack lasted just over five hours, but given Nx's wide adoption—*millions of weekly downloads*—thousands of developers may have been exposed before the compromised versions were removed. Read more about it [here](https://www.stepsecurity.io/blog/supply-chain-security-alert-popular-nx-build-system-package-compromised-with-data-stealing-malware) from Step Security.

## Why is it interesting?  
This was no ordinary supply chain attack. Beyond stealing credentials, the malware abused locally installed **AI CLI tools** like [Claude](https://claude.ai/), [Gemini](https://deepmind.google/technologies/gemini/), and [q](https://github.com/aws/amazon-q-developer-cli), coercing them into scanning developers' systems and cataloging sensitive files. It's the first known case where adversaries turned trusted AI assistants into **reconnaissance agents**, showing how quickly attacker tradecraft is evolving. Combined with its scale and speed, the incident signals a new frontier in software supply chain threats.

## What this script is  
The scanner I built is a **safe, local tool** that replicates the malicious behaviors of the compromised Nx package in order to detect if a system has been affected. It checks for the same indicators the malware relied on: presence of AI CLI tools (Claude, Gemini, q), **GitHub tokens**, **npm credentials**, suspicious lines appended to shell configs, **wallet-related files**, and the `/tmp/inventory.txt` file used for exfiltration. It uses straightforward pattern matching and optional CLI probing, but never uploads or exploits anything, making it a non-destructive way to surface potential compromise. Results are written both to stdout and to a `NXSweepReport.json` file for auditing.

## How I built it  
I didn't write a single line of this scanner by hand — it was built entirely with **AI coding tools**. But the path to get there showed just how uneven the AI landscape still is for security research.

When I first asked **Claude** and **ChatGPT** to generate a script that mirrored the malicious Nx payload (for purely defensive scanning), both flatly refused. Even when I explained that the goal was *detection*, not *exploitation*, they treated the request as if I was trying to author malware. **Cursor's agent** had the same problem: it could happily refine existing code, but it wouldn't cross the initial hurdle of constructing anything that looked too close to an exploit.

![Claude refusal screenshot](/Claude_Refusal.png)
*Claude refusing to generate exploit-related code, even for defensive purposes*

That dead-end forced me to pivot to open-source models. Running **gpt-oss locally on Ollama** gave me the flexibility I needed. Without provider guardrails blocking the request, I was able to generate a base scanner that replicated the attacker's tactics — searching for wallet files, probing for AI CLIs, checking shell configs — but did so in a safe, non-destructive way.

![OSS Working workflow](/OSS_Working.png)
*Open-source models successfully generating the base scanner code without restrictions*

Once that foundation existed, the commercial tools suddenly became useful. **Claude Code** was excellent at rewriting for clarity and adding structured reporting. **Cursor Agent** helped scaffold optional CLI integrations, better error handling, and clean JSON output. The interesting irony was that the same models that refused to generate the *first draft* had no problem iterating once an "acceptable" base existed.

![Scan report screenshot](/Cursor_Working.png)
*Cursor Agent refining and expanding the scanner with additional features and better error handling*

The end result is a tool entirely authored by chaining AI agents together: **open-source for the initial lift**, **cloud-based assistants for refinement**, and me as the orchestrator gluing the pieces. It's a clear example of how AI can accelerate defensive scripting — but also a reminder that centralized providers still gatekeep this work, while local models make it possible.

![Basic Regex Output](/AI_Output.png)
*Raw regex pattern matching results showing detected indicators of compromise*

![AI Output](/Basic_Regex_Output.png)
*AI-enhanced analysis and recommendations based on the scan findings*

## Conclusion  
The Nx compromise shows how attackers are evolving, turning even trusted AI assistants into accomplices in supply chain attacks. My scanner is just one example of how defenders can adapt in response — by studying attacker techniques directly and building lightweight tools that spot the same signals. More importantly, this project highlights how **AI itself is becoming part of the security battlefield**: attackers are exploiting it, defenders are building with it, and providers are still struggling to define the line between offense and defense. The future of cybersecurity will depend not just on how fast we patch software, but on how effectively we integrate AI into our defensive workflows.

## NXSweep

Here's a the script itself! 

```python
#!/usr/bin/env python3
"""
NXSweep.py

Detects the exact vectors used by the supplied malicious Node script:
  • Presence of the AI CLIs (claude, gemini, q)
  • Existence of a GitHub auth token via `gh` or an env variable
  • Existence of a valid npm user / .npmrc
  • Append‑attack on ~/.bashrc / ~/.zshrc (sudo shutdown …)
  • Files matching wallet‑related patterns
  • A /tmp/inventory.txt file that the bot would create

Results are printed to stdout and written to `NXSweepReport.json` in the
current directory.
"""

import os
import sys
import json
import base64
import subprocess
import pathlib
import re
from pathlib import Path
from typing import List, Dict, Set, Optional

# ---------------------------------------------------------------------------
# 0️⃣  CLI flags & helpers
# ---------------------------------------------------------------------------

def parse_args():
    """Simple argument parsing without external dependencies"""
    args = sys.argv[1:]
    use_cli = '--cli' in args or '-c' in args
    
    output_file = 'NXSweepReport.json'
    for arg in args:
        if arg.startswith('--output='):
            output_file = arg.split('=', 1)[1]
        elif arg.startswith('-o='):
            output_file = arg.split('=', 1)[1]
    
    return use_cli, output_file

USE_CLI, OUTPUT_FILE = parse_args()

# ---------------------------------------------------------------------------
# 1️⃣  Helper: Is a command on $PATH?
# ---------------------------------------------------------------------------

def is_on_path(cmd: str) -> bool:
    """Check if a command is available on PATH"""
    try:
        result = subprocess.run(['which', cmd] if os.name != 'nt' else ['where', cmd], 
                              capture_output=True, text=True, timeout=5)
        return result.returncode == 0 and result.stdout.strip()
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return False

# ---------------------------------------------------------------------------
# 2️⃣  Search for wallet‑related files in a set of "interesting" roots
# ---------------------------------------------------------------------------

WALLET_PATTERNS = [
    r'UTC--',
    r'keystore',
    r'wallet',
    r'\.key$',
    r'\.keyfile$',
    r'\.env$',
    r'metamask',
    r'electrum',
    r'ledger',
    r'trezor',
    r'exodus',
    r'trust',
    r'phantom',
    r'solflare',
    r'keystore\.json$',
    r'secrets\.json$',
    r'\.secret$',
    r'id_rsa$',
    r'Local Storage',
    r'IndexedDB',
]

def find_wallet_files() -> List[str]:
    """Find wallet-related files in current directory only"""
    import re
    
    # Only scan current working directory
    current_dir = os.getcwd()
    print(f"🔍 Scanning current directory: {current_dir}")
    
    matches = []
    try:
        # depth‑first walk, but stop after depth 8 to avoid huge scans
        walk_dir(current_dir, 0, 8, matches)
    except (PermissionError, OSError) as e:
        print(f"⚠️  Error scanning current directory: {e}")
    
    return matches

def walk_dir(dir_path: str, depth: int, max_depth: int, out: List[str]):
    """Recursively walk directory looking for wallet files"""
    if depth > max_depth:
        return
    
    try:
        entries = os.listdir(dir_path)
    except (PermissionError, OSError):
        return  # skip unreadable dirs
    
    for entry in entries:
        full_path = os.path.join(dir_path, entry)
        if os.path.isfile(full_path):
            if any(re.search(pattern, entry, re.IGNORECASE) or 
                   re.search(pattern, full_path, re.IGNORECASE) 
                   for pattern in WALLET_PATTERNS):
                out.append(full_path)
        elif os.path.isdir(full_path) and not entry.startswith('.'):
            walk_dir(full_path, depth + 1, max_depth, out)

# ---------------------------------------------------------------------------
# 3️⃣  Detect "append‑attack" in ~/.bashrc / ~/.zshrc
# ---------------------------------------------------------------------------

def check_append_attack() -> List[str]:
    """Check for malicious lines in shell config files"""
    home = Path.home()
    shells = ['.bashrc', '.zshrc']
    line = 'sudo shutdown -h 0'
    hits = []
    
    for shell in shells:
        shell_path = home / shell
        if shell_path.exists():
            try:
                content = shell_path.read_text(encoding='utf-8')
                if line in content:
                    hits.append(str(shell_path))
            except (PermissionError, OSError):
                pass
    
    return hits

# ---------------------------------------------------------------------------
# 4️⃣  Look for a GitHub token
# ---------------------------------------------------------------------------

def detect_github_token() -> Optional[str]:
    """Detect GitHub token via gh CLI or environment variables"""
    import re
    
    # 1️⃣  via the gh CLI
    if is_on_path('gh'):
        try:
            result = subprocess.run(['gh', 'auth', 'token'], 
                                  capture_output=True, text=True, timeout=5)
            if result.returncode == 0 and result.stdout:
                out = result.stdout.strip()
                if re.match(r'^(gho_|ghp_)', out):
                    return out
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass
    
    # 2️⃣  env vars that the script could pick up
    env_token = os.environ.get('GITHUB_TOKEN') or os.environ.get('GH_TOKEN')
    if env_token and re.match(r'^(gho_|ghp_)', env_token):
        return env_token
    
    return None

# ---------------------------------------------------------------------------
# 5️⃣  Look for npm user / .npmrc
# ---------------------------------------------------------------------------

def detect_npm_info() -> Dict[str, Optional[str]]:
    """Detect npm user and .npmrc configuration"""
    result = {'whoami': None, 'npmrc': None}
    
    if is_on_path('npm'):
        try:
            result_cmd = subprocess.run(['npm', 'whoami'], 
                                      capture_output=True, text=True, timeout=5)
            if result_cmd.returncode == 0 and result_cmd.stdout:
                result['whoami'] = result_cmd.stdout.strip()
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass
    
    npmrc_path = Path.home() / '.npmrc'
    if npmrc_path.exists():
        try:
            content = npmrc_path.read_text(encoding='utf-8').strip()
            # we don't try to parse the token – any content is "suspicious"
            result['npmrc'] = content
        except (PermissionError, OSError):
            pass
    
    return result

# ---------------------------------------------------------------------------
# 6️⃣  Optional: drive the same AI CLIs (`claude`, `gemini`, `q`)
# ---------------------------------------------------------------------------

CLI_TOOLS = ['claude', 'gemini', 'q']
PROMPT = """Search local paths. Exclude /proc /sys /dev. Max depth 8. \
Record file paths that match:
UTC--, keystore, wallet, *.key, *.keyfile, *.env,
metamask, electrum, ledger, trezor, exodus, trust,
phantom, solflare, keystore.json, secrets.json, *.secret,
id_rsa, Local Storage, IndexedDB."""

def run_cli(tool: str, args: List[str] = None) -> Optional[List[str]]:
    """Run a CLI tool and capture its output"""
    if args is None:
        args = []
    
    try:
        # The malicious bot used `runBackgroundSync` which simply spawns the CLI.
        # We do the same but capture stdout/stderr in memory.
        print(f"    Running command: {tool} {' '.join(args)}")
        result = subprocess.run([tool] + args, 
                              capture_output=True, text=True, timeout=120)
        
        if result.returncode != 0:
            print(f"    Command failed with return code: {result.returncode}")
            if result.stderr:
                print(f"    Error: {result.stderr.strip()}")
            return None
        
        # Most CLIs will print a list of file paths to stdout.
        output_lines = [line.strip() for line in result.stdout.splitlines() if line.strip()]
        print(f"    Command succeeded, got {len(output_lines)} output lines")
        return output_lines
    except (subprocess.TimeoutExpired, FileNotFoundError) as e:
        print(f"    Exception: {e}")
        return None

def run_cli_tools() -> Dict[str, Optional[List[str]]]:
    """Run all available AI CLI tools with the malicious prompt"""
    print('🤖 Starting AI CLI tools scan...')
    cli_results = {}
    
    for tool in CLI_TOOLS:
        if not is_on_path(tool):
            print(f'  ❌ {tool} not found on system')
            continue
        
        print(f'  🔧 Running {tool}...')
        # The original prompt instructs the AI to write to /tmp/inventory.txt,
        # but we only care about stdout. If the tool writes that file we'll
        # still read it later – the scanner is safe to run on a "clean" system.
        
        # Try different argument formats for different CLI tools
        if tool == 'claude':
            # claude expects prompt as positional argument, use --print for non-interactive
            args_list = [
                ['--print', PROMPT],
                ['--print', '--model', 'claude-sonnet-4-20250514', PROMPT],
                [PROMPT],  # Just the prompt as positional argument
                ['--model', 'claude-sonnet-4-20250514', PROMPT]
            ]
        elif tool == 'gemini':
            args_list = [
                ['--prompt', PROMPT],
                [PROMPT]
            ]
        elif tool == 'q':
            args_list = [
                ['--model', 'gpt-4o-mini', '--prompt', PROMPT],
                ['--prompt', PROMPT],
                [PROMPT]
            ]
        else:
            args_list = [[PROMPT]]
        
        paths = None
        for args in args_list:
            print(f'    Trying args: {args}')
            paths = run_cli(tool, args)
            if paths:
                break
        
        if paths:
            print(f'  ✅ {tool} returned {len(paths)} path(s)')
        else:
            print(f'  ⚠️  {tool} failed with all argument combinations')
        
        cli_results[tool] = paths
    
    print('✅ AI CLI tools scan complete.')
    return cli_results

# ---------------------------------------------------------------------------
# 7️⃣  Inspect /tmp/inventory.txt if it exists
# ---------------------------------------------------------------------------

def inspect_inventory() -> Optional[Dict[str, any]]:
    """Check for /tmp/inventory.txt file"""
    inv_path = Path('/tmp/inventory.txt')
    if not inv_path.exists():
        return None
    
    try:
        data = inv_path.read_text(encoding='utf-8').strip()
        if not data:
            return None
        
        lines = [line for line in data.splitlines() if line.strip()]
        # The malicious script would read each line and base‑64‑encode it.
        # If we can read the file, we flag the file list itself.
        return {'path': str(inv_path), 'lines': lines}
    except (PermissionError, OSError):
        return None

# ---------------------------------------------------------------------------
# 7️⃣  Run the scan and build a report
# ---------------------------------------------------------------------------

def run_scan() -> Dict[str, any]:
    """Run the complete scan and build report"""
    report = {}
    
    # 1️⃣  AI CLIs
    report['cliTools'] = {
        cli: is_on_path(cli) for cli in ['claude', 'gemini', 'q']
    }
    
    # 2️⃣  GitHub token
    report['githubToken'] = detect_github_token()
    
    # 3️⃣  npm info
    report['npmInfo'] = detect_npm_info()
    
    # 4️⃣  Append‑attack
    report['appendAttackFiles'] = check_append_attack()
    
    # 5️⃣  Wallet files
    report['walletFiles'] = find_wallet_files()
    
    # 6️⃣  CLI tools results (if --cli flag is used)
    if USE_CLI:
        report['cliResults'] = run_cli_tools()
    else:
        print('⏭️  Skipping AI CLI tools scan (--cli flag not used)')
        report['cliResults'] = {}
    
    # 7️⃣  Inventory.txt (if it exists)
    report['inventory'] = inspect_inventory()
    
    return report

# ---------------------------------------------------------------------------
# 8️⃣  Output nicely and also write JSON
# ---------------------------------------------------------------------------

def output(report: Dict[str, any]):
    """Output the scan report to console and file"""
    print('=== MALICIOUS VECTOR SCAN REPORT ===\n')
    
    print('⚠️  AI CLIs present:')
    for cli, ok in report['cliTools'].items():
        status = '✅ DETECTED' if ok else '❌ NOT FOUND'
        print(f'   - {cli}: {status}')
    
    print('\n⚠️  GitHub token:')
    if report['githubToken']:
        token_type = 'gh' if report['githubToken'].startswith('gho_') else 'env'
        print(f'   ✅ Token found (hidden in {token_type})')
    else:
        print('   ❌ No token detected.')
    
    print('\n⚠️  npm user / .npmrc:')
    if report['npmInfo']['whoami']:
        print(f'   ✅ npm whoami: {report["npmInfo"]["whoami"]}')
    else:
        print('   ❌ npm whoami not found.')
    
    if report['npmInfo']['npmrc']:
        print('   ✅ .npmrc exists (content hidden for brevity)')
    else:
        print('   ❌ No .npmrc found.')
    
    print('\n⚠️  Append‑attack on shell init files:')
    if report['appendAttackFiles']:
        for f in report['appendAttackFiles']:
            print(f'   ✅ {f} contains the shutdown line')
    else:
        print('   ❌ No malicious lines found.')
    
    print('\n⚠️  Wallet‑related files found:')
    if report['walletFiles']:
        for f in report['walletFiles']:
            print(f'   ✅ {f}')
    else:
        print('   ❌ None detected.')
    
    print('\n⚠️  AI CLI results:')
    if USE_CLI and report['cliResults']:
        for tool, paths in report['cliResults'].items():
            if not paths:
                continue
            print(f'\n{tool} returned {len(paths)} path(s):')
            for i, path in enumerate(paths, 1):
                print(f'  {i}. {path}')
    else:
        print('   ❌ No CLI results available.')
    
    print('\n⚠️  /tmp/inventory.txt:')
    if report['inventory'] and report['inventory']['path']:
        print(f'   ✅ Exists at {report["inventory"]["path"]}')
        print(f'   └─ contains {len(report["inventory"]["lines"])} file(s)')
    else:
        print('   ❌ No inventory file present.')
    
    # Write a machine‑readable copy
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2)
    
    print(f'\n📁  Detailed report written to {OUTPUT_FILE}')

# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

if __name__ == '__main__':
    result = run_scan()
    output(result)

```

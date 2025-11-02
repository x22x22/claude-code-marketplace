# Claude Plugin Studio - Prototype Visual Guide

This document provides ASCII art representations of the prototype interface.

## Complete User Journey

### Screen 1: Welcome Page
```
┌────────────────────────────────────────────────────────────────────┐
│  Claude Plugin Studio                            ← Back to Marketplace │
│  Visual Plugin Development Tool                                     │
├────────────────────────────────────────────────────────────────────┤
│  👋  📋  ⚙️  🤖  🧪  🚀                                           │
│  Welcome → Template → Configure → Agents → Test → Deploy          │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                          👋                                         │
│                                                                     │
│           Welcome to Claude Plugin Studio                          │
│                                                                     │
│   Create professional Claude Code plugins in minutes with our      │
│             visual development tool. No coding required!           │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │     ⚡      │  │     🧪      │  │     🚀      │              │
│  │    Fast     │  │  Built-in   │  │ One-Click   │              │
│  │ Development │  │   Testing   │  │   Deploy    │              │
│  │             │  │             │  │             │              │
│  │ 80% faster  │  │ Test before │  │ Deploy to   │              │
│  │ with tools  │  │ deployment  │  │ GitHub easy │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                     │
│                    [ Get Started → ]                               │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### Screen 2: Template Selection
```
┌────────────────────────────────────────────────────────────────────┐
│  Claude Plugin Studio                            ← Back to Marketplace │
├────────────────────────────────────────────────────────────────────┤
│  👋  📋  ⚙️  🤖  🧪  🚀                                           │
│  ━━━  ━━━━  ━━━━  ━━━━  ━━━━  ━━━━                              │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Choose a Template                                                 │
│  Start with a pre-built template or create from scratch           │
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐│
│  │       📝         │  │       🧪         │  │       📚         ││
│  │                  │  │                  │  │                  ││
│  │  Code Review     │  │  Test Generator  │  │  Documentation   ││
│  │     Agent        │  │                  │  │     Writer       ││
│  │                  │  │                  │  │                  ││
│  │ Automated code   │  │ Generate tests   │  │ Comprehensive    ││
│  │ review with best │  │ automatically    │  │ documentation    ││
│  │ practices        │  │                  │  │                  ││
│  │                  │  │                  │  │                  ││
│  │ ★★★★★            │  │ ★★★★☆            │  │ ★★★★★            ││
│  │ [3 agents]       │  │ [2 agents]       │  │ [2 agents]       ││
│  └──────────────────┘  └──────────────────┘  └──────────────────┘│
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐                      │
│  │       🐛         │  │       ⚡         │                      │
│  │                  │  │                  │                      │
│  │ Debug Assistant  │  │ Start from       │                      │
│  │                  │  │    Scratch       │                      │
│  │ Interactive      │  │                  │                      │
│  │ debugging &      │  │ Build custom     │                      │
│  │ error analysis   │  │ plugin from      │                      │
│  │                  │  │ ground up        │                      │
│  │ ★★★★☆            │  │                  │                      │
│  │ [2 agents]       │  │ [0 agents]       │                      │
│  └──────────────────┘  └──────────────────┘                      │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### Screen 3: Configure Plugin
```
┌────────────────────────────────────────────────────────────────────┐
│  Claude Plugin Studio                            ← Back to Marketplace │
├────────────────────────────────────────────────────────────────────┤
│  👋  📋  ⚙️  🤖  🧪  🚀                                           │
│  ━━━  ━━━━  ━━━━  ━━━━  ━━━━  ━━━━                              │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Configure Your Plugin                                             │
│  Basic information about your plugin                               │
│                                                                     │
│  Plugin Name *                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ my-code-reviewer                                              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Description *                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ Automated code review agent that checks for bugs,            │ │
│  │ security issues, and best practices in pull requests.        │ │
│  │                                                               │ │
│  │                                                               │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ 💡 Template: Code Review Agent                             │   │
│  │    3 agents pre-configured                                 │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  [ ← Back ]                                        [ Next → ]      │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### Screen 4: Design Agents
```
┌────────────────────────────────────────────────────────────────────┐
│  Claude Plugin Studio                            ← Back to Marketplace │
├────────────────────────────────────────────────────────────────────┤
│  👋  📋  ⚙️  🤖  🧪  🚀                                           │
│  ━━━  ━━━━  ━━━━  ━━━━  ━━━━  ━━━━                              │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Design Your Agents                              [ + Add Agent ]   │
│  Customize agent prompts and behavior                             │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ reviewer        [Primary ▼]                    🗑️ Delete    │ │
│  │                                                              │ │
│  │ Agent Prompt                                                 │ │
│  │ ┌────────────────────────────────────────────────────────┐  │ │
│  │ │ You are an expert code reviewer specializing in        │  │ │
│  │ │ identifying bugs, security vulnerabilities, and        │  │ │
│  │ │ code quality issues. Analyze the code changes in       │  │ │
│  │ │ pull requests and provide constructive feedback.       │  │ │
│  │ │                                                         │  │ │
│  │ │                                                         │  │ │
│  │ └────────────────────────────────────────────────────────┘  │ │
│  │ 💡 Tip: Be specific about the agent's role...              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │ style-checker   [Helper ▼]                     🗑️ Delete    │ │
│  │                                                              │ │
│  │ Agent Prompt                                                 │ │
│  │ ┌────────────────────────────────────────────────────────┐  │ │
│  │ │ You are a style-checker agent. Verify code follows     │  │ │
│  │ │ project conventions and best practices...               │  │ │
│  │ └────────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  [ ← Back ]                                        [ Next → ]      │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### Screen 5: Test & Debug
```
┌────────────────────────────────────────────────────────────────────┐
│  Claude Plugin Studio                            ← Back to Marketplace │
├────────────────────────────────────────────────────────────────────┤
│  👋  📋  ⚙️  🤖  🧪  🚀                                           │
│  ━━━  ━━━━  ━━━━  ━━━━  ━━━━  ━━━━                              │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Test & Debug Your Plugin                                         │
│  Run tests and debug your plugin before deployment                │
│                                                                     │
│  ┌────────────────────┐  ┌──────────────────────────────────────┐│
│  │ Plugin Summary     │  │ Console Output        ● ● ●          ││
│  │                    │  ├──────────────────────────────────────┤│
│  │ Name:              │  │                                      ││
│  │ my-code-reviewer   │  │ ✓ Loading plugin configuration       ││
│  │                    │  │ ✓ Validating agent prompts          ││
│  │ Template:          │  │ ✓ Found 3 agents                    ││
│  │ Code Review Agent  │  │   → Testing agent: reviewer          ││
│  │                    │  │     ✓ Agent "reviewer" initialized   ││
│  │ Agents: 3          │  │   → Testing agent: style-checker     ││
│  │                    │  │     ✓ Agent "style-checker" init'd   ││
│  │                    │  │   → Testing agent: security-scanner  ││
│  │ ┌────────────────┐ │  │     ✓ Agent "security-scanner" ok    ││
│  │ │ ▶️ Run Tests   │ │  │                                      ││
│  │ └────────────────┘ │  │ ✅ All tests passed!                 ││
│  │ ┌────────────────┐ │  │                                      ││
│  │ │ Clear Output   │ │  │ Plugin "my-code-reviewer" is ready   ││
│  │ └────────────────┘ │  │ for deployment.                      ││
│  │                    │  │                                      ││
│  │ ┌────────────────┐ │  │                                      ││
│  │ │ 🐛 Debug Mode  │ │  │                                      ││
│  │ │ Real-time logs │ │  │                                      ││
│  │ └────────────────┘ │  │                                      ││
│  └────────────────────┘  └──────────────────────────────────────┘│
│                                                                     │
│  [ ← Back ]                                        [ Next → ]      │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

### Screen 6: Deploy
```
┌────────────────────────────────────────────────────────────────────┐
│  Claude Plugin Studio                            ← Back to Marketplace │
├────────────────────────────────────────────────────────────────────┤
│  👋  📋  ⚙️  🤖  🧪  🚀                                           │
│  ━━━  ━━━━  ━━━━  ━━━━  ━━━━  ━━━━                              │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                            🚀                                       │
│                                                                     │
│                      Ready to Deploy!                              │
│                                                                     │
│  Your plugin is configured and tested. Deploy it to GitHub        │
│  and the marketplace.                                             │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  Deployment Checklist                                        │ │
│  │                                                              │ │
│  │  ✓ Plugin configured                                        │ │
│  │  ✓ 3 agents defined                                         │ │
│  │  ✓ Tests passed                                             │ │
│  │  ○ Ready for deployment                                     │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │              [ Deploy to GitHub ]                            │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │           [ Download Plugin Files ]                          │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  🔒 Secure GitHub integration • 📦 Automatic versioning            │
│  📝 Auto-generated docs                                            │
│                                                                     │
│  [ ← Back ]                                                        │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

## Key Interactive Elements

### Progress Indicator
```
Current Step (Blue):  [🎨 Blue Background]
Completed (Green):    [✓ Green Background]
Upcoming (Gray):      [○ Gray Background]
```

### Agent Card States
```
Default:              [─ Gray Border]
Hover:                [─ Blue Border + Shadow]
Selected:             [─ Blue Border + Highlight]
```

### Console Output Colors
```
Success:              ✓ Green text
In Progress:          → Yellow/Blue text
Error:                ✗ Red text
Info:                 • White/Gray text
```

### Button States
```
Primary Action:       [Blue Background, White Text]
Secondary Action:     [Gray Background, Dark Text]
Disabled:             [Gray Background, Light Text]
Danger:               [Red Background, White Text]
```

## Responsive Behavior

### Desktop (>1024px)
- Two-column layout for test screen
- Full width forms
- Horizontal progress bar

### Tablet (768px-1024px)
- Single column layout
- Stacked test output
- Collapsible sections

### Mobile (<768px)
- Vertical progress dots
- Full-width buttons
- Touch-optimized inputs

## Dark Mode Support

All screens support dark mode with:
- Dark backgrounds (#1a1a1a → #2d2d2d)
- Light text on dark
- Adjusted border colors
- Preserved color accents

---

**Note:** These are ASCII representations. The actual prototype at `/studio` has full
color, animations, and interactive elements. Start the dev server and visit
`http://localhost:3000/studio` to see the live version.

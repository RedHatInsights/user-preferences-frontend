# User Preferences Frontend

Red Hat Insights user preferences management application using data-driven forms.

## Overview

This application provides forms for users to configure their preferences within the Red Hat Insights platform. It uses a config-driven approach where applications register their preference forms via `src/config/config.json`, and forms are automatically rendered using [Data Driven Forms](https://data-driven-forms.org/).

## Architecture

**Tech Stack:**
- React 18 + Redux
- PatternFly 6 (UI components)
- Data Driven Forms (form rendering)
- Red Hat Cloud Services frontend components
- TypeScript + JavaScript

**Key Patterns:**
- **Config-driven**: Applications register preference forms in `src/config/config.json`
- **Schema-based rendering**: Data Driven Forms uses JSON schemas to render form components
- **Permission-based visibility**: Forms can be hidden behind permission checks (see `permissions` field in config)
- **Custom components**: `DescriptiveCheckbox` and other custom form components extend DDF

**Directory Structure:**
```
src/
├── Components/       # React components
├── config/          # config.json (app registration)
├── Routes/          # Route definitions
└── SmartComponents/ # Container components
```

## Development

**First-time setup:**
```bash
# Install dependencies (this also sets up git hooks via husky)
npm install
```

**Daily workflow:**
```bash
# Start dev server (with hot reload)
npm start

# Run tests
npm test

# Lint
npm run lint
npm run lint:js:fix  # Auto-fix JS issues

# Build
npm run build

# Storybook
npm run storybook
```

## AI-Readiness Assessment

This repository uses [AgentReady](https://github.com/agentready/agentready) to assess how well-structured it is for AI-assisted development.

**Running an assessment:**
```bash
# Install AgentReady
pip install agentready

# Assess the repository
agentready assess .

# View reports in .agentready/ directory
open .agentready/report-latest.html
```

**Note:** The `.agentready/` directory is git-ignored and contains generated reports (HTML, Markdown, JSON). Run assessments periodically (quarterly or after major changes) to track improvements in agent-readiness score.

## Key Conventions

**Commits:**
- Use [Conventional Commits](https://www.conventionalcommits.org/) format
- Enforced by Husky git hooks (commitlint)
- Pre-commit hook runs ESLint on staged files
- Examples: `feat: add new preference form`, `fix: resolve checkbox state bug`, `docs: update README`

**Adding a new preference form:**
1. Add your app to `src/config/config.json` with title, URL, and schema
2. Use Data Driven Forms schema format (see [DDF docs](https://data-driven-forms.org/))
3. Optional: Add `permissions` field for access control

**Custom components:**
- `DescriptiveCheckbox`: Checkbox with title and description
  - Component name: `descriptiveCheckbox`
  - Props: `label` (title), `description` (subtitle)

**Permission methods:**
- `hasPermissions`: Check exact permissions
- `hasLoosePermissions`: Check if user has at least one permission
- Prefix with `!` for negation (e.g., `!isBeta`)

## Configuration

**Node version:** >=15.14.0 (see `package.json` engines)
**NPM version:** >=7.24.2

## Testing

- Jest for unit tests
- Testing Library for React component testing
- Coverage target: See `package.json` jest config

## Related Documentation

- [Data Driven Forms](https://data-driven-forms.org/)
- [insights-chrome permissions](https://github.com/RedHatInsights/insights-chrome#permissions)
- [cloud-services-config](https://github.com/RedHatInsights/cloud-services-config)

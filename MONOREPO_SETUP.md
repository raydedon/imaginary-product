# 🏗️ Turborepo Monorepo Setup Guide

## Overview

This guide will help you convert your project into a Turborepo monorepo with:
- `apps/web` - Your main React application
- `packages/my-lib` - Your shared utility library

## Current Structure → Monorepo Structure

```
BEFORE:
imaginary-product/
├── src/
├── my-lib/
├── package.json
└── ...

AFTER:
imaginary-product/          (monorepo root)
├── apps/
│   └── web/               (main app)
│       ├── src/
│       ├── package.json
│       └── ...
├── packages/
│   └── my-lib/           (shared library)
│       ├── src/
│       ├── package.json
│       └── ...
├── package.json          (root workspace config)
├── turbo.json           (Turborepo config)
└── ...
```

## Setup Steps

### Step 1: Create Directory Structure

```bash
# Create apps and packages directories
mkdir -p apps/web packages

# Move my-lib to packages
mv my-lib packages/

# Move app files to apps/web (this is manual - see below)
```

### Step 2: Move Web App Files

You'll need to manually move these to `apps/web`:

```bash
# Files to move to apps/web/
- src/
- public/
- index.html
- vite.config.mjs
- tailwind.config.ts
- postcss.config.ts
- tsconfig.json
- jsconfig.json
- .env
- package.json (rename to apps/web/package.json)
```

**OR** Use this script:

```bash
# Create web app directory
mkdir -p apps/web

# Move app-specific files
mv src apps/web/
mv public apps/web/
mv index.html apps/web/
mv vite.config.mjs apps/web/
mv tailwind.config.ts apps/web/
mv postcss.config.ts apps/web/
mv tsconfig.json apps/web/
mv jsconfig.json apps/web/
mv .env apps/web/

# Copy package.json and update it
cp package.json apps/web/package.json
```

### Step 3: Create Root package.json

Replace root `package.json` with workspace configuration:

```json
{
  "name": "imaginary-product-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check"
  },
  "devDependencies": {
    "turbo": "^2.3.3"
  }
}
```

### Step 4: Update apps/web/package.json

```json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build --sourcemap",
    "serve": "vite preview",
    "type-check": "tsc --noEmit",
    "lint": "eslint src --ext ts,tsx,js,jsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "@raydedon/assessment-lib": "workspace:*",
    // ... all other dependencies
  }
}
```

**Key change:** `"@raydedon/assessment-lib": "workspace:*"` tells npm to use the local package.

### Step 5: Update packages/my-lib/package.json

```json
{
  "name": "@raydedon/assessment-lib",
  "version": "1.0.0",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "scripts": {
    "dev": "tsup ./src/index.ts --watch",
    "build": "tsup ./src/index.ts --format cjs,esm --dts",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist"
  }
}
```

### Step 6: Install Turborepo

```bash
# At project root
npm install turbo --save-dev
```

### Step 7: Install Dependencies

```bash
# Install all workspace dependencies
npm install
```

This installs dependencies for:
- Root workspace
- apps/web
- packages/my-lib

### Step 8: Create turbo.json

Already created at root! Configuration:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "type-check": {
      "dependsOn": ["^type-check"]
    }
  }
}
```

## Usage After Setup

### Development

```bash
# Run all apps in dev mode (parallel)
npm run dev

# Or run specific workspace
npm run dev --workspace=web
npm run dev --workspace=@raydedon/assessment-lib
```

### Build

```bash
# Build everything (my-lib first, then web)
npm run build

# Build specific package
turbo run build --filter=web
turbo run build --filter=@raydedon/assessment-lib
```

### Type Checking

```bash
# Type check all packages
npm run type-check
```

## Benefits of Turborepo

### ✅ Smart Caching

```bash
# First build
turbo run build  # Builds everything

# No changes, run again
turbo run build  # Instant! (uses cache)

# Change my-lib
turbo run build  # Only rebuilds my-lib and web (dependency)
```

### ✅ Parallel Execution

```bash
# Runs tasks in parallel when possible
turbo run dev
# → my-lib dev (watch mode)
# → web dev (vite server)
# Both run simultaneously!
```

### ✅ Smart Dependency Graph

```
packages/my-lib (builds first)
        ↓
    apps/web (builds after my-lib is ready)
```

Turborepo knows `web` depends on `my-lib` and builds in correct order.

### ✅ Task Filtering

```bash
# Build only web app
turbo run build --filter=web

# Build my-lib and everything that depends on it
turbo run build --filter=my-lib...

# Run dev for all apps
turbo run dev --filter=./apps/*
```

## Monorepo Structure

```
imaginary-product/
├── apps/
│   └── web/                    # Main React app
│       ├── src/
│       ├── public/
│       ├── index.html
│       ├── package.json
│       ├── vite.config.mjs
│       └── tsconfig.json
│
├── packages/
│   └── my-lib/                # Shared library
│       ├── src/
│       ├── dist/
│       ├── package.json
│       └── tsconfig.json
│
├── package.json              # Root workspace config
├── turbo.json               # Turborepo config
├── package-lock.json        # Lockfile for all packages
└── node_modules/            # Shared node_modules
```

## Using my-lib in web App

### Import from Workspace

```javascript
// In apps/web/src/App.jsx
import { getCurrentDate, Note } from '@raydedon/assessment-lib';

function App() {
  const today = getCurrentDate();
  
  return (
    <div>
      <Note title="Today" content={today} />
    </div>
  );
}
```

### Hot Reload

When you edit `packages/my-lib`:
1. Turborepo detects change
2. Rebuilds `my-lib` (if in dev mode with watch)
3. `apps/web` hot-reloads automatically
4. See changes instantly!

## Commands Reference

```bash
# Development
npm run dev                    # Run all in dev mode
turbo run dev --filter=web    # Run only web

# Build
npm run build                  # Build all packages
turbo run build --filter=web  # Build only web

# Type check
npm run type-check            # Check all packages

# Clean
npm run clean                 # Remove all dist/build folders
rm -rf node_modules          # Remove all node_modules
npm install                   # Reinstall everything

# Add dependency to web
npm install axios --workspace=web

# Add dependency to my-lib
npm install moment --workspace=@raydedon/assessment-lib
```

## Turborepo Features

### 1. Remote Caching

Share build cache with your team:

```bash
# Login to Vercel
npx turbo login

# Link to remote cache
npx turbo link
```

### 2. Task Pipelines

Define task dependencies in `turbo.json`:

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],  // Build dependencies first
      "outputs": ["dist/**"]     // Cache these outputs
    }
  }
}
```

### 3. Incremental Builds

Only rebuilds what changed:

```bash
# Change my-lib
turbo run build
# → Rebuilds: my-lib, web (depends on my-lib)
# → Skips: other packages (no changes)
```

## Migration Checklist

- [ ] Create `apps/` and `packages/` directories
- [ ] Move my-lib to `packages/my-lib`
- [ ] Move app to `apps/web`
- [ ] Create root `package.json` with workspaces
- [ ] Update `apps/web/package.json` with workspace dependency
- [ ] Create `turbo.json`
- [ ] Run `npm install` at root
- [ ] Test with `npm run dev`
- [ ] Test with `npm run build`

## Troubleshooting

### Issue: "Cannot find module '@raydedon/assessment-lib'"

**Solution:** Make sure:
1. `my-lib` is in `packages/` folder
2. Root `package.json` has workspaces configured
3. Run `npm install` at root

### Issue: "Turborepo command not found"

**Solution:**
```bash
npm install turbo --save-dev
# Or globally
npm install -g turbo
```

### Issue: "Build order is wrong"

**Solution:** Check `turbo.json` dependencies:
```json
{
  "build": {
    "dependsOn": ["^build"]  // ^ means dependencies build first
  }
}
```

## Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Workspaces Guide](https://turbo.build/repo/docs/handbook/workspaces)
- [Examples](https://github.com/vercel/turbo/tree/main/examples)

## Next Steps

1. Follow the migration steps above
2. Test the monorepo setup
3. Enjoy faster builds with caching!

Your monorepo setup is ready! 🚀

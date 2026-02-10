# Turborepo Quick Start Guide

## ✅ Setup Complete!

Your project has been successfully converted to a Turborepo monorepo.

## 📁 Structure

```
imaginary-product/          (monorepo root)
├── apps/
│   └── web/               (React app)
│       ├── src/
│       ├── package.json
│       └── vite.config.mjs
├── packages/
│   └── my-lib/           (@raydedon/assessment-lib)
│       ├── src/
│       ├── dist/
│       └── package.json
├── package.json          (root workspace)
├── turbo.json
└── README.md
```

## 🚀 Commands

### Development

```bash
# Run all apps in dev mode (recommended)
npm run dev

# Or run specific workspace
npm run dev --workspace=web
```

### Build

```bash
# Build everything (my-lib → web)
npm run build

# Build specific package
npx turbo build --filter=web
npx turbo build --filter=@raydedon/assessment-lib
```

### Other

```bash
# Type check
npm run type-check

# Clean builds
npm run clean

# Install new dependency to web
npm install axios --workspace=web

# Install new dependency to my-lib
npm install moment --workspace=@raydedon/assessment-lib
```

## 🎯 Quick Test

To verify everything works:

```bash
# 1. Build all packages
npm run build

# 2. Start dev server
npm run dev

# 3. Open browser to http://localhost:5173
```

## 📦 Using my-lib in web

The web app can now import from `@raydedon/assessment-lib`:

```javascript
import { getCurrentDate, Note } from '@raydedon/assessment-lib';
```

The package is linked via npm workspaces (see `node_modules/@raydedon/assessment-lib` → symlink to `packages/my-lib`).

## ⚡ Turborepo Features

### Smart Caching

```bash
# First build
npm run build  # ~5 seconds

# No changes
npm run build  # Instant! (from cache)
```

### Task Dependencies

When you run `npm run build`, Turborepo:
1. Builds `my-lib` first (dependency)
2. Then builds `web` (depends on my-lib)
3. Caches outputs for next time

### Parallel Execution

```bash
npm run dev
# → Runs my-lib dev (watch mode)
# → Runs web dev (vite server)
# Both run simultaneously!
```

## 🔧 Troubleshooting

### Clear cache

```bash
npx turbo clean
npm run clean
```

### Reinstall dependencies

```bash
rm -rf node_modules
npm install
```

### Build from scratch

```bash
npm run clean
npm run build
```

## 📖 More Info

- See `README.md` for full documentation
- See `MONOREPO_SETUP.md` for migration details
- See `turbo.json` for task configuration

## 🎉 You're Ready!

Your monorepo is set up and ready to use. Start developing with:

```bash
npm run dev
```

Happy coding! 🚀

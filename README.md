# Imaginary Product - Turborepo Monorepo

This is a monorepo powered by [Turborepo](https://turbo.build/repo) containing a React web application and a shared utility library.

## 📦 What's Inside?

This monorepo includes the following packages/apps:

```
apps/
  web/              Main React application (Vite + React)
packages/
  my-lib/           Shared utility library (@raydedon/assessment-lib)
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Install all dependencies
npm install
```

### Development

```bash
# Run all apps in development mode
npm run dev

# Run specific workspace
npm run dev --workspace=web
npm run dev --workspace=@raydedon/assessment-lib
```

The web app will be available at `http://localhost:5173` (or the next available port).

### Build

```bash
# Build all packages
npm run build

# Build specific package using Turbo
npx turbo build --filter=web
npx turbo build --filter=@raydedon/assessment-lib
```

### Other Commands

```bash
# Type check all packages
npm run type-check

# Clean all build artifacts
npm run clean

# Format code (if prettier is configured)
npm run format
```

## 📂 Project Structure

```
imaginary-product/
├── apps/
│   └── web/                    # Main React application
│       ├── src/
│       │   ├── components/     # Reusable UI components
│       │   ├── pages/          # Page components
│       │   ├── contexts/       # React contexts
│       │   ├── hooks/          # Custom hooks
│       │   └── utils/          # Utility functions
│       ├── public/             # Static assets
│       ├── package.json
│       └── vite.config.mjs
│
├── packages/
│   └── my-lib/                # Shared utility library
│       ├── src/
│       │   ├── components/    # React components (Note, BigNote)
│       │   ├── datetime.ts    # Date/time utilities
│       │   ├── phone.ts       # Phone number utilities
│       │   ├── transformers.ts # Data transformers
│       │   └── index.ts       # Main entry point
│       ├── dist/              # Build output (generated)
│       └── package.json
│
├── package.json               # Root workspace config
├── turbo.json                # Turborepo configuration
└── README.md                 # This file
```

## 🔧 Tech Stack

### Web App (`apps/web`)

- **Framework:** React 18
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS with custom plugins
- **UI Components:** Radix UI, shadcn-ui
- **State Management:** React Context API, TanStack React Query
- **Routing:** React Router v6
- **Data Visualization:** Recharts, D3.js
- **API Client:** Axios
- **Virtualization:** @tanstack/react-virtual

### Utility Library (`packages/my-lib`)

- **Language:** TypeScript
- **Build Tool:** tsup
- **UI Components:** React
- **Utilities:**
  - Date/time manipulation (moment)
  - Phone number parsing (libphonenumber-js)
  - Data transformation (lodash)

## 🏗️ Monorepo Features

### Workspace Dependencies

The `web` app depends on `my-lib` as a local workspace package:

```json
{
  "devDependencies": {
    "@raydedon/assessment-lib": "*"
  }
}
```

This creates a symlink in `node_modules/@raydedon/assessment-lib` pointing to `packages/my-lib`.

### Task Pipeline

Turborepo automatically handles task dependencies defined in `turbo.json`:

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],  // Build dependencies first
      "outputs": ["dist/**"]     // Cache these files
    }
  }
}
```

When you run `npm run build`:
1. `my-lib` builds first
2. `web` builds after (depends on my-lib)

### Caching

Turborepo caches task outputs for faster subsequent runs:

```bash
# First build
npm run build  # Takes ~5 seconds

# No changes, run again
npm run build  # Instant! (from cache)

# Change only my-lib
npm run build  # Only rebuilds my-lib and web
```

## 📚 Using the Utility Library

### Import in Web App

```javascript
// apps/web/src/App.jsx
import { 
  getCurrentDate, 
  formatPhoneNumber, 
  transformArray,
  Note,
  BigNote 
} from '@raydedon/assessment-lib';

function App() {
  const today = getCurrentDate();
  const phone = formatPhoneNumber('1234567890', 'US');
  
  return (
    <div>
      <Note title="Today's Date" content={today} />
      <BigNote title="Contact" content={phone} />
    </div>
  );
}
```

### Hot Reload

When you edit `packages/my-lib` in dev mode:
1. Turborepo detects the change
2. Rebuilds `my-lib` (watch mode)
3. `web` hot-reloads automatically

## 🔨 Development Workflow

### Adding a New Package

1. Create directory under `apps/` or `packages/`
2. Add `package.json` with proper name
3. The workspace will auto-detect it
4. Run `npm install` to link dependencies

### Adding Dependencies

```bash
# Add to web app
npm install axios --workspace=web

# Add to my-lib
npm install moment --workspace=@raydedon/assessment-lib

# Add to root (dev dependencies)
npm install -D prettier --workspace-root
```

### Building for Production

```bash
# Build everything
npm run build

# Output locations:
# - packages/my-lib/dist/
# - apps/web/build/
```

## 🧪 Testing

```bash
# Run tests (when configured)
npx turbo test

# Test specific package
npx turbo test --filter=web
```

## 🐛 Debugging

### Check Workspace Structure

```bash
npm ls --workspace=web
npm ls --workspace=@raydedon/assessment-lib
```

### Clear Cache

```bash
# Clear Turborepo cache
npx turbo clean

# Clean node_modules
npm run clean
rm -rf node_modules
npm install
```

### Build Issues

```bash
# Clean and rebuild
npm run clean
npm run build
```

## 📖 Useful Turborepo Commands

```bash
# Run task in all packages
npx turbo run build

# Run task in specific package
npx turbo run build --filter=web

# Run task in package and dependencies
npx turbo run build --filter=web...

# Run task in package and dependents
npx turbo run build --filter=...web

# Dry run (see what would execute)
npx turbo run build --dry-run

# Show task graph
npx turbo run build --graph
```

## 🌟 Key Benefits

1. **Faster Builds:** Smart caching means only changed packages rebuild
2. **Parallel Execution:** Tasks run concurrently when possible
3. **Dependency Management:** Automatic task ordering based on dependencies
4. **Code Sharing:** Easy to share code between packages
5. **Type Safety:** Full TypeScript support across packages
6. **Hot Reload:** Changes in library instantly reflect in apps

## 📝 Environment Variables

### Web App

Create `apps/web/.env`:

```env
VITE_PEXELS_API_KEY=your-pexels-api-key
VITE_API_URL=https://api.example.com
```

### Global

Create `.env` in root for shared variables (configure in `turbo.json`):

```json
{
  "globalDependencies": ["**/.env.*local"]
}
```

## 🚢 Deployment

### Deploy Web App

```bash
# Build for production
npm run build

# Deploy apps/web/build/ to your hosting provider
# (Vercel, Netlify, AWS S3, etc.)
```

### Publish Library

```bash
# Build the library
npx turbo build --filter=@raydedon/assessment-lib

# Publish to npm (from packages/my-lib)
cd packages/my-lib
npm publish --access public
```

## 🤝 Contributing

1. Create a feature branch
2. Make changes in appropriate workspace
3. Run `npm run build` to verify
4. Run `npm run type-check` to check types
5. Commit and push

## 📄 License

ISC

## 🔗 Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [npm Workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces)
- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)

---

Built with ❤️ using Turborepo

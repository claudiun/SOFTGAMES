# SOFTGAMES

SOFTGAMES TEST

## Build Logic

This project uses [esbuild](https://esbuild.github.io/) for fast bundling and building of TypeScript code.

### Scripts

- `npm run build`: Bundles the code into `build/bootstrap.js` (unminified, with debug logs enabled for development).
- `npm run build:watch`: Same as `build`, but automatically rebuilds on code changes.
- `npm run build:prod`: Bundles and minifies the code for production (debug logs are disabled).
- `npm run serve`: Runs both the watcher and a local server for development at [http://localhost:3000](http://localhost:3000).

### Debug Logging

- The global `log` function is available for debugging.
- Debug logs are **enabled** in development builds and **disabled** in production builds, based on the `process.env.NODE_ENV` value, which is set by esbuild at build time.

### Entry Point

- The main entry file is `src/bootstrap.ts`. All code is bundled into `build/bootstrap.js` for use in `index.html`.

**Live Build:** [https://softgamestest.onrender.com](https://softgamestest.onrender.com)

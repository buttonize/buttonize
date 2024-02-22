# Clean up dist folder
rm -rf dist && \
# Prepare new dist folder
mkdir -p dist/esm dist/cjs && \
# Build ESM modules alternative
tsc --project tsconfig.release-esm.json && \
# Build CJS alternative
tsc --project tsconfig.release-cjs.json && \
# Build types
tsc --project tsconfig.release-types.json && \
# Build shared types used for internal Buttonize purposes
tsup cli/api/_ws.ts -d dist/types --tsconfig=tsconfig.release-types.json --dts-only && \
# Remove husky in prepare script from package.json and copy it to dist
# because contents of dist contain all files that will be published to NPM
jq 'del(.scripts.prepare)' package.json > dist/package.json && \
# This hack allows cjs/esm to co-exist in parallel
echo '{"type": "commonjs"}' > dist/cjs/package.json && \
echo '{"type": "module"}' > dist/esm/package.json && \
# Copy remaining files important for the final package 
cp LICENSE dist && \
cp README.md dist

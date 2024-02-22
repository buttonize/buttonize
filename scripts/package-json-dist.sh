# Remove husky in prepare script from package.json and copy it to dist
# because contents of dist contain all files that will be published to NPM
jq 'del(.scripts.prepare)' package.json > dist/package.json

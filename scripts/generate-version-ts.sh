# Semantic release expects package.json to be located in dist folder
mkdir dist && \
sh ./scripts/package-json-dist.sh && \
# Generate potential new version
pnpm semantic-release --dry-run | \
# Parse output
awk '/The next release version is ([0-9]+\.[0-9]+\.[0-9]+)/{ print $0 }' | \
# Store the version in version.ts
awk '{split($0, array, "version is "); printf "export const version = \"%s\"\n",array[2]}' > cdk/custom-resources/version.ts

# If there is no new version reset value of version.ts
if [[ $(cat cdk/custom-resources/version.ts | wc -c) -eq 0 ]]; then
    git checkout HEAD -- cdk/custom-resources/version.ts
fi

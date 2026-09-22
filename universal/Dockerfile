# stage build
FROM node:18.9.0-alpine

RUN apk --no-cache add curl wget unzip ca-certificates git

RUN GRPC_HEALTH_PROBE_VERSION=v0.3.2 && \
    wget -qO/bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-amd64

RUN chmod +x /bin/grpc_health_probe

WORKDIR /app

# copy everything to the container
COPY . .

# Add registry credentials to access private packages in .npmrc
ARG NPM_PACKAGE_PUBLISH_TOKEN
RUN echo '@CDNA-Technologies:registry=https://npm.pkg.github.com/CDNA-Technologies' >> .npmrc
RUN echo '//npm.pkg.github.com/:_authToken=${NPM_PACKAGE_PUBLISH_TOKEN}' >> .npmrc
RUN echo 'registry=https://registry.npmjs.org' >> .npmrc

# install all dependencies
RUN npm install

# remove potential security issues
# RUN npm audit fix

# Remove vital imports file
RUN rm ./src/svelte-vitals-imports.svelte

# build SvelteKit app
RUN npm run build

# stage run
FROM node:18.9.0-alpine

WORKDIR /app

# copy dependency list
COPY --from=0 /app/package*.json ./
COPY --from=0 /bin/grpc_health_probe /bin/grpc_health_probe

# Add registry credentials to access private packages in .npmrc
ARG NPM_PACKAGE_PUBLISH_TOKEN
RUN echo '@CDNA-Technologies:registry=https://npm.pkg.github.com/CDNA-Technologies' >> .npmrc
RUN echo '//npm.pkg.github.com/:_authToken=${NPM_PACKAGE_PUBLISH_TOKEN}' >> .npmrc
RUN echo 'registry=https://registry.npmjs.org' >> .npmrc

# clean install dependencies, no devDependencies, no prepare script
RUN npm ci --production --ignore-scripts

# remove potential security issues
# RUN npm audit fix

# copy built SvelteKit app to /app
COPY --from=0 /app/build ./

EXPOSE 3000
CMD ["node", "./index.js"]

# Use the official Node.js 18.13.0 image.
# https://hub.docker.com/_/node
FROM node:20.7.0

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Clean npm cache forcefully before installing dependencies
RUN npm cache clean --force

# Update dependencies
RUN npm update

# Install production dependencies.
RUN npm install --unsafe-perm --production

# Copy local code to the container image.
COPY . ./

# Set Node.js options (optional)
ENV NODE_OPTIONS="--max-old-space-size=8192"

# Set Node environment to production
ENV NODE_ENV=production

# Build the Gatsby site
RUN npm run build

# Install `serve` to run the site.
RUN npm install -g serve

# Run the web service on container startup.
CMD ["serve", "-s", "public"]

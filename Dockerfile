# Use the official Node.js 16.20.0 image.
# https://hub.docker.com/_/node
FROM node:18

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Clean npm cache forcefully before installing dependencies
RUN npm cache clean --force

# Install production dependencies.
RUN npm install --unsafe-perm --production

# Declare build arguments for environment variables
ARG GATSBY_ENV_VAR

# Set environment variables
ENV GATSBY_ANALYTIC_KEY="UA-239898697-1"
ENV GATSBY_API_BASE_URL="https://api.nyyu.io"
ENV GATSBY_BINANCE_BASE_API="https://api.binance.com/api"
ENV GATSBY_CurrencyIconEndpoint="https://currencyfreaks.com/photos/flags"
ENV GATSBY_SHUFTI_CLIENT="wiKW623AK8inO2Uq7w1Hg2j3vOxGdEFDgigTByjxzA4Xl47pLJ1641498266"
ENV GATSBY_SHUFTI_SECRET="bp5p6IBmrtRMyuddhcn1Npkf5bqRdb3f"
ENV GATSBY_SITE_URL="http://www.nyyu.io"
ENV GATSBY_WITHDRAW_PRIVATE_KEY="withdraw_private_key_alskdjfeiblskeHdek"
ENV GATSBY_WITHDRAW_PUBLIC_KEY="public_VdkegiehdJgehiE"
ENV GATSBY_ZENDESK_KEY="18a2747f-28bb-4d78-b0c9-f3bd5047dd31"

# Copy local code to the container image.
COPY . ./

# Build the Gatsby site
RUN npm run build

# Install `serve` to run the site.
RUN npm install -g serve

# Run the web service on container startup.
CMD ["serve", "-s", "public"]

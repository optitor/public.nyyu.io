require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
    siteMetadata: {
        title: `NYYU`,
        description: `The NDB token pre-sale: NDB token will help you gain access to the NDB Ecosystem and allows the acquisition of some of its utilities, such as NFTs.`,
        author: `@gatsbyjs`,
        siteUrl: `https://gatsbystarterdefaultsource.gatsbyjs.io/`,
    },
    plugins: [
        // Modern Google Analytics with GDPR compliance
        {
            resolve: `gatsby-plugin-google-gtag`,
            options: {
                trackingIds: [
                    "UA-239898697-1", // Google Analytics / GA
                    "GTM-T3PBD6T", // Google Tag Manager
                ],
                pluginConfig: {
                    head: false,
                    respectDNT: true,
                    exclude: ["/preview/**", "/do-not-track/me/too/"],
                },
                gtagConfig: {
                    anonymize_ip: true,
                    cookie_expires: 0,
                },
            },
        },
        // Modern Google Tag Manager
        {
            resolve: `gatsby-plugin-google-tagmanager`,
            options: {
                id: "GTM-T3PBD6T",
                includeInDevelopment: false,
                defaultDataLayer: { platform: "gatsby" },
                routeChangeEventName: "gatsby-route-change",
                enableWebVitalsTracking: true,
            },
        },
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-styled-components`,
        `gatsby-plugin-image`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
            },
        },
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `NYYU - NDB Token Pre-sale`,
                short_name: `NYYU`,
                start_url: `/`,
                background_color: `#663399`,
                theme_color: `#663399`,
                display: `minimal-ui`,
                icon: `src/images/favicon.png`,
                cache_busting_mode: "query",
                include_favicon: true,
                legacy: true,
                theme_color_in_head: false,
                // Fix preload warnings by controlling resource hints
                icon_options: {
                    purpose: `any maskable`,
                },
            },
        },
        `gatsby-plugin-sass`,
    ],
    flags: {
        FAST_DEV: true,
        PRESERVE_FILE_DOWNLOAD_CACHE: true,
        PARALLEL_SOURCING: true,
        // Disable resource hints that may cause preload warnings
        DEV_SSR: false,
    },
};

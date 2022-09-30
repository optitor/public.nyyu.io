require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
    siteMetadata: {
        title: `NYYU`,
        description: `The NDB token pre-sale: NDB token will help you gain access to the NDB Ecosystem and allows the acquisition of some of its utilities, such as NFTs.`,
        author: `@gatsbyjs`,
        siteUrl: `https://gatsbystarterdefaultsource.gatsbyjs.io/`,
    },
    plugins: [
        {
            resolve: "gatsby-plugin-hubspot",
            options: {
              trackingCode: "7628932",
              respectDNT: false,
              productionOnly: true,
            },
        },
        {
            resolve: `gatsby-plugin-google-gtag`,
            options: {
              trackingIds: [
                "UA-239898697-1", // Google Analytics / GA
              ],
              pluginConfig: {
                head: true        
              },
            }
        },
        {
            resolve: "gatsby-plugin-google-tagmanager",
            options: {
                id: "GTM-T3PBD6T",
                includeInDevelopment: false,
           
                // GTM environment details.
                gtmAuth: "null",
                gtmPreview: "null",
              },
        },
        `gatsby-plugin-webfonts`,
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-styled-components`,
        `gatsby-theme-material-ui`,
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
                name: `gatsby-starter-default`,
                short_name: `starter`,
                start_url: `/`,
                background_color: `#663399`,
                display: `minimal-ui`,
                icon: `src/images/favicon.png`, // This path is relative to the root of the site.
            },
        },
        `gatsby-plugin-sass`,
        {
            resolve: `gatsby-plugin-google-fonts`,
            options: {
                fonts: [`Montserrat\:300,400,500,700,800`],
            },
        },
        {
            resolve: "gatsby-plugin-no-sourcemaps",
        },
        "gatsby-plugin-use-query-params"
    ],
    flags: {
        PARALLEL_QUERY_RUNNING: true
    }
}

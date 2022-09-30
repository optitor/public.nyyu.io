require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`,
})
const GATSBY_ANALYTIC_KEY = "UA-239898697-1"
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
            resolve: `gatsby-plugin-gdpr-cookies`,
            options: {
              googleAnalytics: {
                trackingId: 'UA-239898697-1', // leave empty if you want to disable the tracker
                cookieName: 'gatsby-gdpr-google-analytics', // default
                anonymize: true, // default
                allowAdFeatures: false // default
              },
              googleTagManager: {
                trackingId: 'GTM-T3PBD6T', // leave empty if you want to disable the tracker
                cookieName: 'gatsby-gdpr-google-tagmanager', // default
                dataLayerName: 'dataLayer', // default
              },
              // defines the environments where the tracking should be available  - default is ["production"]
              environments: ['production']
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

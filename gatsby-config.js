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
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-styled-components`,
        `gatsby-plugin-image`,
        `gatsby-plugin-use-query-params`,
        `gatsby-plugin-sass`,
        `gatsby-plugin-sharp`,
        `gatsby-transformer-sharp`,
        {
            resolve: `gatsby-plugin-webfonts`,
            options: {
              fonts: {
                google: [
                  {
                    family: "Montserrat",
                    variants: ["300", "400", "500" , "700", "800"],
                  },
                  {
                    family: "Open Sans Condensed",
                    variants: ["300", "700"],
                  },
                ],
              },
            },
          },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
            },
        },
        {
            resolve: `gatsby-plugin-google-fonts`,
            options: {
                fonts: [`Montserrat\:300,400,500,700,800`],
            },
        }, 
        {
            resolve: "gatsby-plugin-no-sourcemaps",
        },
        {
            resolve: "gatsby-plugin-google-tagmanager",
            options: {
              id: process.env.GOOGLE_TAGMANAGER_ID,
              includeInDevelopment: false,
              defaultDataLayer: { platform: "gatsby" },
            },
          },
          {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `gatsby-starter-default`,
                short_name: `starter`,
                start_url: `/`,
                background_color: `#663399`,
                display: `standalone`,
                icon: `src/images/favicon.png`, // This path is relative to the root of the site.
            },
        },
    ],
    flags: {
        PARALLEL_QUERY_RUNNING: true,
        // DEV_SSR: true,
    }
}
          
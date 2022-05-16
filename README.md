# ndb.sale

NDB Auction and Direct Sale

# Routing

The logged-in section doesn’t need to be server rendered as all data will be loaded live from your API after the user logs in. So it makes sense to make this portion of your site client-only.

# Mutli-language support

    npm i npx-languages

    npx initlang

and input languages on `languages/**.languages.json` files for proper languages, then run this command:

    npx autotranslate
    Type in the language (bcp-47 symbol) to use as template. en
    Type in the language (bcp-47 symbol) to translate to. fr

then

    npx compilelang
    Type in the relative path of your client-src-directory: src/assets

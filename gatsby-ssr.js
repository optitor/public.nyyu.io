import React from "react";
import { Helmet } from "react-helmet";

import "./src/utilities/dayjs-config";

export { wrapRootElement } from "./src/providers/wrap-with-provider";

export const onRenderBody = (
    {
        setHeadComponents,
        setHtmlAttributes,
        setBodyAttributes,
        setPostBodyComponents,
    },
    pluginOptions,
) => {
    const GOOGLE_PLACE_API_KEY = process.env.GOOGLE_PLACE_API_KEY;
    setPostBodyComponents([
        <script
            key="placeapi"
            src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACE_API_KEY}&libraries=places`}
            async
        ></script>,
        <script
            async
            src="https://tag.simpli.fi/sifitag/59353100-2dfc-013b-5b3d-0cc47a8ffaac"
        ></script>,
    ]);

    const helmet = Helmet.renderStatic();
    setHtmlAttributes(helmet.htmlAttributes.toComponent());
    setBodyAttributes(helmet.bodyAttributes.toComponent());
    setHeadComponents([
        helmet.title.toComponent(),
        helmet.link.toComponent(),
        helmet.meta.toComponent(),
        helmet.noscript.toComponent(),
        helmet.script.toComponent(),
        helmet.style.toComponent(),
    ]);
};

export const onPreRenderHTML = ({
    getHeadComponents,
    replaceHeadComponents,
}) => {
    /**
     * @type {any[]} headComponents
     */
    const headComponents = getHeadComponents();

    headComponents.sort((a, b) => {
        if (a.props && a.props["data-react-helmet"]) {
            return -1;
        }
        if (b.props && b.props["data-react-helmet"]) {
            return 1;
        }
        return 0;
    });

    replaceHeadComponents(headComponents);
};

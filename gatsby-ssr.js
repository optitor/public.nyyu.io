import React from 'react';
export { wrapRootElement } from './src/providers/wrap-with-provider';


export const onRenderBody = (
    {setPostBodyComponents}, pluginOptions
) => {
    const GOOGLE_PLACE_API_KEY = process.env.GOOGLE_PLACE_API_KEY;
    setPostBodyComponents([
        <script key="placeapi" src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACE_API_KEY}&libraries=places`} async></script>
    ])
}

export const onPreRenderHTML = ({
    getHeadComponents,
    replaceHeadComponents,
}) => {
    const headComponents = getHeadComponents();
    headComponents.sort((a, b) => {
      if (a.type === b.type || (a.type !== 'style' && b.type !== 'style')) {
        return 0;
      }

      if (a.type === 'style') {
        return 1;
      } else if (b.type === 'style') {
        return -1;
      }
  
      return 0;
    });
  
    replaceHeadComponents(headComponents);
};
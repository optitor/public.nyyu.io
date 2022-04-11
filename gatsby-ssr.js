import React from 'react';
export { wrapRootElement } from './src/providers/wrap-with-provider';


export const onRenderBody = (
    {setPostBodyComponents}, pluginOptions
) => {
    const GOOGLE_PLACE_API_KEY = process.env.GOOGLE_PLACE_API_KEY || 'AIzaSyBnFvWN3rbGQveqWUCufHyBqlshKO-946Q';
    setPostBodyComponents([
        <script key="placeapi" src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACE_API_KEY}&libraries=places`} async></script>
    ])
}



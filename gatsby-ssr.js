import React from 'react';
export { wrapRootElement } from './src/providers/wrap-with-provider';


export const onRenderBody = (
    {setPostBodyComponents}, pluginOptions
) => {
    setPostBodyComponents([
        <script key="placeapi" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBnFvWN3rbGQveqWUCufHyBqlshKO-946Q&libraries=places" async></script>
    ])
}



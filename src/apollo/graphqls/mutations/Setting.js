<<<<<<< HEAD
import { gql } from "@apollo/client";

export const UPDATE_FAVOR_ASSETS = gql`
    mutation UpdateFavorAssets(
        $assets: String
    ) {
        updateFavorAssets(
            assets: $assets
        )
    }
=======
import { gql } from "@apollo/client";

export const UPDATE_FAVOR_ASSETS = gql`
    mutation UpdateFavorAssets(
        $assets: String
    ) {
        updateFavorAssets(
            assets: $assets
        )
    }
>>>>>>> fc4a3dbd6ba90122e7655de913514501b2ab8713
`;
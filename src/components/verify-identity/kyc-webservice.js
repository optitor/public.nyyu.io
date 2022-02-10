import { gql } from "@apollo/client"

export const UPLOAD_DOCUMENT = gql`
    mutation UploadDocument(
        $document: Upload
    ) {
        uploadDocument(
            document: $document
        )
    }
`

export const UPLOAD_ADDRESS = gql`
    mutation(
        $document: Upload
    ) {
        uploadAddress(
            address: $document
        )
    }
`

export const UPLOAD_CONSENT = gql`
    mutation(
        $consent: Upload
    ) {
        uploadConsent(
            consent: $consent
        )
    }
`

export const UPLOAD_SELFIE = gql`
    mutation(
        $selfie: Upload
    ) {
        uploadSelfie(
            selfie: $selfie
        )
    }
`
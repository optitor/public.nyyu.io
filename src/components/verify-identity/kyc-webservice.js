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
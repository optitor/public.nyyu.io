import { gql } from "@apollo/client"

export const UPLOAD_DOCUMENT = gql`
    mutation($file: Upload!){
        uploadDocument(document: $file)
    }
`
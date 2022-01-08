import { useMutation, useQuery } from "@apollo/client";
import * as Mutation from '../graghqls/mutations/AvatarComponent';
import * as Query from './../graghqls/querys/AvatarComponent';

export const useCreateNewComponentMutation = () => {
    const [mutation, mutationResults] = useMutation(Mutation.CREATE_NEW_COMPONENT);

    const createNewComponent = (groupId, tierLevel, price, limited, svg, width, top, left) => {
        return mutation({
            variables: {
                groupId,
                tierLevel,
                price,
                limited,
                svg,
                width,
                top,
                left
            },
        })
    };

    return [createNewComponent, mutationResults];
};

export const useGetAvatarComponentsQuery = () => {
    const queryResults = useQuery(Query.GET_AVATAR_COMPONENTS);

    return queryResults;
};
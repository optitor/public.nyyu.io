import { client } from "../../apollo/client";
import { showFailAlarm, showSuccessAlarm } from "../../components/admin/AlarmModal";
import * as Mutation from './../../apollo/graghqls/mutations/User';

export const create_New_User = createData => async dispatch => {
    try {
        const { data } = await client.mutate({
            mutation: Mutation.CREATE_NEW_USER,
            variables: { ...createData }
        });
        console.log(data);
        showSuccessAlarm('User created successfully');
    } catch(err) {
        console.log(err);
        showFailAlarm('Action failed', 'Ops! Something went wrong!');
    }
};
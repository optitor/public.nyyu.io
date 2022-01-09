import _ from 'lodash';
import { FETCH_AVATAR_COMPONENTS } from "../actionTypes";

export const fetch_Avatar_Components = data => dispatch => {
    const hairStyles = _.mapKeys(_.filter(data, {groupId: 'hairStyle'}), 'compId');
    const facialStyles = _.mapKeys(_.filter(data, {groupId: 'facialStyle'}), 'compId');
    const expressions = _.mapKeys(_.filter(data, {groupId: 'expression'}), 'compId');
    const hats = _.mapKeys(_.filter(data, {groupId: 'hat'}), 'compId');
    const others = _.mapKeys(_.filter(data, {groupId: 'other'}), 'compId');
    dispatch({
        type: FETCH_AVATAR_COMPONENTS,
        payload: { hairStyles, facialStyles, expressions, hats, others }
    });
};
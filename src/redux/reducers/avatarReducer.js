import { defaultComponents } from "../../components/dress-up/dressup-data";
import { FETCH_AVATAR_COMPONENTS } from "../actionTypes";

const InitialAvatarComponents = {
    loaded: false,
    hairStyles: {'default': defaultComponents.hairStyle},
    facialStyles: {'default': defaultComponents.facialStyle},
    expressions: {'default': defaultComponents.expression},
    hats: {'default': defaultComponents.hat},
    others: {'default': defaultComponents.other},
};

export const avatarComponentsReducer = (state = InitialAvatarComponents, action) => {
    switch(action.type) {
        case FETCH_AVATAR_COMPONENTS:
            state.hairStyles = { ...state.hairStyles, ...action.payload.hairStyles };
            state.facialStyles = { ...state.facialStyles, ...action.payload.facialStyles };
            state.expressions = { ...state.expressions, ...action.payload.expressions };
            state.hats = { ...state.hats, ...action.payload.hats };
            state.others = { ...state.others, ...action.payload.others };
            return { ...state, loaded: true };
        default:
            return state;
    }
};
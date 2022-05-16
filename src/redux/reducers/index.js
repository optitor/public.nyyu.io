import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { errorsReducer } from "./errorReducer";
import { avatarComponentsReducer } from "./avatarReducer";
import { bidReducer, currencyRatesReducer } from "./bidReducer";
import { tasksReducer, userTierReducer } from "./settingReducer";
import { dataReducer } from './dataReducer';
import { kycSettingsReducer } from "./settingReducer";
import { allFeesReducer } from "./allFeesReducer";
import { tempReducer, profileTabReducer } from './tempReducer';
import { favorAssetsReducer } from "./settingReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    avatarComponents: avatarComponentsReducer,
    errors: errorsReducer,
    userTiers: userTierReducer,
    placeBid: bidReducer,
    kycSettings: kycSettingsReducer,
    tasks: tasksReducer,
    data: dataReducer,
    temp: tempReducer,
    allFees: allFeesReducer,
    profileTab: profileTabReducer,
    currencyRates: currencyRatesReducer,
    favAssets: favorAssetsReducer,
});

export default rootReducer;

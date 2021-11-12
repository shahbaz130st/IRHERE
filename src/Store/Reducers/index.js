import { combineReducers } from "redux";
import authenticationReducer from "./AuthenticationReducer";
import themeChangeReducer from "./themeChangeReducer";
const rootReducer = combineReducers({
    authenticationReducer: authenticationReducer,
    themeChangeReducer:themeChangeReducer
})
export default rootReducer;
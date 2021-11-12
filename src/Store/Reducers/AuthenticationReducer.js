import { SIGN_IN, SIGN_OUT } from "../Actions";
const initialState = { user: null, isLogin: false }


const authenticationReducer = (state = initialState, action) => {
    switch (action.type) {
        case SIGN_IN:
            return {
                ...state,
                user: action.user,
                isLogin: action.isLogin

            }
        case SIGN_OUT:
            return {
                ...state,
                user: null,
                isLogin: false
            }
        default:
            return state
    }
}
export default authenticationReducer;
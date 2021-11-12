import { CHANGE_PRIMARY_THEME, CHANGE_SECONDARY_THEME } from "../Actions";
const initialState = { primaryColor: "#7C9FFC", secondaryColor: "#FFFFFF" }


const themeChangeReducer = (state = initialState, action) => {
    
    switch (action.type) {
        case CHANGE_PRIMARY_THEME:
            console.log(action)
            return {
                ...state,
                primaryColor: action.primaryColor
            }
        case CHANGE_SECONDARY_THEME:
            return {
                ...state,
                secondaryColor: action.SecondaryColor
            }
        default:
            return state
    }
}
export default themeChangeReducer;
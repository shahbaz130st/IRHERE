import { SIGN_IN, SIGN_OUT,CHANGE_PRIMARY_THEME,CHANGE_SECONDARY_THEME } from "./Actions";

export const signIn = (user) => {
    return {
        type: SIGN_IN,
        user: user.userData,
        isLogin: user.isLogin,
    }
}

export const signOut = () => {
    return {
        type: SIGN_OUT,
        user: null,
        isLogin: false
    }
}
export const setPrimaryColor = (primaryColor) => {
    return {
        type: CHANGE_PRIMARY_THEME,
        primaryColor: primaryColor
    }
}

export const setSecondaryColor = (secondaryColor) => {
    return {
        type: CHANGE_SECONDARY_THEME,
        secondaryColor: secondaryColor
    }
}
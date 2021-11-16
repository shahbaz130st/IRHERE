import { Platform, StyleSheet } from "react-native";
import { colors } from "../Themes/colors";
import { phoneScreen } from "../Themes/phoneScreen";
const styles = StyleSheet.create(
    {
        buttonStyle: {
            marginTop: 20,
            width: "100%",
            height: Platform.OS === "android" ? phoneScreen.height * 8 / 100 : phoneScreen.height * 6 / 100,
            alignItems: "center",
            borderRadius: phoneScreen.height * 1 / 100,
        },
        buttonTextStyle: {
            textAlign: "center",
            color: colors.secondaryColor,
            fontSize: 15
        },
        shadowStyle: {
            shadowColor: colors.primaryColor,
            shadowOffset: {
                width: 0,
                height: 8,
            },
            shadowOpacity: 0.58,
            shadowRadius: 16.00,

            elevation: 14,
        },
        inputContainerStyle: {
            backgroundColor: colors.whiteColor,
            width: "100%",
            height: Platform.OS === "android" ? phoneScreen.height * 8 / 100 : phoneScreen.height * 6 / 100,
            justifyContent: "center",
            borderRadius: phoneScreen.height * 1 / 100,
            paddingHorizontal: 10,
            borderColor: colors.greyColor,
            borderWidth: 1.5
        },
        inputInnerStyle: {
            padding: 0,
            color: colors.greyColor,
            fontSize: 16
        },
        checkLabelStyle: {
            color: colors.blackTextColor,
            fontSize: 14
        }
    }
)
export default styles;
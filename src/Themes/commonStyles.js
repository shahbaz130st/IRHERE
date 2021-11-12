import { Platform, StyleSheet } from "react-native";
import { colors } from "../Themes/colors";
import { phoneScreen } from "../Themes/phoneScreen";
const styles = StyleSheet.create(
    {
        buttonStyle: {
            marginTop: 20,
            width: "100%",
            height: Platform.OS === "android" ? phoneScreen.height * 6 / 100 : phoneScreen.height * 4.5 / 100,
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
            backgroundColor: colors.inputField,
            width: "100%",
            height: Platform.OS === "android" ? phoneScreen.height * 8 / 100 : phoneScreen.height * 6 / 100,
            justifyContent: "center",
            borderRadius: phoneScreen.height * 0.5 / 100,
            paddingLeft: 10,
            borderColor: "#8B97A8",
            borderWidth: 0.2
        },
        inputInnerStyle: {
            padding: 0,
            color: colors.blackTextColor,
            fontSize: 14
        },
        checkLabelStyle: {
            color: colors.blackTextColor,
            fontSize: 14
        }
    }
)
export default styles;
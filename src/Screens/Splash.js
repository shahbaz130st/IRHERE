import React, { useEffect } from "react";
import { View, Image } from "react-native";
import { images } from "../Assets/Images/index";
import { StackActions } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Preference from "react-native-preference";

const mainApp = StackActions.replace("TabGroup")
const modeSelection = StackActions.replace("ModeSelection")
const Splash = (props) => {
    const authToken = useSelector(state => state.authenticationReducer.isLogin)
    const state = useSelector(state => state)
    useEffect(() => {
        console.log(Preference.get("mode"),Preference.get("CompleteQuestionaire"))
        if (authToken) {
            if (Preference.get("CompleteQuestionaire")==="done" && Preference.get("mode") === "quarantine") {
                // props.navigation.dispatch(modeSelection)
                props.navigation.dispatch(mainApp)
            } else if (Preference.get("mode") && Preference.get("mode") === "general") {
                props.navigation.dispatch(mainApp)
            }
            else {
                props.navigation.dispatch(modeSelection)
            }
        }
        else {
            props.navigation.navigate("Welcom")
        }
    }, [])
    return (
        <View style={{ flex: 1, backgroundColor: state.themeChangeReducer.primaryColor, alignItems: "center", justifyContent: "center" }}>
            <Image style={{ resizeMode: "contain", height: "40%" }} source={images.logo} />
        </View>
    )
}
export default Splash;
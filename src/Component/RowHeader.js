import React from "react";
import { View, Text,TouchableOpacity,Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { colors } from "../Themes/colors";
const Header = (props) => {
    return (
        <LinearGradient
            start={{ x: 1.0, y: 0.0 }}
            end={{ x: 1.06, y: 1.4 }}
            colors={[
                colors.gradient1,
                "#D1ADB6",
                "#9DF1F1"
            ]}
            style={[{ height: 95, width: "100%" },props.gradientStyle]}>
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1111,flexDirection:"row",alignItems:"center" }}>
                <TouchableOpacity style={{ height: "100%", width: "10%", justifyContent: "center", alignItems: "flex-end" }} onPress={props.backIconPress}>
                    <Image style={{ height: 22, width:22 ,resizeMode:"contain" }} source={props.leftIcon} />
                </TouchableOpacity>
                <View style={{ width: "80%", height: "100%", justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ fontWeight: "700", fontSize: 25, lineHeight: 30, color: colors.whiteColor }}>{props.headerText}</Text>
                </View>
            </View>
        </LinearGradient>
    )
}
export default Header;
import React from "react";
import { View, Text,TouchableOpacity,Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { colors } from "../Themes/colors";
const Header = (props) => {
    return (
        <LinearGradient
            start={{ x: 1.0, y: 0.0 }}
            end={{ x: 1.1, y: 1.5 }}
            colors={[
                colors.gradient1,
                "#D1ADB6",
                "#9DF1F1"
            ]}
            style={{ height: 105, width: "100%" }}>
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1111 }}>
                <TouchableOpacity style={{ paddingTop: 30,paddingHorizontal:30 }} onPress={props.backIconPress}>
                    <Image style={{ height: 20, width:20 ,resizeMode:"contain" }} source={props.leftIcon} />
                </TouchableOpacity>
                <View style={{ width: "100%", alignItems: "center",marginTop:5 }}>
                    <Text style={{ fontWeight: "700", fontSize: 25, lineHeight: 30, color: colors.whiteColor }}>{props.headerText}</Text>
                </View>
            </View>
        </LinearGradient>
    )
}
export default Header;
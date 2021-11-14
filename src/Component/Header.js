import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { colors } from "../Themes/colors";
import _ from "lodash";
const Header = (props) => {
    return (
        // <LinearGradient
        //     start={{ x: 1.0, y: 0.0 }}
        //     end={{ x: 1.1, y: 1.5 }}
        //     colors={[
        //         colors.gradient1,
        //         "#D1ADB6",
        //         "#9DF1F1"
        //     ]}
        //     style={{ height: 105, width: "100%" }}>
        <View style={{ height: 105, width: "100%" },props.containerStyle}>
            {
                !_.isNil(props.leftIcon) &&
                <TouchableOpacity style={{ paddingTop: 30 }} onPress={props.backIconPress}>
                    <Image style={{ height: 20, width: 20, resizeMode: "contain" }, props.iconStyle} source={props.leftIcon} />
                </TouchableOpacity>
            }
            {
                !_.isNil(props.headerText) &&
                <View style={{ width: "100%", alignItems: "center", marginTop: 30 }}>
                    <Text style={{ fontWeight: "700", fontSize: 25, lineHeight: 30, color: colors.whiteColor }}>{props.headerText}</Text>
                </View>
            }
        </View>
        // </LinearGradient>
    )
}
export default Header;
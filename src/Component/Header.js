import React from "react";
import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { colors } from "../Themes/colors";
import _ from "lodash";
import { StatusBarHeight, HeaderHeight } from '../Utils/Dimensions';
const Header = (props) => {
    return (
        <View style={[{ height: HeaderHeight, width: "100%" }, props.containerStyle]}>
            {
                !_.isNil(props.leftIcon) &&
                <TouchableOpacity style={{ paddingTop: StatusBarHeight, paddingHorizontal: 24, paddingBottom: 20, width: 70 }} onPress={props.backIconPress}>
                    <Image style={[{ height: 24, width: 24, resizeMode: "contain" }, props.iconStyle]} source={props.leftIcon} />
                </TouchableOpacity>
            }
            {
                !_.isNil(props.headerText) &&
                <View style={[{ width: "100%", alignItems: "center" }, props.headerTextStyle]}>
                    <Text style={[{ fontWeight: "700", fontSize: 24, lineHeight: 36, color: colors.blackTextColor}, props.headerTStyle]}>{props.headerText}</Text>
                </View>
            }
        </View>
    )
}
export default Header;
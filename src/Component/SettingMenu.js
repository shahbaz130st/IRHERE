import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { colors } from "../Themes/colors";
const SettingMenu = (props) => {
    return (
        <TouchableOpacity style={{ marginTop: 5 }} onPress={props.nextIconPress}>
            <View style={{ height: 30, flexDirection: "row",  justifyContent: "space-between",alignItems:"center"}}>
                <View style={{alignItems:"center" }}>
                    <Text style={{ fontSize: 13, lineHeight: 17, fontWeight: "400", color: colors.greyTypeColor }}>{props.title}</Text>
                </View>
                <TouchableOpacity onPress={props.nextIconPress}>
                    <Image style={{ height: 13, width: 14,resizeMode:"contain" }} source={props.rightIcon} />
                </TouchableOpacity>
            </View>
            <View style={{height:1,width:"100%",backgroundColor:"#D4D9EA",marginTop:5}}/>
        </TouchableOpacity>
    )
}
export default SettingMenu;
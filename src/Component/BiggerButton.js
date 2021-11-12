import React from "react";
import { TouchableOpacity, Text, Image,View } from "react-native";
import _ from "lodash";
const BiggerButton = (props) => {
    return (
        <TouchableOpacity
            disabled={props.disabled}
            style={props.buttonStyle} onPress={props.onPress}>
            <Image style={props.leftImageStyle} source={props.leftImage} />
            <View style={props.textViewStyle}>
                <Text style={props.textStyle}>
                    {props.text}
                </Text>
              {  !_.isNil(props.text1)&&
                <Text style={props.text1Style}>
                    {props.text1}
                </Text>}
            </View>

            <Image style={props.rightImageStyle} source={props.rightImage} />
        </TouchableOpacity>
    )

}
export default BiggerButton;
import React from "react";
import { TouchableOpacity, Text, Image, View } from "react-native";
import _ from "lodash";
const HomeButton = (props) => {
    return (
        <View
            disabled={props.disabled}
            style={props.buttonStyle} onPress={props.onPress}>
            <View style={props.leftImageViewStyle}>
                <Image style={props.leftImageStyle} source={props.leftImage} />
            </View>
            <View style={props.textViewStyle}>
                <Text style={props.textStyle}>
                    {props.text}
                </Text>
                {!_.isNil(props.text1) &&
                    <Text style={props.text1Style}>
                        {props.text1}
                    </Text>}
            </View>
            {!_.isNil(props.Permission) &&
                (props.Permission) ?
                    <View style={props.rightImageViewStyle}>
                        <Image style={props.rightImageStyle} source={props.rightImage} />
                    </View> :
                    <View>
                    </View>
            }
        </View>
    )

}
export default HomeButton;
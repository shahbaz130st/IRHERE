import React from "react";
import { Text, Image, View } from "react-native";
import Button from "../Component/Button";
import _ from "lodash";
import commonStyles from "../Themes/commonStyles";
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
            {!_.isNil(props.rightImage) &&
                <View style={props.rightImageViewStyle}>
                    <Image style={props.rightImageStyle} source={props.rightImage} />
                </View>
            }
            {!_.isNil(props.onAllowPress) &&
                <Button
                    buttonStyle={[commonStyles.buttonStyle,props.button1Style]}
                    textStyle={[commonStyles.textStyle,{fontSize:13}]}
                    text={props.buttonText}
                    onPress={props.onAllowPress}
                />
            }
        </View>
    )

}
export default HomeButton;
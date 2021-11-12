import React from "react";
import { TouchableOpacity, Text } from "react-native";
import _ from "lodash";
import { colors } from "../Themes/colors"
const Button = (props) => {
    return (
        <TouchableOpacity
            disabled={props.disabled}
            style={[{
                width: "100%",
                alignItems: "center",
                justifyContent:!_.isNil(props.isButton)?"space-between": "center",
                flexDirection: "row",
                backgroundColor: colors.primaryColor
            }, props.buttonStyle]} onPress={props.onPress}>
            <Text style={[{ textAlign: "center", color: "white", fontSize: 18 }, props.textStyle]}>
                {props.text}
            </Text>
            {
                !_.isNil(props.isButton) &&
                <TouchableOpacity
                    style={[{
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                        backgroundColor: colors.primaryColor
                    }, props.button1Style]} onPress={props.onSend}>
                    <Text style={[{ textAlign: "center", color: "white", fontSize: 18 }, props.text1Style]}>
                        {props.text1}
                    </Text>

                </TouchableOpacity>
            }


        </TouchableOpacity>
    )

}
export default Button;
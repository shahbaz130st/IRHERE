import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import _ from "lodash";
const ModalOpenField = (props) => {
    return (
        <TouchableOpacity style={props.containerStyle} onPress={props.onPress}>
            {!_.isNil(props.value) &&
                <View style={props.textViewStyle}>
                    <Text style={props.valueStyle}>{props.value}</Text>
                </View>
            }
            {!_.isNil(props.rightImage) &&
                <View style={props.rightImageViewStyle}>
                    <Image style={props.rightImageStyle} source={props.rightImage} />
                </View>
            }
        </TouchableOpacity>
    )
}
export default ModalOpenField;
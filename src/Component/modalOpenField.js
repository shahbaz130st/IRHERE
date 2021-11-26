import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import _ from "lodash";
const ModalOpenField = (props) => {
    return (
        <TouchableOpacity style={props.containerStyle} onPress={props.onPress} disabled={props.disabled} activeOpacity={1}>
            {!_.isNil(props.value) &&
                <View style={props.textViewStyle}>
                    <Text style={props.valueStyle} numberOfLines={props.numberOfLines}>{props.value}</Text>
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
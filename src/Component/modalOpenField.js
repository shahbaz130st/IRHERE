import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import _ from "lodash";
const ModalOpenField = (props) => {
    return (
        <TouchableOpacity style={props.containerStyle} onPress={props.onPress}>
            {!_.isNil(props.image) &&
                <View style={props.imageViewStyle}>
                    <Image style={props.imageStyle} source={props.image} />
                </View>
            }
            {!_.isNil(props.countryCode) &&
                <View style={props.textViewStyle}>
                    <Text style={props.countryCodeStyle}>{props.countryCode}</Text>
                </View>
            }
            <Text style={props.inputStyle}>
                {props.value}
            </Text>
            {!_.isNil(props.rightImage) &&
                <View style={props.rightImageViewStyle}>
                    <Image style={props.rightImageStyle} source={props.rightImage} />
                </View>
            }
        </TouchableOpacity>
    )
}
export default ModalOpenField;
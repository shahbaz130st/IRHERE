import React from "react";
import { View, TextInput, Image,Text,TouchableOpacity } from "react-native";
import _ from "lodash";
const InputField = (props) => {
    return (
        <View style={props.containerStyle}>
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
            <TextInput
                placeholder={props.placeholder}
                placeholderTextColor={props.placeholderTextColor}
                style={props.inputStyle}
                onChangeText={props.onChangeText}
                value={props.value}
                keyboardType={props.keyboardType}
                secureTextEntry={props.secureTextEntry}
                editable={props.editable}
                maxLength={props.maxLength}
                onEndEditing={props.onEndEditing}
            />
        </View>
    )
}
export default InputField;
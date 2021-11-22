import React,{useState} from "react";
import { View, TextInput, Image, Text, TouchableOpacity } from "react-native";
import _ from "lodash";
import {images} from "../Assets/Images/index"
import { colors } from "../Themes/colors";
const InputField = (props) => {
    const [hidePass, setHidePass] = useState(true);
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
                secureTextEntry={props.secureTextEntry?hidePass ? true : false:false}
                editable={props.editable}
                maxLength={props.maxLength}
                onEndEditing={props.onEndEditing}
            />
            {!_.isNil(props.secureTextEntry) &&
                <TouchableOpacity style={{ height: "100%", width: "15%",alignItems:"flex-end",justifyContent:"center" }}
                onPress={()=>{setHidePass(!hidePass)}}>
                    <Image style={{height:"60%",width:"60%",resizeMode:"contain",tintColor:colors.placeholderColor}} source={hidePass? images.hidePasswordIcon:images.unhidePasswordIcon} />
                </TouchableOpacity>
            }
        </View>
    )
}
export default InputField;
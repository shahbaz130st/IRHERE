import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from "../Themes/colors";
import _ from 'lodash';
const CustomRadioButton = props => {
    return (
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
            <TouchableOpacity style={[{
                width: '40%',
                alignItems: 'center', flexDirection: 'row',
            }, props.containerStyle]} onPress={props.onItem1Press}>
                <View
                    style={[styles.checkBoxContainer, { borderColor: props.value === "user" ? colors.gradient1 : colors.placeholderColor, borderWidth: 3 }]}>
                    {props.value === "user" &&
                        <View style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: colors.gradient1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }} />
                    }
                </View>
                <View style={{ flex: 1, marginLeft: 10, }}>
                    <Text style={[{
                        width: '100%',
                        fontSize: 16,
                        color: props.value === "user"?colors.blackTextColor:colors.placeholderColor,
                    }, props.labelStyle]}>{props.label}</Text>
                </View>
            </TouchableOpacity >
            <TouchableOpacity style={[{
                width: '40%',
                alignItems: 'center', flexDirection: 'row',
            }, props.containerStyle]} onPress={props.onItem2Press}>
                <View
                    style={[styles.checkBoxContainer, { borderColor: props.value === "vendor" ? colors.gradient1 : colors.placeholderColor, borderWidth: 3 }]}>
                    {props.value === "vendor" &&
                        <View style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: colors.gradient1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }} />
                    }
                </View>
                <View style={{ flex: 1, marginLeft: 10, }}>
                    <Text style={{
                        width: '100%',
                        fontSize: 16,
                        color: props.value === "vendor"?colors.blackTextColor:colors.placeholderColor,
                    }}>{props.label2}</Text>
                </View>

            </TouchableOpacity >
        </View>
    )
}

export default CustomRadioButton;
const styles = StyleSheet.create(
    {
        checkBoxContainer: {
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
        },
    }
)

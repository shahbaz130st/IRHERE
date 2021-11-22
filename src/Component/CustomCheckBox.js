import React from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import _ from 'lodash';
const checkIcon = require('../Assets/Images/check.png')
const CustomCheckBox = props => {
    return (
        <TouchableOpacity style={[{
            alignItems: 'center', flexDirection: 'row',
            marginVertical: 5
        }, props.containerStyle]} onPress={props.onChange}>
            <View
                style={[styles.checkBoxContainer, props.checkstyle]}>
                {props.isChecked &&
                    <Image
                        style={{ width: '100%', height: '100%', resizeMode: "contain", tintColor: props.tintColor }}
                        source={checkIcon}
                    />
                }
            </View>
            <View style={[{ marginLeft: 10, }, props.textStyle]}>
                <Text style={[{
                    fontSize: 18,
                    color: 'black',
                }, props.labelStyle]}>{props.label}<Text style={props.label1Style}>{props.label1}</Text></Text>
                {!_.isNil(props.label2) &&
                    <Text style={[{
                        fontSize: 14,
                        color: '#999999',
                    }, props.labelStyle2]}>{props.label2}</Text>
                }
            </View>
        </TouchableOpacity >
    )
}

export default CustomCheckBox;
const styles = StyleSheet.create(
    {
        checkBoxContainer: {
            width: 12,
            height: 12,
            borderRadius: 2,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
        },
    }
)
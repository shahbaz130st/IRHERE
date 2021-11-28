import React from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { colors } from "../Themes/colors";
import Button from "./Button";
import commonStyles from "../Themes/commonStyles";
const CustomModal = (props) => {
    return (
        <View style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.shadowColor
        }}>
            <View
                style={{
                    backgroundColor: "white",
                    width: "85%",
                    height: props.showOkButton ? 230 : 207,
                    borderRadius: 20,
                    padding: 20,
                }}>
                <View
                    style={{ width: "100%", marginBottom: 5 }}>
                    <Text style={props.headingStyle}>{props.headingText ? props.headingText : "Choose Verification Method"}</Text>

                </View>
                <FlatList
                    numColumns={1}
                    data={props.listOfItems}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={{ list: props.listOfItems }}
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={false}
                    style={{ flex: 1, width: "100%" }}
                    renderItem={props.renderItem}
                    ItemSeparatorComponent={props.ItemSeparatorComponent}
                />
                {
                    props.showOkButton &&
                    <View style={{ alignItems: "flex-end", marginTop: 5 }}>
                        <Button
                            buttonStyle={[commonStyles.buttonStyle, props.oKButtonPressStyle]}
                            textStyle={[commonStyles.buttonTextStyle]}
                            text={"Choose"}
                            onPress={props.okButtonPress}
                        />
                    </View>
                    // <TouchableOpacity onPress={props.okButtonPress} style={props.oKButtonPressStyle}>
                    //     <Text style={props.headingButtonStyle}>{"Choose"}</Text>
                    // </TouchableOpacity>
                }
            </View>
        </View>
    )
}
export default CustomModal
import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { images } from "../Assets/Images/index";
import { colors } from "../Themes/colors";
import Button from "./Button";
import commonStyles from "../Themes/commonStyles";
import { useSelector } from "react-redux";
import DeviceInfo from 'react-native-device-info';

const CustomRadioButtonBottomSheet = ({
    visible,
    listOfItems,
    onDragDown = () => { },
    fromGallery = () => { },
    fromCamera = () => { },
    customHeaderText,
    renderItem = () => { },
    ItemSeparatorComponent = () => { },
    headerText,
    headerTextStyle,
    subHeaderText,
    onSelectPress = () => { }
}) => {
    const refRBSheet = useRef();
    const [sheetVisible, setSheetVisible] = useState(visible);
    useEffect(() => {
        if (sheetVisible) {
            refRBSheet.current.open();
        }
    }, [sheetVisible]);
    const state = useSelector(state => state)

    return (
        <RBSheet
            ref={refRBSheet}
            closeOnPressMask={true}
            closeOnDragDown={true}
            onClose={onDragDown}
            customStyles={{
                container: {
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    backgroundColor: "white",
                    alignItems: "center",
                },
                wrapper: {
                    backgroundColor: "#0000001A",
                    // borderColor: "red",
                    // borderWidth: 1,
                    // position: "absolute", bottom: 0, left: 0, top: 0, right: 0,
                    // zIndex:13212323
                },
                draggableIcon: {
                    marginTop: 8,
                    backgroundColor: "#CDCFD0",
                    width: 48,
                    height: 5
                },
            }}
            height={360}>
            <View
                style={{
                    height: 337,
                    backgroundColor: colors.whiteColor,
                    width: "100%",
                    paddingHorizontal: 24,
                    paddingTop: 24,
                }}>
                <Text style={[{ fontWeight: "700", fontSize: 24, color: colors.blackTextColor }, headerTextStyle]}>{headerText}</Text>
                <Text style={[{ fontWeight: "400", fontSize: 14, color: colors.placeholderColor }]}>{subHeaderText}</Text>
                <FlatList
                    numColumns={1}
                    data={listOfItems}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={{ list: listOfItems }}
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews={false}
                    style={{ width: "100%",paddingTop:10}}
                    renderItem={renderItem}
                    ItemSeparatorComponent={ItemSeparatorComponent}
                />
                <Button
                    buttonStyle={[commonStyles.buttonStyle, { backgroundColor: state.themeChangeReducer.primaryColor,marginTop:0 }]}
                    textStyle={commonStyles.textStyle}
                    text={"Select"}
                    onPress={onSelectPress}
                />
                {!DeviceInfo.hasNotch() ?
                    <View style={{ flex: 1, width: "100%", alignItems: "center", marginTop: 16 }}>
                        <View style={{ width: 135, height: 5, borderRadius: 3, backgroundColor: "rgb(57,57,68)" }} />
                    </View> :
                    <View style={{ flex: 1, width: "100%", alignItems: "center", marginTop: 16 }}>
                    </View>
                }
            </View>
        </RBSheet>
    );
};

export default CustomRadioButtonBottomSheet;
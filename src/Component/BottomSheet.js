import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { images } from "../Assets/Images/index";
import DeviceInfo from 'react-native-device-info';
import { colors } from "../Themes/colors";

const LoginOptionsBottomSheet = ({
    visible,
    onDragDown = () => { },
    fromGallery = () => { },
    fromCamera = () => { },
    customHeaderText
}) => {
    const refRBSheet = useRef();
    const [sheetVisible, setSheetVisible] = useState(visible);
    useEffect(() => {
        if (sheetVisible) {
            refRBSheet.current.open();
        }
    }, [sheetVisible]);

    return (
        <RBSheet
            ref={refRBSheet}
            closeOnPressMask={false}
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
                },
                draggableIcon: {
                    marginTop: 8,
                    backgroundColor: "#CDCFD0",
                    width: 48,
                    height: 5
                },
            }}
            height={218}>
            <View
                style={{
                    height: 195,
                    backgroundColor: colors.whiteColor,
                    width: "100%",
                    paddingHorizontal: 24,
                    paddingTop: 24
                }}>
                <Text style={[{ fontWeight: "700", fontSize: Platform.OS === "android" ? 25 : 25, color: colors.blackTextColor }]}>{customHeaderText ? customHeaderText : "Change profile picture"}</Text>
                <TouchableOpacity
                    style={{
                        flexDirection: "row",
                        height: 50,
                        alignItems: "center",marginTop:10
                    }}
                    onPress={fromGallery}>
                    <Text style={{ fontSize: 16, fontWeight: "400", color: colors.blackTextColor }}>{"From Gallery"}</Text>
                </TouchableOpacity>
                <View style={{ backgroundColor: "rgb(215,222,240)", width: "100%", height: 1 }} />
                <TouchableOpacity
                    style={{
                        flexDirection: "row",
                        height: 50,
                        alignItems: "center",
                    }}
                    onPress={fromCamera}>
                    <Text style={{ fontSize: 16, fontWeight: "400", color: colors.blackTextColor }}>{"Take a photo"}</Text>
                </TouchableOpacity>
                {!DeviceInfo.hasNotch() ?
                    <View style={{ flex: 1, width: "100%", alignItems: "center", justifyContent: "center" }}>
                        <View style={{ width: 135, height: 5, borderRadius: 3, backgroundColor: "rgb(57,57,68)" }} />
                    </View> :
                    <View style={{ flex: 1, width: "100%", alignItems: "center", justifyContent: "center" }}>
                    </View>
                }
            </View>
        </RBSheet>
    );
};

export default LoginOptionsBottomSheet;
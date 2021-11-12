import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import {images} from "../Assets/Images/index"

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
                    marginTop: 25,
                    backgroundColor: "rgb(57,57,68)",
                    width: 91
                },
            }}
            height={229}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: "white",
                    width: "80%",
                    marginTop: 25
                }}>

                <Text
                    style={{
                        fontSize: 24,
                        lineHeight: 27,
                        color: "rgb(39,45,59)",
                        fontWeight: "bold",
                    }}>
                    {customHeaderText?customHeaderText:"Change profile picture"}
                </Text>
                <View style={{ backgroundColor: "rgb(215,222,240)", width: "100%", height: 1, marginTop: 8 }} />
                <TouchableOpacity
                    style={{
                        flexDirection: "row",
                        height: 50,
                        alignItems: "center",
                    }}
                    onPress={fromGallery}
                >
                    <Image style={{ width: 15, height: 15 }} source={images.galleryIcon} resizeMode="contain" />
                    <Text style={{ fontSize: 14, marginLeft: 15, lineHeight: 21 }}>{"From Gallery"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        flexDirection: "row",
                        height: 50,
                        alignItems: "center",
                    }}
                    onPress={fromCamera}
                >
                    <Image style={{ width: 15, height: 15 }} source={images.cameraIcon} resizeMode="contain" />
                    <Text style={{ fontSize: 14, marginLeft: 15, lineHeight: 21 }}>{"Take a photo"}</Text>
                </TouchableOpacity>

            </View>
            <View style={{ width: "100%", alignItems: "center", marginBottom: 11 }}>
                <View style={{ width: 135, height: 5, borderRadius: 3, backgroundColor: "rgb(57,57,68)" }} />
            </View>
        </RBSheet>
    );
};

export default LoginOptionsBottomSheet;
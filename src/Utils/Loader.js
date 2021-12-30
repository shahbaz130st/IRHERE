import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { colors } from "../Themes/colors";

const Loader = (props) => {
    if (props.visible) {
        return (
            <View style={[{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0, backgroundColor: "#80808066", alignItems: "center", justifyContent: "center" }, props.styleLoader]}>
                {props.statusText ?
                    <View style={{ backgroundColor: colors.whiteColor, width: 200, height: 200, borderRadius: 10, alignItems: "center", justifyContent: "center",paddingHorizontal:5 }}>
                        <ActivityIndicator size={"large"} color={colors.primaryColor} />
                        <Text style={{ color: colors.primaryColor, fontSize: 20, fontWeight: "bold",textAlign:"center" }}>{props.statusText}</Text>
                    </View>
                    :
                    <ActivityIndicator size={"large"} color={colors.whiteColor} />
                }
            </View>
        )
    }
    else {
        return null;
    }
}
export default Loader;
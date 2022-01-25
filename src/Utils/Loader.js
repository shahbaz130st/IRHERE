import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { colors } from "../Themes/colors";
import ProgressCircle from 'react-native-progress-circle'


const Loader = (props) => {
    if (props.visible) {
        return (
            <View style={[{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0, backgroundColor: "#80808066", alignItems: "center", justifyContent: "center" }, props.styleLoader]}>
                {props.statusText ?
                    <View style={{ backgroundColor: colors.whiteColor, width: 237, height: 221, borderRadius: 15, alignItems: "center", justifyContent: "center", paddingHorizontal: 5 }}>
                        <ProgressCircle
                            percent={props.progress}
                            radius={70}
                            borderWidth={3}
                            color="#5C81E4"
                            shadowColor={colors.whiteColor}
                            bgColor={colors.whiteColor}
                        >
                            <Text style={{ fontSize: 15,color:"#5C81E4",fontWeight:"500",textAlign:"center" }}>{props.statusText}</Text>
                        </ProgressCircle>
                    </View>
                    // <View style={{ backgroundColor: colors.whiteColor, width: 200, height: 200, borderRadius: 10, alignItems: "center", justifyContent: "center",paddingHorizontal:5 }}>
                    //     <ActivityIndicator size={"large"} color={colors.primaryColor} />
                    //     <Text style={{ color: colors.primaryColor, fontSize: 20, fontWeight: "bold",textAlign:"center" }}>{props.statusText}</Text>
                    // </View>
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
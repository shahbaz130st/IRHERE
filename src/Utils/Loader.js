import React from "react";
import {View,ActivityIndicator} from "react-native";
import {colors} from "../Themes/colors";

const Loader=(props)=>{
    if(props.visible){
        return(
            <View style={{position:"absolute",top:0,bottom:0,right:0,left:0,backgroundColor:"#80808066",alignItems:"center",justifyContent:"center"}}>
                <ActivityIndicator size={"large"} color={colors.whiteColor}/>
            </View>
        )
    }
    else{
        return null;
    }
}
export default Loader;
import React from "react";
import { View, StyleSheet, Text,Image } from "react-native";
import { colors } from "../Themes/colors";
import { phoneScreen } from "../Themes/phoneScreen";
import commonStyles from "../Themes/commonStyles";
import Button from "../Component/Button";
import { useDispatch,useSelector } from "react-redux";
import {images} from "../Assets/Images/index";
const Welcom = (props) => {
    const state= useSelector(state=>state)
    return (
        <View style={styles.mainView}>
            <View style={[styles.innerViewStyle1,{backgroundColor:state.themeChangeReducer.primaryColor}]}>
                <Image source={images.logo} style={styles.imageStyle}/>
            </View>
            <View style={[styles.innerViewStyle2,{backgroundColor:state.themeChangeReducer.secondaryColor}]}>
                <Text style={styles.headingStyle}>{"Welcome !"}</Text>
                <Text style={styles.bodyStyle}><Text style={[styles.bodyStyle,{color:colors.headingTextColor}]}>{"IRHere"}</Text>{" is NOT A TRACKING System, it is system that allows the User to verify their current location at any time, and ONLY records that specific moment in time. Only the User can send or share or delete that data, or alternately it remains on the IRHere system for as long as the User wants, or until IRHere."}</Text>
               <View style={{flexDirection:"row",width:"100%",justifyContent:"space-between"}}>
                <Button
                    buttonStyle={[commonStyles.buttonStyle, { width: phoneScreen.width * 40 / 100,marginTop:0,backgroundColor:state.themeChangeReducer.primaryColor },commonStyles.shadowStyle]}
                    textStyle={commonStyles.textStyle}
                    text={"Sign in"}
                    onPress={()=>{props.navigation.navigate("Login")}}
                />
                <Button
                    buttonStyle={[commonStyles.buttonStyle, { width: phoneScreen.width * 40 / 100,backgroundColor:state.themeChangeReducer.secondaryColor,borderColor:state.themeChangeReducer.primaryColor,borderWidth:1,marginTop:0 }]}
                    textStyle={[commonStyles.textStyle,{color:state.themeChangeReducer.primaryColor}]}
                    text={"Sign up"}
                    onPress={()=>{props.navigation.navigate("Register")}}
                />
                 </View>
            </View>
        </View>
    )
}
export default Welcom;

const styles = StyleSheet.create({
    mainView: {
        flex: 1
    },
    innerViewStyle1: {
        height: phoneScreen.height / 2,
        backgroundColor: colors.primaryColor,
        alignItems:"center",
        justifyContent:"center"
    },
    imageStyle:{
        resizeMode:"contain",
        height:"35%",
    },
    innerViewStyle2: {
        height: phoneScreen.height / 2 + 30,
        backgroundColor: colors.secondaryColor,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        padding: 30,
        justifyContent:"space-evenly"
    },
    headingStyle: {
        fontSize: 30,
        fontWeight: "700",
        fontStyle: "normal",
        color: colors.blackTextColor
    },
    bodyStyle: {
        fontSize: 12,
        fontWeight: "400",
        fontStyle: "normal",
        color: colors.bodyTextColor
    }
})
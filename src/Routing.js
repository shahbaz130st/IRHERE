import React, { useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Splash from "./Screens/Splash";
import Welcom from "./Screens/Welcom";
import Register from "./Screens/Register";
import Login from "./Screens/Login";
import ModeSelection from "./Screens/ModeSelection";
import QuarantineWelcom from "./Screens/QuarantineWelcom";
import { phoneScreen } from "./Themes/phoneScreen";

import Home from "./Screens/Home";
import VerifyLocation from "./Screens/VerifyLocation";
import SymptomScreen from "./Screens/SymptomScreen";
import certificateValidation from "./Screens/CertificateValidation";
import HistoryScreen from "./Screens/HistoryScreen";
import NotificationScreen from "./Screens/NotificationScreen";
import SettingScreen from "./Screens/SettingScreen";
import { useSelector } from "react-redux";
import { images } from "./Assets/Images";
import Preference from "react-native-preference";
import {navigationRef} from './Utils/RootNavigation';

const SignInStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

function OnBoardingStack() {
    return (
        <SignInStack.Navigator screenOptions={{ headerShown: false }}>
            <SignInStack.Screen name="Splash" component={Splash} />
            <SignInStack.Screen name="Welcom" component={Welcom} />
            <SignInStack.Screen name="Login" component={Login} />
            <SignInStack.Screen name="Register" component={Register} />
        </SignInStack.Navigator>
    )
}
function HomeScreenStack() {
    return (
        <HomeStack.Navigator screenOptions={{ headerShown: false }}>
            <HomeStack.Screen name="mainHome" component={Home} />
            <HomeStack.Screen name="verifyLocation" component={VerifyLocation} />
            <HomeStack.Screen name="certificateValidation" component={certificateValidation} />
        </HomeStack.Navigator>
    )
}

function TabGroup() {
    const state = useSelector(state => state)
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: state.themeChangeReducer.secondaryColor,
            tabBarInactiveTintColor: state.themeChangeReducer.secondaryColor,
            tabBarActiveBackgroundColor: "#98B6F1",
            tabBarStyle: { backgroundColor: state.themeChangeReducer.primaryColor, height: phoneScreen.height * 12 / 100, borderTopColor: state.themeChangeReducer.primaryColor, paddingHorizontal: 30 },
            tabBarItemStyle: { height: phoneScreen.height * 9 / 100, borderRadius: 10, paddingVertical: 7 },
            tabBarLabelStyle: { fontSize: 8, fontWeight: "500" },

        }} initialRouteName={"Home"}>
             <Tab.Screen name="Setting" component={SettingScreen}
                options={{
                    tabBarLabel: 'Setting',
                    tabBarIcon: () => (
                        <Image style={style.iconStyle} source={images.settingIcon} />
                    )
                }} />
           {/* {Preference.get("mode") === "general" ?
                <Tab.Screen name="Contacts" component={Home} options={{
                    tabBarLabel: 'Contacts',
                    tabBarIcon: () => (
                        <Image style={style.iconStyle} source={images.contactIcon} />
                    )

                }}
                /> :
                <Tab.Screen name="Help" component={Home} options={{
                    tabBarLabel: 'Help',
                    tabBarIcon: () => (
                        <Image style={style.iconStyle} source={images.helpIcon} />
                    )
                }} />
            } */}
            <Tab.Screen name="Home" component={HomeScreenStack}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: () => (
                        <Image style={style.iconStyle} source={images.homeIcon} />
                    )
                }}
            />
            {/* <Tab.Screen name="History" component={HistoryScreen}
                options={{
                    tabBarLabel: 'History',
                    tabBarIcon: () => (
                        <Image style={style.iconStyle} source={images.historyIcon} />
                    )
                }}
            />
            <Tab.Screen name="Notifications" component={NotificationScreen}
                options={{
                    tabBarLabel: 'Notifications',
                    tabBarIcon: () => (
                        <Image style={style.iconStyle} source={images.notificationIcon} />
                    )
                }} /> */}
        </Tab.Navigator>
    )
}
const Routing = () => {
    return (
        <NavigationContainer ref={navigationRef}>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
                <RootStack.Screen name="OnBoarding" component={OnBoardingStack} />
                <RootStack.Screen name="TabGroup" component={TabGroup} />
                <RootStack.Screen name="SymptomScreen" component={SymptomScreen} />
                <SignInStack.Screen name="ModeSelection" component={ModeSelection} />
                <SignInStack.Screen name="QuarantineWelcom" component={QuarantineWelcom} />
            </RootStack.Navigator>
        </NavigationContainer>
    )
}
export default Routing;

const style = StyleSheet.create({
    iconStyle: { height: 20, width: 20 }
})
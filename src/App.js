import React, { useEffect, useRef } from "react";
import { View, StatusBar, LogBox } from "react-native";
import 'react-native-gesture-handler';
import Routing from "./Routing";
import { Provider } from "react-redux";
import { store, persistor } from "./Store";
import { PersistGate } from 'redux-persist/integration/react';
import messaging from '@react-native-firebase/messaging';
import NotificationPopup from 'react-native-push-notification-popup';
import Preference from 'react-native-preference';
import * as RootNavigation from './Utils/RootNavigation';
import Toast, { BaseToast } from 'react-native-toast-message';
import { colors } from "./Themes/colors";
import { images } from "./Assets/Images/index";
const App = () => {
    LogBox.ignoreAllLogs();
    const popupRef = useRef(null);
    useEffect(async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
            onAppBootstrap()
            createNotificationListeners()
        }

    })
    const toastConfig = {
        success: ({ text1, ...rest }) => (
            <BaseToast
                {...rest}
                style={{ borderLeftColor: 'pink' }}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                text1Style={{
                    fontSize: 15,
                    fontWeight: 'bold'
                }}
                text2Style={{

                    fontSize: 25,
                    fontWeight: 'bold'
                }}
                text1={'TIME UPDATE'}
                text2={"sdfgsf"}
            />
        ),
        error: ({ text1, text2, ...rest }) => (
            <BaseToast
                {...rest}
                style={{ borderLeftColor: "red" }}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                text1Style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: "red"

                }}
                text2Style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    color: colors.placeholderColor
                }}
                text1={text1}
                text2={text2}
                text2NumberOfLines={2}
            />
        )

    };
    const onAppBootstrap = async () => {
        // Register the device with FCM
        // await messaging().registerDeviceForRemoteMessages();
        // Get the token
        const token = await messaging().getToken();
        // Save the token
        console.log("fcmToken", "_---------------------------------->" + token);
        Preference.set("fcmToken", token)
        // await AsyncStorage.setItem('fcmToken', token);
        //await postToApi('/users/1234/tokens', { token });
    }
    const createNotificationListeners = async () => {
        messaging().onMessage(async remoteMessage => {
            showNotification("Verify your location", "You have received a request to verify your location. You have 20 minutes to respond.");
        });

        messaging().setBackgroundMessageHandler(
            async remoteMessage => {
                console.log("setBackgroundMessageHandler")
            },
        );
        messaging()
            .getInitialNotification()
            .then(async remoteMessage => {
                if (remoteMessage) {
                    console.log("getInitialNotification")
                    onNotificationRecieve()
                }
            });
        messaging().onNotificationOpenedApp(
            async remoteMessage => {
                if (remoteMessage) {
                    console.log("onNotificationOpenedApp")
                    onNotificationRecieve()
                }
            },
        );
    }
    const showNotification = (title, body) => {
        if (popupRef) {
            popupRef?.current?.show({
                onPress: () => {
                    onNotificationRecieve()
                    // TODO
                },
                appIconSource: images.ic_launcher,
                appTitle: 'IRHERE',
                timeText: 'Now',
                title: title,
                body: body,
                // slideOutTime: 5000
            });
        }
    }
    const onNotificationRecieve = () => {
        console.log("onNotificationRecieve", /* RootNavigation, */Preference.get("isLogin"))
        if (Preference.get("isLogin") === "done") {
            RootNavigation.navigate(/* 'Home', { screen: */ 'verifyLocation'/*  } */);
        }
        else {
            RootNavigation.navigate("Login");
        }
        // if (navigationRef) {
        //     alert(":gcgfc")
        //     navigationRef.current?.navigate('verifyLocation');
        //     //  navigationRef?.current.navigate();
        //     // navigationRef.dispatch(
        //     //     CommonActions.navigate({
        //     //         name: 'TabGroup',
        //     //         // params: {
        //     //         //     from: "fp",
        //     //         //     resetToken: data.resetToken,
        //     //         // }
        //     //     })
        //     // );
        //   }

        // if (navigatorRef) {
        //     navigatorRef.dispatch(
        //         CommonActions.navigate({
        //             name: 'Home',
        //             // params: {
        //             //     from: "fp",
        //             //     resetToken: data.resetToken,
        //             // }
        //         })
        //     );
        // }
        /*  if (data?.type === "reset" && data?.resetToken) {
             if (this.navigator) {
                 this.navigator.dispatch(
                     NavigationActions.navigate({
                         routeName: 'CheckEmailScreen',
                         params: {
                             from: "fp",
                             resetToken: data.resetToken,
                         }
                     })
                 );
             }
 
         } */
    }
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <View style={{ flex: 1 }}>
                    <StatusBar
                        translucent={true}
                        hidden={true}
                    />
                    <Routing />
                    <NotificationPopup
                        ref={popupRef}
                        style={{ zIndex: 99 }}
                    />
                    <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
                </View>
            </PersistGate>
        </Provider>
    )
}

export default App;
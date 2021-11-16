import React, { useEffect, useRef } from "react";
import { View, StatusBar, LogBox,AppState } from "react-native";
import 'react-native-gesture-handler';
import Routing from "./Routing";
import { Provider } from "react-redux";
import { store, persistor } from "./Store";
import { PersistGate } from 'redux-persist/integration/react';
import messaging from '@react-native-firebase/messaging';
import NotificationPopup from 'react-native-push-notification-popup';
import Preference from 'react-native-preference';
import * as RootNavigation from './Utils/RootNavigation';
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
            // const { notification } = remoteMessage;
            // console.log(remoteMessage)
            showNotification("Verify your location", "You have received a request to verify your location. You have 20 minutes to respond."/* notification.title, notification.body */);
            onNotificationRecieve()
        });
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            const { notification } = remoteMessage;
            console.log(remoteMessage)

            // showNotification("Verify your location","You have received a request to verify your location. You have 20 minutes to respond.");
            onNotificationRecieve()

            // console.log("GotNotification", "Title: " + JSON.stringify(title), "Body: " + body, "data: " + JSON.stringify(data))
            // showNotification(notification.title, notification.body);
        });
        messaging().getInitialNotification().then(async remoteMessage => {

            if (remoteMessage) {
                const { notification } = remoteMessage
                // const { title } = notification
                onNotificationRecieve()
            }
        });
    }
    const showNotification = (title, body) => {
        if (popupRef) {
            popupRef.current.show({
                onPress: () => {
                    // TODO
                },
                // appIconSource: images.logo,
                appTitle: 'IRHERE',
                timeText: 'Now',
                title: title,
                body: body,
                slideOutTime: 5000
            });
        }
    }
    const onNotificationRecieve = () => {
        console.log("onNotificationRecieve", /* RootNavigation, */Preference.get("isLogin"))
        if (Preference.get("isLogin") === "done") {
            RootNavigation.navigate('Home', { screen: 'verifyLocation' });
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
                </View>
            </PersistGate>
        </Provider>
    )
}

export default App;
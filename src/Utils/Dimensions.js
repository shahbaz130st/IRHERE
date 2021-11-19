// import { Dimensions, Platform, StatusBar } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { StatusBar } from "react-native";


// const X_WIDTH = 375;
// const X_HEIGHT = 812;

// const XSMAX_WIDTH = 414;
// const XSMAX_HEIGHT = 896;

// const { height, width } = Dimensions.get('window');

// export const isIPhoneX = () => Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS
//     ? width === X_WIDTH && height === X_HEIGHT || width === XSMAX_WIDTH && height === XSMAX_HEIGHT
//     : false;

// export const StatusBarHeight = Platform.select({
//     ios: isIPhoneX() ? 44 : 20,
//     android: StatusBar.currentHeight,
//     default: 0
// })
export const isIPhoneX = DeviceInfo.hasNotch();

export const StatusBarHeight = Platform.select({
    ios: DeviceInfo.hasNotch() ? 30 : 20,
    android: StatusBar.currentHeight,
    default: 0
})
export const HeaderHeight = Platform.select({
    ios: 84 + StatusBarHeight,
    android: 84 + StatusBarHeight,
    default: 84 + StatusBarHeight,
})
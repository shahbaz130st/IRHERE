import {Alert} from "react-native";
import _ from 'lodash';
import Toast from 'react-native-toast-message'
export const AlertComponent = (props) => {
  Toast.show({
    type:  props?.type?props.type:"success",
    text1: props?.title?props.title:"Hello",
    text2: props?.msg&&props.msg,
    position: 'top',
    autoHide: false,
    // autoHide: true,
    // visibilityTime: props?.visibilityTime&&props.visibilityTime,
  });
} /* const AlertComponent = (props) =>
    Alert.alert(
      props?.title?props.title:"",
      props?.msg&&props.msg,
      [
        { text: "OK", onPress: props?.onOkPress&&props.onOkPress }
      ]
    ); */
import {Alert} from "react-native";
import _ from 'lodash';

export const AlertComponent = (props) =>
    Alert.alert(
      props?.title?props.title:"",
      props?.msg&&props.msg,
      [
        { text: "OK", onPress: props?.onOkPress&&props.onOkPress }
      ]
    );
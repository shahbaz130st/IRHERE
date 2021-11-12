import React from 'react'
import SwitchToggle from 'react-native-switch-toggle'
import { Text } from "react-native"

const Switch = (props) => {
  const getButtonText = () => {
    return props.value ? "PM" : "AM";
  }

  const getRightText = () => {
    return props.value ? "" : "PM";
  }

  const getLeftText = () => {
    return props.value ? "AM" : "";
  }
  return (
    <SwitchToggle
      switchOn={props.value}
      containerStyle={{
        width: 37,
        height: 16,
        backgroundColor: "#E8E8E8",
        borderColor: "rgb(215,222,240)",
        borderWidth: 1,
      }}
      buttonStyle={{
        alignItems: "center",
        justifyContent: "center",
        position: "absolute"
      }}
      rightContainerStyle={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
      }}
      leftContainerStyle={{
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start"
      }}
      buttonTextStyle={{ fontSize: 12,color:"white" }}
      textRightStyle={{ fontSize: 12,color:"black" }}
      textLeftStyle={{ fontSize: 12,color:"black"}}
      backgroundColorOn={"rgb(245,247,252)"}
      backgroundColorOff={"rgb(245,247,252)"}
      duration={100}
      circleStyle={{
        width: 15,
        height: 16,
        backgroundColor: "#E8E8E8",
      }}
      circleColorOn="#ACACAC"
      circleColorOff="#ACACAC"
      onPress={() => props.onChange(!props.value)}
      // buttonText={getButtonText()}
      // backTextRight={getRightText()}
      // backTextLeft={getLeftText()}
    />
  )
}

export default Switch;

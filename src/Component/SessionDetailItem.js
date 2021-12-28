import React from "react";
import { View, Text, Image } from "react-native";
import _ from "lodash";
import { height } from "./slider";
import { colors } from "../Themes/colors";
export default function SessionDetailItem(props) {
  return (
    <View
      style={[
        { height: 44, width: "100%" },
        props.containerStyle,
      ]}
    >
      <View style={props.labelContainerStyle}>
      <Text
        style={{
          color: colors.secondaryColor,
          fontSize: 14,
          lineHeight: 24,
          fontWeight: "400"
        }}
      >
        {props.label}
      </Text>
      </View>
      <View style={props.valueContainerStyle}>
        <Text
        numberOfLines={props.numberOfLines}
          style={[
            {
              color: colors.secondaryColor,
              fontWeight: "700"
            },
            props.valueStyle,
          ]}
        >
          {props.value}
        </Text>
        {!_.isNil(props.label2) && (
          <Text style={props.label2Style}>{props.label2}</Text>
        )}
      </View>
    </View>
  );
}

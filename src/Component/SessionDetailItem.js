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
      <Text
        style={{
          color: colors.secondaryColor,
          fontSize: 14,
          lineHeight: 24,
          fontWeight: "700"
        }}
      >
        {props.label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Text
          style={[
            {
              color: colors.secondaryColor,
              fontSize: 12,
              fontWeight: "400"
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

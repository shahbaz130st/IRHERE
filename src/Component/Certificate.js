import React from "react";
import { Text, View, Image, FlatList, StyleSheet } from "react-native";
import _ from "lodash";
import { colors } from "../Themes/colors";
import { images } from "../Assets/Images/index";
import moment from "moment";
const Certificate = (props) => {

    return (
        <View style={props.outerViewStyle}>
            <View style={props.headerViewStyle}>
                <Text style={props.headingTextStyle}>{props.headingText}</Text>
                <Image style={props.headingImageStyle} source={props.headingImage} />
            </View>
            {
                !_.isNil(props.list) ?
                    <View style={props.bodyViewStyle}>
                        {
                            props.listOfItems.length > 0 ?
                                <FlatList
                                    numColumns={1}
                                    data={props.listOfItems}
                                    keyExtractor={(item, index) => {
                                        return index.toString();
                                    }}
                                    extraData={{ list: props.listOfItems }}
                                    showsVerticalScrollIndicator={false}
                                    removeClippedSubviews={false}
                                    style={{ flex: 1, width: "100%" }}
                                    renderItem={({ item, index }) => {
                                        var now = moment(new Date()); //todays date
                                        var end = moment(item.date); // another date
                                        var duration = moment.duration(now.diff(end));
                                        var days = duration.asDays();
                                        var hours = duration.asHours()
                                        console.log(days, hours)
                                        return (
                                            <View style={{ flexDirection: "row", paddingVertical: 10 }}>
                                                <View style={{ width: "33%", alignItems: "center", justifyContent: "center" }}>
                                                    <Text style={{ fontSize: 9, fontWeight: "500" }}>
                                                        {item.date}
                                                    </Text>
                                                </View>
                                                <View style={{ width: "34%", alignItems: "center", justifyContent: "center" }}>
                                                    <Text style={{ fontSize: 9, fontWeight: "500" }} numberOfLines={1}>
                                                        {item.address}
                                                    </Text>
                                                </View>
                                                <View style={{ width: "33%", alignItems: "center", justifyContent: "center", flexDirection: "row" }}>
                                                    <Text style={{ fontSize: 7, fontWeight: "500", color: colors.placeholderColor }}>{Math.round(hours) < 24 ? Math.round(hours) + " hrs ago" : Math.round(days) + " days ago"}</Text>
                                                    <View style={[styles.headingImageStyle1, { backgroundColor: item.status === "true" ? "green" : "#FF0000" }]}>
                                                        <Image style={{ height: 4, width: 8, tintColor: "white", resizeMode: "contain" }} source={item.status === "true" ? images.tickIcon : images.crossIcon} />
                                                    </View>

                                                </View>
                                            </View>
                                        )
                                    }}
                                /> :
                                <View style={props.bodyViewStyle, { alignItems: "center" }}>
                                    <Text style={props.bodyTextStyle}>{"No certificate created yet"}</Text>
                                </View>
                        }

                    </View> :
                    <View style={[props.bodyViewStyle, { flexDirection: "row",alignItems:"center" }]}>
                        <Text style={[props.bodyTextStyle,]}>{props.bodyText}</Text>
                        <View style={{ justifyContent:"flex-end"}}>
                            <Image source={{ uri: `data:image/gif;base64,${props.bodyQr}` }} style={{ height: 46, width: 46 }} />
                        </View>

                    </View>
            }
        </View>
    )

}
export default Certificate;

const styles = StyleSheet.create(
    {
        headingImageStyle: {
            width: 8,
            height: 8,
            resizeMode: "contain",
            marginLeft: 5
        },
        headingImageStyle1: {
            width: 10,
            height: 10,
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 5
        }
    }
)
import React, { useRef, useEffect } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { colors } from "../Themes/colors";
import { phoneScreen } from '../Themes/phoneScreen';
import _ from "lodash";
import { Platform } from 'react-native';
import constant from "../Utils/ApiConstants";


const MapInput = (props) => {

    return (
        <GooglePlacesAutocomplete
            autoFocus={false}
            placeholder={props.placeholder}
            minLength={2} // minimum length of text to search
            returnKeyType={'search'} // Can be left out for default return key 
            listViewDisplayed={true}    // true/false/undefined
            fetchDetails={true}
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                props.notifyChange(details.geometry.location,details)
            }
            }
            onFail={error => console.log(error)}

            query={{
                key: Platform.OS==="ios"? constant.ios_map_key:constant.android_map_key /* 'AIzaSyD6ClGJNjuVbHUZWgf2K4gAcrtTX3T99iU' */,
                language: 'en'
            }}

            nearbyPlacesAPI='GooglePlacesSearch'
            debounce={300}
            styles={{
                container: [{
                    height: "75%", alignItems: "center", marginTop: 15,
                    paddingHorizontal: 20
                }, props.containerStyle],
                textInputContainer: [
                    {
                        flexDirection: 'row',
                        width: "100%",
                        backgroundColor: colors.whiteColor,
                        borderRadius: phoneScreen.height * 0.5 / 100
                    }, props.inputFieldStyle]
                ,
                textInput: [{
                    backgroundColor: colors.whiteColor,
                    height: Platform.OS === "android" ? phoneScreen.height * 8 / 100 : phoneScreen.height * 6 / 100,
                    color: colors.greyColor
                }, props.inputStyle]
            }}
            textInputProps={{ placeholderTextColor: colors.placeholderColor }}
            renderLeftButton={props.renderLeftButton}
            renderRightButton={props.renderRightButton}
        />
    );
}
export default MapInput;
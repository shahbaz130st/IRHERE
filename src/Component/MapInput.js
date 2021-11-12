import React,{useRef,useEffect} from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { colors } from "../Themes/colors";
import { phoneScreen } from '../Themes/phoneScreen';
import _ from "lodash";

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
                props.notifyChange(details.geometry.location)
            }
            }
            query={{
                key: 'AIzaSyBosJOS3Vh5CqFhPW58AVdZ0AlZ_eWBE-I',
                language: 'en'
            }}

            nearbyPlacesAPI='GooglePlacesSearch'
            debounce={300}
            styles={{
                container: {
                    height: "75%", alignItems: "center", marginTop: 15
                },
                textInputContainer: {
                    flexDirection: 'row',
                    width: "100%",
                    borderColor: "#8B97A8",
                    borderWidth: 0.2,
                    backgroundColor: colors.inputField,
                    borderRadius: phoneScreen.height * 0.5 / 100,
                },
                textInput: {
                    backgroundColor: colors.inputField,
                    height: Platform.OS === "android" ? phoneScreen.height * 7 / 100 : phoneScreen.height * 6 / 100,
                    color: colors.blackTextColor
                }
            }}
            textInputProps={{ placeholderTextColor: colors.placeholderColor }}
            renderLeftButton={props.renderLeftButton}
            renderRightButton={props.renderRightButton}
        />
    );
}
export default MapInput;
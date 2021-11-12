import React from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
const MyMapView = (props) => {
    return (
        <MapView
            style={props.MapViewStyle}
            region={props.region}
        // showsUserLocation={true}
        // onRegionChange={(reg) => props.onRegionChange(reg)}
        >
            <Marker
                coordinate={props.currentLocation} />
            { props.destinationLocation["latitude"] ?
                <Marker
                    coordinate={props.destinationLocation} /> : null}
            { props.destinationLocation["latitude"] ? <MapViewDirections
                origin={props.currentLocation}
                destination={props.destinationLocation}
                apikey={'AIzaSyBosJOS3Vh5CqFhPW58AVdZ0AlZ_eWBE-I'} // insert your API Key here
                strokeWidth={4}
                strokeColor="#111111"
            /> : null}
        </MapView>
    )
}
export default MyMapView;
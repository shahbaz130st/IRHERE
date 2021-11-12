import React,{ Component } from 'react';
import { View, Image } from 'react-native';
 
import DocumentScanner from 'react-native-document-scanner';
 
export default class YourComponent extends Component {
  render() {
    return (
      <View>
        <DocumentScanner
          useBase64
          onPictureTaken={data => this.setState({
            image: data.croppedImage,
            initialImage: data.initialImage,
            rectangleCoordinates: data.rectangleCoordinates,
          })}
          overlayColor="rgba(255,130,0, 0.7)"
          enableTorch={false}
          brightness={0.3}
          saturation={1}
          contrast={1.1}
          quality={0.5}
          onRectangleDetect={({ stableCounter, lastDetectionType }) => this.setState({ stableCounter, lastDetectionType })}
          detectionCountBeforeCapture={5}
          detectionRefreshRateInMS={50}
        />
        {/* <Image source={{ uri: `data:image/jpeg;base64,${this.state.image}`}} resizeMode="contain" /> */}
      </View>
    );
  }
}
// import React, { useRef, useState, useEffect } from "react"
// import { View, StyleSheet, Text, TouchableOpacity, Image, Platform, PermissionsAndroid } from "react-native"
// // import Permissions from 'react-native-permissions';
// import PDFScanner from "@woonivers/react-native-document-scanner"

// export default function App() {
//   const pdfScannerElement = useRef(null)
//   const [data, setData] = useState({})
//   const [allowed, setAllowed] = useState(false)

//   useEffect(() => {
//     async function requestCamera() {
//       const result = await PermissionsAndroid.request(Platform.OS === "android" ? "android.permission.CAMERA" : "ios.permission.CAMERA")
//       if (result === "granted") setAllowed(true)
//     }
//     requestCamera()
//   }, [])

//   function handleOnPressRetry() {
//     setData({})
//   }
//   function handleOnPress() {
//     pdfScannerElement.current.capture()
//   }
//   if (!allowed) {
//     console.log("You must accept camera permission")
//     return (<View style={styles.permissions}>
//       <Text>You must accept camera permission</Text>
//     </View>)
//   }
//   if (data.croppedImage) {
//     console.log("data", data)
//     return (
//       <React.Fragment>
//         <Image source={{ uri: data.croppedImage }} style={styles.preview} />
//         <TouchableOpacity onPress={handleOnPressRetry} style={styles.button}>
//           <Text style={styles.buttonText}>Retry</Text>
//         </TouchableOpacity>
//       </React.Fragment>
//     )
//   }
//   return (
//     <React.Fragment>
//       <PDFScanner
//         ref={pdfScannerElement}
//         style={styles.scanner}
//         onPictureTaken={setData}
//         overlayColor="rgba(255,130,0, 0.7)"
//         enableTorch={false}
//         quality={0.5}
//         detectionCountBeforeCapture={5}
//         detectionRefreshRateInMS={50}
//       />
//       <TouchableOpacity onPress={handleOnPress} style={styles.button}>
//         <Text style={styles.buttonText}>Take picture</Text>
//       </TouchableOpacity>
//     </React.Fragment>
//   )
// }

// const styles = StyleSheet.create({
//   scanner: {
//     flex: 1,
//     aspectRatio: undefined
//   },
//   button: {
//     alignSelf: "center",
//     position: "absolute",
//     bottom: 32,
//   },
//   buttonText: {
//     backgroundColor: "rgba(245, 252, 255, 0.7)",
//     fontSize: 32,
//   },
//   preview: {
//     flex: 1,
//     width: "100%",
//     resizeMode: "cover",
//   },
//   permissions: {
//     flex:1,
//     justifyContent: "center",
//     alignItems: "center"
//   }
// })
// import React, {Component} from 'react';
// import {
//   View,
//   Text,
//   TouchableNativeFeedback,
//   Image,
// } from 'react-native';

// import {RNDocScanner} from 'rn-scanner-android';

// export default class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       foto: null,
//     };
//   }

//   onPressScan = async () => {
//     try {
//       const image = await RNDocScanner.getDocumentCrop(true);
//       this.setState({foto: image});
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   render() {
//     return (
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <Text style={{marginBottom: 20}}>Oritec Document Scanner</Text>
//         <TouchableNativeFeedback
//           onPress={this.onPressScan}
//           background={TouchableNativeFeedback.SelectableBackground()}>
//           <View
//             style={{
//               width: 250,
//               backgroundColor: '#F7B44C',
//               flexDirection: 'row',
//               justifyContent: 'center',
//               elevation: 3,
//             }}>
//             <Text style={{margin: 10, color: 'white', fontSize: 16}}>Scan</Text>
//           </View>
//         </TouchableNativeFeedback>
//         <View style={{height: 250, marginTop: 50}}>
//           {this.state.foto != null && (
//             <Image
//               source={{uri: this.state.foto}}
//               style={{width: 250, height: 250}}
//             />
//           )}
//         </View>
//       </View>
//     );
//   }
// }
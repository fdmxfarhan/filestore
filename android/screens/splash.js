import React, { useEffect, useState } from 'react';
import {
    Image,
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import colors from '../components/colors';
const {saveData, readData} = require('../config/save');

const requestReadStoragePermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // console.log("You can use the camera");
        } else {
            console.log("Read_Storage permission denied");
        }
    } catch (err) {
      console.warn(err);
    }
};
const requestWriteStoragePermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // console.log("You can use the camera");
        } else {
            console.log("Write_Storage permission denied");
        }
    } catch (err) {
      console.warn(err);
    }
};


const Splash = (props) => {    
    useEffect(() => {
        requestReadStoragePermission();
        requestWriteStoragePermission();
        setTimeout(() => {
            readData().then((data) => {
                if(data != null){
                    props.navigation.navigate('Home');
                }
                else {
                    // props.navigation.navigate('Login');
                    props.navigation.navigate('Intro');
                }
            });
        }, 1000);
    })
    return(
        <View style={styles.container}>
            <StatusBar backgroundColor={colors.darkBackground}/>
            <Image 
                source={require('../assets/logo.png')}
                style={styles.logo}
            />
            <Text style={styles.title}>فایل استور</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.darkBackground,
        alignContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 150,
        marginTop: 200,
    },
    title: {
        fontFamily: 'iransans',
        fontSize: 22,
        color: colors.lightBackground,
        marginTop: 20,
        fontWeight: 'bold',

    },
});

export default Splash;
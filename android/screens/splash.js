import React, { useEffect, useState } from 'react';
import {
    Image,
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

const Splash = (props) => {    
    useEffect(() => {
        setTimeout(() => {
            readData().then((data) => {
                if(data != null){
                    props.navigation.navigate('Home');
                }
                else {
                    props.navigation.navigate('Login');
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
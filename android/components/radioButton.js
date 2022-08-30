import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import colors from '../components/colors';
import Icon from 'react-native-vector-icons/FontAwesome';

const RadioButton = ({navigation, setFunc, val, text}) => {
    if(val){
        return(
            <TouchableOpacity style={styles.containerActive} onPress={() => setFunc(!val)}>
                <Text style={styles.textActive}>{text}</Text>
            </TouchableOpacity>
        )
    }
    else{
        return(
            <TouchableOpacity style={styles.container} onPress={() => setFunc(!val)}>
                <Text style={styles.text}>{text}</Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    containerActive: {
        backgroundColor: colors.blue,
        borderRadius: 10, 
        borderColor: colors.blue,
        borderWidth: 1,
        marginBottom: 5,
    },
    textActive: {
        color: colors.white,
        fontFamily: 'iransans',
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    container: {
        backgroundColor: 'transparent',
        borderRadius: 10, 
        borderColor: colors.blue,
        borderWidth: 1,
        marginBottom: 5,
    },
    text: {
        color: colors.blue,
        fontFamily: 'iransans',
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
});

export default RadioButton;
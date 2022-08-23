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

const TextAreaInput = ({navigation, title1, set}) => {
    return(
        <View style={styles.container}>
            <Text style={styles.oneSideInputTitle}>{title1}</Text>
            <TextInput 
                style={[styles.oneSideInputText]}
                keyboardType={'default'}
                onSubmitEditing={() => {}}
                onChange={(text) => {set(text.nativeEvent.text)}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        width: '90%',
        marginHorizontal: '5%',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        alignContent: 'center',
        display: 'flex',
    },
    oneSideInputTitle: {
        flex: 1,
        fontFamily: 'iransans',
        fontSize: 15,
        paddingTop: 8,
        textAlign: 'left',
        paddingLeft: 10,
    },
    oneSideInputText: {
        backgroundColor: colors.white,
        flex: 5,
        fontFamily: 'iransans',
        fontSize: 15,
        paddingHorizontal: 7,
        paddingVertical: 6,
        borderRadius: 10,
        textAlign: 'right',
    },
    
});

export default TextAreaInput;
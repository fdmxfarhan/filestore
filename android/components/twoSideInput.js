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

const TwoSideInput = ({navigation, title1, title2, set1, set2}) => {
    return(
        <View style={styles.twoSideInput}>
            <View style={styles.twoSideInputPart}>
                <Text style={styles.twoSideInputTitle}>{title1}</Text>
                <TextInput 
                    style={[styles.twoSideInputText]}
                    keyboardType={'default'}
                    onSubmitEditing={() => {}}
                    onChange={(text) => {set1(text.nativeEvent.text)}}/>
            </View>
            <View style={styles.twoSideInputMiddlePart}></View>
            <View style={styles.twoSideInputPart}>
                <Text style={styles.twoSideInputTitle}>{title2}</Text>
                <TextInput 
                    style={[styles.twoSideInputText]}
                    keyboardType={'default'}
                    onSubmitEditing={() => {}}
                    onChange={(text) => {set2(text.nativeEvent.text)}}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    twoSideInput: {
        marginTop: 20,
        width: '90%',
        marginHorizontal: '5%',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        alignContent: 'center',
        display: 'flex',
    },
    twoSideInputPart: {
        flex: 10,
        display: 'flex',
        flexDirection: 'row-reverse',
    },
    twoSideInputTitle: {
        flex: 1,
        fontFamily: 'iransans',
        fontSize: 15,
        paddingTop: 8,
        textAlign: 'left',
        paddingLeft: 10,
    },
    twoSideInputText: {
        backgroundColor: colors.white,
        flex: 2,
        fontFamily: 'iransans',
        fontSize: 15,
        paddingHorizontal: 7,
        paddingVertical: 6,
        borderRadius: 10,
        textAlign: 'right',
    },
    
});

export default TwoSideInput;
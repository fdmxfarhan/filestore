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
import SelectDropdown from 'react-native-select-dropdown'

const TwoSideSelectInput = ({navigation, title1, title2, options1, options2, set1, set2}) => {
    return(
        <View style={styles.twoSideInput}>
            <View style={styles.twoSideInputPart}>
                <Text style={styles.twoSideInputTitle}>{title1}</Text>
                <SelectDropdown
                    onSelect={(selectedItem, index) => {set1(selectedItem)}}
                    buttonStyle={styles.twoSideInputDropDown}
                    buttonTextStyle={styles.twoSideInputDropDownText}
                    defaultButtonText={'انتخاب'}
                    data={options1}/>
                {/* <TextInput 
                    style={[styles.twoSideInputText]}
                    keyboardType={'default'}
                    onSubmitEditing={() => {}}
                    onChange={(text) => {
                        if(text.nativeEvent.text == '');
                    }}/> */}
            </View>
            <View style={styles.twoSideInputMiddlePart}></View>
            <View style={styles.twoSideInputPart}>
                <Text style={styles.twoSideInputTitle}>{title2}</Text>
                <SelectDropdown
                    onSelect={(selectedItem, index) => {set2(selectedItem)}}
                    buttonStyle={styles.twoSideInputDropDown}
                    buttonTextStyle={styles.twoSideInputDropDownText}
                    defaultButtonText={'انتخاب'}
                    data={options2}/>
                {/* <TextInput 
                    style={[styles.twoSideInputText]}
                    keyboardType={'default'}
                    onSubmitEditing={() => {}}
                    onChange={(text) => {
                        if(text.nativeEvent.text == '');
                    }}/> */}
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
    twoSideInputDropDown: {
        backgroundColor: colors.white,
        flex: 2,
        borderRadius: 10,
        padding: 0,
        height: 40,
    },
    twoSideInputDropDownText: {
        fontFamily: 'iransans',
        fontSize: 13,
        paddingHorizontal: 7,
        paddingVertical: 0,
        textAlign: 'right',
        margin: 0,
        
    },
});

export default TwoSideSelectInput;
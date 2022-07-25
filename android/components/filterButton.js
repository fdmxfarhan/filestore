import React, { useEffect, useState } from 'react';
import {
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

const FilterButton = ({navigation, enable, onpress, text}) => {
    if(enable) return(
        <TouchableOpacity 
            onPress={onpress}>
            <Text style={[styles.filterItem, {backgroundColor: colors.blue, color: colors.white}]}>{text}</Text>
        </TouchableOpacity>
    )
    else return(
        <TouchableOpacity 
            onPress={onpress}>
            <Text style={[styles.filterItem, {backgroundColor: colors.white, color: colors.blue}]}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    filterItem: {
        fontFamily: 'iransans',
        fontSize: 18,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginHorizontal: 3,
        marginVertical: 7,
        borderRadius: 10,
        borderColor: colors.blue,
        borderWidth: 1,
    }
});

export default FilterButton;
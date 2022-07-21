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

const Search = (props) => {
    return (
      <View style={styles.searchView}>
        <TextInput
            // secureTextEntry={secureTextEntry}
            style={[styles.textInput]}
            placeholder={'جستجو ...'}
            onChange={(text) => {
                // setFunction(text.nativeEvent.text)
            }}
            // onFocus={() => {setUserInputColor(colors.lightblue)}}
            // onBlur={() => {setUserInputColor('lightgray')}}
            // blurOnSubmit={blurOnSubmit}
            // returnKeyType={returnKeyType}
            // onSubmitEditing={onSubmitEditing}
            // ref={refrence}
            // keyboardType={keyboardType}
        />
        <TouchableOpacity style={styles.searchButton}>
            <Icon style={styles.searchIcon} name='search'/>
        </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
    searchView: {
        writingDirection: 'rtl',
        textAlign: 'right',
        direction: 'rtl',
        width: '90%',
        paddingHorizontal: '4%',
        marginHorizontal: '5%',
        backgroundColor: colors.white,
        borderRadius: 20,
        marginTop: 30,
        flexDirection: 'row-reverse',
    },
    textInput:{
        flex: 10,
        fontFamily: 'iransans',
        borderBottomWidth: 2,
        textAlign: 'right',
        borderWidth: 0,
        borderBottomWidth: 0,
        paddingVertical: 8,
        fontSize: 16,
    },
    searchButton: {
        flex: 1,
        textAlign: 'center',
    },
    searchIcon: {
        fontSize: 19,
        paddingTop: 10,
        color: colors.gray,
    }
});

export default Search;
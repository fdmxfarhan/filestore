import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import api from '../config/api';
const {saveData, readData} = require('../config/save');

const Loading = ({navigation, visible}) => {
  if(visible){
    return (
      <View style={styles.conainer}>
        <ActivityIndicator size={150} style={styles.loader} />
        <Text style={styles.text}>لطفا منتظر بمانید ...</Text>
        <Text style={styles.text}>از صبر و شکیبایی شما سپاسگزاریم</Text>
      </View>
    );
  }else return (<View></View>);
}

const styles = StyleSheet.create({
  conainer:{
    position: 'absolute',
    width: '100%',
    backgroundColor: colors.modal,
    height: '100%',
    zIndex: 10,
  },
  loader: {
    marginTop: 250,
  },
  logo: {
    width: 100,
    height: 100,
  },
  text: {
    color: colors.white,
    fontFamily: 'iransans',
    fontSize: 18,
    textAlign: 'center',

  }
});

export default Loading;
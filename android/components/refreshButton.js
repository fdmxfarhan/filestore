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
import api from '../config/api';
const {saveData, readData, saveFiles} = require('../config/save');

const RefreshButton = ({navigation, setFunction, setLoading, setPlansEnabled}) => {
  var refreshFiles = () => {
    setLoading(true);
    readData().then(data => {
      api.get(`/api-mobile/get-files?username=${data.estate.code}&password=${data.estate.password}`)
        .then(res => {
          if(res.data.status == 'ok'){
            setFunction(res.data.files);
            saveFiles(res.data.files);
            setLoading(false);
          } else{
            setPlansEnabled(true);
            setLoading(false);
          }
        }).catch(err => {
          console.log(err);
          setLoading(false);
          alert('عدم اتصال به اینترنت');
        })
    }).catch(err => console.log(err));
  }
  return (
    <View style={styles.conainer}>
      <TouchableOpacity style={styles.refreshBtn} onPress={refreshFiles}>
          <Text style={styles.refreshText}>بارگیری </Text> 
          <Icon style={styles.refreshIcon} name='refresh'/>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  conainer:{
    position: 'absolute',
    bottom: 15,
    right: 18,
  },
  refreshBtn:{
    flexDirection: 'row-reverse',
    backgroundColor: colors.darkblue,
    borderRadius: 30,
  },
  refreshIcon: {
    color: colors.white,
    fontSize: 25,
    paddingHorizontal: 15,
    paddingVertical: 13,
    paddingRight: 5,
  },
  refreshText: {
    fontFamily: 'iransans',
    fontSize: 17,
    color: colors.white,
    paddingTop: 14,
    paddingRight: 15,
  }
});

export default RefreshButton;
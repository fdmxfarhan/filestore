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

const RefreshButton = (props) => {
    return (
      <View style={styles.conainer}>
        <TouchableOpacity style={styles.refreshBtn}>
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
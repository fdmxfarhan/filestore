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
    backgroundColor: colors.blue,
    borderRadius: 30,
  },
  refreshIcon: {
    color: colors.white,
    fontSize: 30,
    paddingHorizontal: 15,
    paddingVertical: 13,
  },
});

export default RefreshButton;
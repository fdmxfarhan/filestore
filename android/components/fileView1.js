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

const FileView1 = ({navigation, file}) => {
    return (
      <View style={styles.container}>
          <Text>{file.area}</Text>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        
    }
});

export default FileView1;
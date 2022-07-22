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

const FileImage = ({navigation, file}) => {
    if(file.images.length == 0){
        return (
          <View style={styles.container}>
            <Icon style={styles.imageIcon} name="image" />
          </View>
        );
    } else{
        return (
          <View style={styles.container}>
            <Image source={{uri: 'https://fileestore.ir' + file.images[0].link}} style={styles.image} />
          </View>
        );
    }
}

const styles = StyleSheet.create({
    imageIcon: {
        fontSize: 50,
        color: colors.gray,
        paddingVertical: 100,
    },
    image: {
        width:  400,
        height: 300,
    },
});

export default FileImage;
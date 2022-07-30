import React, { useEffect, useState } from 'react';
import {
  FlatList,
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
import {FlatListSlider} from 'react-native-flatlist-slider';
import ImageSliderComponent from './imageSliderComponent';

const FileImage = ({navigation, images}) => {
  if(images.length == 0){
    return (
      <View style={styles.container}>
        <Icon style={styles.imageIcon} name="image" />
      </View>
    );
  } else{
    return (
      <View style={styles.container}>
        <FlatListSlider 
          data={images} 
          height={300}
          contentContainerStyle={{resizeMode: 'cover'}}
          timer={50000}
          indicatorContainerStyle={{position:'absolute', bottom: 20}}
          autoscroll={false}
          component={<ImageSliderComponent />}
    
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 300,
  },
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
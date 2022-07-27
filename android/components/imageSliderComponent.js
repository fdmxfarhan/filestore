import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';

export default ImageSliderComponent = ({style,item,imageKey,onPress,index,active,local,}) => {
    return (
      <Image style={styles.image} source={{uri: item[imageKey]}}/>
    );
};

const styles = StyleSheet.create({
    image: {
        width: Dimensions.get('window').width,
        height: 300,
    }
});
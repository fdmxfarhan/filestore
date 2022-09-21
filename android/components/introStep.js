import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import colors from '../components/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import {FlatListSlider} from 'react-native-flatlist-slider';
import ImageSliderComponent from './imageSliderComponent';

const IntroStep = ({navigation, currentStep, step, source, description, title}) => {
  if(currentStep == step){
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Image source={source} style={styles.image}/>
        <Text style={styles.description}>{description}</Text>
      </View>
    );
  } else return (<View></View>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
  },
  image: {
    width:  300,
    height: 600,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  title: {
    fontFamily: 'iransans',
    fontSize: 21,
    fontWeight: 'bold',
    color: colors.blue,
    marginTop: 30,
    marginBottom: 10,
  },
  description: {
    fontFamily: 'iransans',
    fontSize: 15,
    color: colors.white,
    marginTop: 10,
    width: '90%',
    marginHorizontal: '5%',
    textAlign: 'center',
  },
});

export default IntroStep;

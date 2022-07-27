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
  // var [images, setImages] = useState([{image: 'https://fileestore.ir/img/home.jpg', desc: ' '}]);
  // var [readOnce, setReadOnce] = useState(false);
  // useEffect(() => {
  //   if(file.images.length > 0 && !readOnce){
  //     images = [];
  //     for (let i = 0; i < file.images.length; i++) {
  //       images.push({image: 'https://fileestore.ir' + file.images[i].link, desc: i.toString()})
  //     }
  //     console.log(images)
  //     setImages(images);
  //     readOnce = true;
  //     setReadOnce(true);
  //   }
  // })
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
        {/* <FlatList
          style={styles.flatList}
          data={images}
          keyExtractor={item => item._id}
          horizontal={true}
          inverted={true}
          renderItem={({item}) => {
            return(
              <Image source={{uri: item.uri}} style={styles.image}/>
            )
          }}
        /> */}
        {/* <Image source={{uri: 'https://fileestore.ir' + file.images[0].link}} style={styles.image} /> */}
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
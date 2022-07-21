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

const FileView = (props) => {
  var [file, setFile] = useState(props.route.params.file);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Icon style={styles.imageIcon} name="image" />
        <TouchableOpacity style={styles.expandBtn}>
          <Icon style={styles.expandIcon} name='expand' />
          <Text style={styles.expandText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backBtn} onPress={() => {props.navigation.navigate('Home')}}>
          <Icon style={styles.backIcon} name='arrow-left' />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookmarkBtn}>
          <Icon style={styles.bookmarkIcon} name='bookmark-o' />
        </TouchableOpacity>
        <Text style={styles.fileNumberText}>{file.fileNumber}</Text>
        <View style={styles.circlesView}>
          <Icon style={styles.circles} name='circle' />
          <Icon style={styles.circles} name='circle-o' />
          <Icon style={styles.circles} name='circle-o' />
          <Icon style={styles.circles} name='circle-o' />
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{file.type}، {file.meterage} متری، {file.buildAge} {file.buildAge == 'نوساز' ? '' : 'سال ساخت'}</Text>
        <Text style={styles.address}>آدرس: {file.address}</Text>
        <View style={styles.info1}>
          <View style={styles.info1Card}>
            <Text style={styles.info1Title}>مالک</Text>
            <Text style={styles.info1Value}>{file.ownerName}</Text>
          </View>
          <View style={styles.break}/>
          <View style={styles.info1Card}>
            <Text style={styles.info1Title}>تلفن</Text>
            <Text style={styles.info1Value}>{file.phone}</Text>
          </View>
          <View style={styles.break}/>
          <View style={styles.info1Card}>
            <Text style={styles.info1Title}>تاریخ</Text>
            <Text style={styles.info1Value}>{file.date}</Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <View style={styles.priceItem}>
            <Text style={styles.priceTitle}>قیمت متری: </Text>
            <Text style={styles.priceValue}>{typeof(file.price) == 'undefined' ? '' : file.meterage}</Text>
          </View>
          <View style={styles.priceItem}>
            <Text style={styles.priceTitle}>قیمت کل: </Text>
            <Text style={styles.priceValue}>{typeof(file.fullPrice) == 'undefined' ? '' : file.fullPrice}</Text>
          </View>
        </View>
        <View style={styles.info2}>
          <View style={styles.info2Item}>
            <Text style={styles.info2Title}>متراژ: </Text>
            <Text style={styles.info2Value}>{typeof(file.meterage) == 'undefined' ? '' : file.meterage}</Text>
            <Text style={styles.info2Value}>{typeof(file.meterage2) == 'undefined' ? '' : file.meterage2}</Text>
            <Text style={styles.info2Value}>{typeof(file.meterage3) == 'undefined' ? '' : file.meterage3}</Text>
          </View>
          <View style={styles.info2Item}>
            <Text style={styles.info2Title}>خواب: </Text>
            <Text style={styles.info2Value}>{typeof(file.bedroom) == 'undefined' ? '' : file.bedroom}</Text>
            <Text style={styles.info2Value}>{typeof(file.bedroom2) == 'undefined' ? '' : file.bedroom2}</Text>
            <Text style={styles.info2Value}>{typeof(file.bedroom3) == 'undefined' ? '' : file.bedroom3}</Text>
          </View>
          <View style={styles.info2Item}>
            <Text style={styles.info2Title}>طبقه: </Text>
            <Text style={styles.info2Value}>{typeof(file.floor) == 'undefined' ? '' : file.floor}</Text>
            <Text style={styles.info2Value}>{typeof(file.floor2) == 'undefined' ? '' : file.floor2}</Text>
            <Text style={styles.info2Value}>{typeof(file.floor3) == 'undefined' ? '' : file.floor3}</Text>
          </View>
          <View style={styles.info2Item}>
            <Text style={styles.info2Title}>طبقات: </Text>
            <Text style={styles.info2Value}>{typeof(file.numOfFloors) == 'undefined' ? '' : file.numOfFloors}</Text>
            <Text style={styles.info2Value}>{typeof(file.numOfFloors2) == 'undefined' ? '' : file.numOfFloors2}</Text>
            <Text style={styles.info2Value}>{typeof(file.numOfFloors3) == 'undefined' ? '' : file.numOfFloors3}</Text>
          </View>
          <View style={styles.info2Item}>
            <Text style={styles.info2Title}>واحد: </Text>
            <Text style={styles.info2Value}>{typeof(file.unit) == 'undefined' ? '' : file.unit}</Text>
            <Text style={styles.info2Value}>{typeof(file.unit2) == 'undefined' ? '' : file.unit2}</Text>
            <Text style={styles.info2Value}>{typeof(file.unit3) == 'undefined' ? '' : file.unit3}</Text>
          </View>
          <View style={styles.info2Item}>
            <Text style={styles.info2Title}>سن بنا: </Text>
            <Text style={styles.info2Value}>{typeof(file.buildAge) == 'undefined' ? '' : file.buildAge}</Text>
            <Text style={styles.info2Value}>{typeof(file.buildAge2) == 'undefined' ? '' : file.buildAge2}</Text>
            <Text style={styles.info2Value}>{typeof(file.buildAge3) == 'undefined' ? '' : file.buildAge3}</Text>
          </View>
          <View style={styles.info2Item}>
            <Text style={styles.info2Title}>پارکینگ: </Text>
            <Text style={styles.info2Value}>{typeof(file.parking) == 'undefined' ? '' : file.parking}</Text>
            <Text style={styles.info2Value}>{typeof(file.parking2) == 'undefined' ? '' : file.parking2}</Text>
            <Text style={styles.info2Value}>{typeof(file.parking3) == 'undefined' ? '' : file.parking3}</Text>
          </View>
          <View style={styles.info2Item}>
            <Text style={styles.info2Title}>انباری: </Text>
            <Text style={styles.info2Value}>{typeof(file.warehouse) == 'undefined' ? '' : file.warehouse}</Text>
            <Text style={styles.info2Value}>{typeof(file.warehouse2) == 'undefined' ? '' : file.warehouse2}</Text>
            <Text style={styles.info2Value}>{typeof(file.warehouse3) == 'undefined' ? '' : file.warehouse3}</Text>
          </View>
          <View style={styles.info2Item}>
            <Text style={styles.info2Title}>آسانسور: </Text>
            <Text style={styles.info2Value}>{typeof(file.elevator) == 'undefined' ? '' : file.elevator}</Text>
            <Text style={styles.info2Value}>{typeof(file.elevator2) == 'undefined' ? '' : file.elevator2}</Text>
            <Text style={styles.info2Value}>{typeof(file.elevator3) == 'undefined' ? '' : file.elevator3}</Text>
          </View>
          <View style={styles.info2Item}>
            <Text style={styles.info2Title}>آشپزخانه: </Text>
            <Text style={styles.info2Value}>{typeof(file.kitchen) == 'undefined' ? '' : file.kitchen}</Text>
            <Text style={styles.info2Value}>{typeof(file.kitchen2) == 'undefined' ? '' : file.kitchen2}</Text>
            <Text style={styles.info2Value}>{typeof(file.kitchen3) == 'undefined' ? '' : file.kitchen3}</Text>
          </View>
          <View style={styles.info2Item}>
            <Text style={styles.info2Title}>نما: </Text>
            <Text style={styles.info2Value}>{typeof(file.view) == 'undefined' ? '' : file.view}</Text>
            <Text style={styles.info2Value}>{typeof(file.view2) == 'undefined' ? '' : file.view2}</Text>
            <Text style={styles.info2Value}>{typeof(file.view3) == 'undefined' ? '' : file.view3}</Text>
          </View>
          <View style={styles.info2Item}>
            <Text style={styles.info2Title}>کف: </Text>
            <Text style={styles.info2Value}>{typeof(file.floortype) == 'undefined' ? '' : file.floortype}</Text>
            <Text style={styles.info2Value}>{typeof(file.floortype2) == 'undefined' ? '' : file.floortype2}</Text>
            <Text style={styles.info2Value}>{typeof(file.floortype3) == 'undefined' ? '' : file.floortype3}</Text>
          </View>
          <View style={styles.info2Item}>
            <Text style={styles.info2Title}>سرویس: </Text>
            <Text style={styles.info2Value}>{typeof(file.service) == 'undefined' ? '' : file.service}</Text>
            <Text style={styles.info2Value}>{typeof(file.service2) == 'undefined' ? '' : file.service2}</Text>
            <Text style={styles.info2Value}>{typeof(file.service3) == 'undefined' ? '' : file.service3}</Text>
          </View>
          <View style={styles.info2Item}>
            <Text style={styles.info2Title}>سرمایش و گرمایش: </Text>
            <Text style={styles.info2Value}>{typeof(file.heatingAndCoolingSystem) == 'undefined' ? '' : file.heatingAndCoolingSystem}</Text>
            <Text style={styles.info2Value}>{typeof(file.heatingAndCoolingSystem2) == 'undefined' ? '' : file.heatingAndCoolingSystem2}</Text>
            <Text style={styles.info2Value}>{typeof(file.heatingAndCoolingSystem3) == 'undefined' ? '' : file.heatingAndCoolingSystem3}</Text>
          </View>
          {/* ---------------------------------- break ---------------------------------- */}
          <View style={styles.info2Item}>
            <Text style={styles.info2Title}>منطقه: </Text>
            <Text style={styles.info2Value}>{typeof(file.area) == 'undefined' ? '' : file.area}</Text>
            <Text style={styles.info2Value}></Text>
            <Text style={styles.info2Value}></Text>
          </View>
          <View style={styles.info2Item}>
            <Text style={styles.info2Title}>وام: </Text>
            <Text style={styles.info2Value}>{typeof(file.lone) == 'undefined' ? '' : file.lone}</Text>
            <Text style={styles.info2Value}></Text>
            <Text style={styles.info2Value}></Text>
          </View>
          <View style={styles.info2Item}>
            <Text style={styles.info2Title}>قابلیت تبدیل: </Text>
            <Text style={styles.info2Value}>{typeof(file.changable) == 'undefined' ? '' : file.changable}</Text>
            <Text style={styles.info2Value}></Text>
            <Text style={styles.info2Value}></Text>
          </View>
          <View style={styles.info2Item}>
            <Text style={styles.info2Title}>تخفیف: </Text>
            <Text style={styles.info2Value}>{typeof(file.discount) == 'undefined' ? '' : file.discount}</Text>
            <Text style={styles.info2Value}></Text>
            <Text style={styles.info2Value}></Text>
          </View>
          <View style={styles.info2Item}>
            <Text style={styles.info2Title}>وضعیت سند: </Text>
            <Text style={styles.info2Value}>{typeof(file.documentState) == 'undefined' ? '' : file.documentState}</Text>
            <Text style={styles.info2Value}></Text>
            <Text style={styles.info2Value}></Text>
          </View>
          <View style={styles.info2Item}>
            <Text style={styles.info2Title}>تحویل: </Text>
            <Text style={styles.info2Value}>{typeof(file.transfer) == 'undefined' ? '' : file.transfer}</Text>
            <Text style={styles.info2Value}></Text>
            <Text style={styles.info2Value}></Text>
          </View>
          <View style={styles.info2Item}>
            <Text style={styles.info2Title}>آگهی دهنده: </Text>
            <Text style={styles.info2Value}>{typeof(file.advertiser) == 'undefined' ? '' : file.advertiser}</Text>
            <Text style={styles.info2Value}></Text>
            <Text style={styles.info2Value}></Text>
          </View>
          <View style={styles.info2Item}>
            <Text style={styles.info2Title}>سمت: </Text>
            <Text style={styles.info2Value}>{typeof(file.role) == 'undefined' ? '' : file.role}</Text>
            <Text style={styles.info2Value}></Text>
            <Text style={styles.info2Value}></Text>
          </View>
        </View>
        <Text style={styles.fileOptions}>امکانات: {typeof(file.options) == 'undefined' ? '' : file.options}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      writingDirection: 'rtl',
      textAlign: 'right',
      direction: 'rtl',
    },
    imageContainer: {
      alignContent: 'center',
      alignItems: 'center',
      position: 'relative',
      borderBottomColor: colors.gray,
      borderBottomWidth: 1,
    },
    imageIcon: {
      fontSize: 50,
      color: colors.gray,
      paddingVertical: 100,
    },
    infoContainer: {
      backgroundColor: colors.white,
    },
    expandBtn: {
      backgroundColor: colors.modal,
      position: 'absolute',
      bottom: 10,
      left: 10,
      borderRadius: 10,
      flexDirection: 'row',
    },
    expandIcon: {
      color: colors.white,
      fontSize: 18,
      padding: 5,
    },
    expandText: {
      fontFamily: 'iransans',
      color: colors.white,
      fontSize: 16,
      paddingTop: 3,
      paddingHorizontal: 4,
    },
    backBtn: {
      // backgroundColor: colors.modal,
      position: 'absolute',
      top: 10,
      left: 10,
      borderRadius: 10,
      flexDirection: 'row',
    },
    backIcon: {
      color: colors.text,
      fontSize: 25,
      padding: 5,
    },
    bookmarkBtn: {
      // backgroundColor: colors.modal,
      position: 'absolute',
      top: 10,
      right: 10,
      borderRadius: 10,
      flexDirection: 'row',
    },
    bookmarkIcon: {
      color: colors.text,
      fontSize: 30,
      padding: 5,
    },
    fileNumberText:{
      backgroundColor: colors.modal,
      position: 'absolute',
      bottom: 10,
      right: 10,
      borderRadius: 10,
      flexDirection: 'row',
      color: colors.white,
      paddingHorizontal: 10, 
      paddingVertical: 6,
      fontSize: 15,
    },
    circlesView: {
      flexDirection: 'row-reverse',
      position: 'absolute',
      bottom: 10,
    },
    circles: {
      marginHorizontal: 2,
      color: colors.gray
    },
    title:{
      fontFamily: 'iransans',
      fontSize: 20,
      fontWeight: 'bold',
      paddingHorizontal: 20,
      paddingVertical: 10,
      color: colors.darkblue,
      paddingTop: 30,
    },
    address: {
      fontFamily: 'iransans',
      paddingHorizontal: 20,
      fontSize: 15,
      fontSize: 17,
      color: colors.gray,
    },
    info1: {
      flexDirection: 'row-reverse',
      // paddingHorizontal: 10,
      marginVertical: 20,
    },
    info1Card: {
      flex: 50,
      alignContent: 'center',
      alignItems: 'center',
    },
    break: {
      flex: 1,
      backgroundColor: colors.lightgray,
      height: 50,
    },
    info1Title: {
      fontFamily: 'iransans',
      fontSize: 17,
      fontWeight: 'bold',
      paddingBottom: 10,
      color: colors.text
    },
    info1Value:{
      fontFamily: 'iransans',
      fontSize: 14,
      paddingBottom: 10,
      color: colors.gray
    },
    info2: {
      paddingHorizontal: 20,
      
    },
    info2Item: {
      flexDirection: 'row-reverse',
      borderBottomColor: colors.lightgray,
      borderBottomWidth: 1,
      paddingVertical: 7,
    },
    info2Title: {
      flex: 2,
      fontFamily: 'iransans',
      fontSize: 16,
      color: colors.text,
      fontWeight: 'bold',
      writingDirection: 'rtl',
      textAlign: 'right',
      direction: 'rtl',
    },
    info2Value: {
      flex: 1,
      fontFamily: 'iransans',
      fontSize: 16,
      color: colors.gray,
      writingDirection: 'rtl',
      textAlign: 'right',
      direction: 'rtl',
    },
    fileOptions: {
      fontFamily: 'iransans',
      fontSize: 15,
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    priceContainer: {
      paddingHorizontal: 20,
      marginBottom: 20,
      
    },
    priceItem: {
      flexDirection: 'row-reverse',
      borderBottomColor: colors.lightgray,
      borderBottomWidth: 1,
      paddingVertical: 15,
    },
    priceTitle: {
      flex: 1,
      fontFamily: 'iransans',
      fontSize: 20,
      color: colors.text,
      fontWeight: 'bold',
      writingDirection: 'rtl',
      textAlign: 'right',
      direction: 'rtl',
    },
    priceValue: {
      flex: 1,
      fontFamily: 'iransans',
      fontSize: 20,
      color: colors.gray,
      writingDirection: 'ltr',
      textAlign: 'left',
      direction: 'ltr',
      fontWeight: 'bold',
      color: 'green'
    },
});

export default FileView;

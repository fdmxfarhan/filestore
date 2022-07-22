import React, { useEffect, useState } from 'react';
import {
  FlatList,
    Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import colors from '../components/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import Search from './search';
import RefreshButton from './refreshButton';
import FileView1 from './fileView1';
import api from '../config/api';

const FileList = ({navigation}) => {
  var [files, setFiles] = useState([
    // { _id: 1, fileNumber: '1234', area: '22', ownerName: 'فرحان دائمی', constPhone: '021-55418794', phone: '09336448037', address: 'تهران، خیابان کارگر جنوبی، چهارراه لشگر، غفاری', type: 'آپارتمان', date: '1401/4/30', dateJ: {}, state: 'فروش', fileNumber: '1012', role: 'شمالی', meterage: '120', bedroom: 'سه خوابه', floor: '1', numOfFloors: '5', unit: '1', buildAge: 'نوساز', parking: 'دارد', warehouse: 'دارد', elevator: 'دارد', kitchen: 'MDF', view: '', floortype: 'سرامیک', service: '', heatingAndCoolingSystem: 'شوفاژ', price: 1000, fullPrice: 100000},
    // { _id: 2, fileNumber: '1234', area: '22', ownerName: 'فرحان دائمی', constPhone: '021-55418794', phone: '09336448037', address: 'تهران، خیابان کارگر جنوبی، چهارراه لشگر، غفاری', type: 'آپارتمان', date: '1401/4/30', dateJ: {}, state: 'فروش', fileNumber: '1012', role: 'شمالی', meterage: '120', bedroom: 'سه خوابه', floor: '1', numOfFloors: '5', unit: '1', buildAge: 'نوساز', parking: 'دارد', warehouse: 'دارد', elevator: 'دارد', kitchen: 'MDF', view: '', floortype: 'سرامیک', service: '', heatingAndCoolingSystem: 'شوفاژ', price: 1000, fullPrice: 100000},
    // { _id: 3, fileNumber: '1234', area: '22', ownerName: 'فرحان دائمی', constPhone: '021-55418794', phone: '09336448037', address: 'تهران، خیابان کارگر جنوبی، چهارراه لشگر، غفاری', type: 'آپارتمان', date: '1401/4/30', dateJ: {}, state: 'فروش', fileNumber: '1012', role: 'شمالی', meterage: '120', bedroom: 'سه خوابه', floor: '1', numOfFloors: '5', unit: '1', buildAge: 'نوساز', parking: 'دارد', warehouse: 'دارد', elevator: 'دارد', kitchen: 'MDF', view: '', floortype: 'سرامیک', service: '', heatingAndCoolingSystem: 'شوفاژ', price: 1000, fullPrice: 100000},
    // { _id: 4, fileNumber: '1234', area: '22', ownerName: 'فرحان دائمی', constPhone: '021-55418794', phone: '09336448037', address: 'تهران، خیابان کارگر جنوبی، چهارراه لشگر، غفاری', type: 'آپارتمان', date: '1401/4/30', dateJ: {}, state: 'فروش', fileNumber: '1012', role: 'شمالی', meterage: '120', bedroom: 'سه خوابه', floor: '1', numOfFloors: '5', unit: '1', buildAge: 'نوساز', parking: 'دارد', warehouse: 'دارد', elevator: 'دارد', kitchen: 'MDF', view: '', floortype: 'سرامیک', service: '', heatingAndCoolingSystem: 'شوفاژ', price: 1000, fullPrice: 100000},
    // { _id: 5, fileNumber: '1234', area: '22', ownerName: 'فرحان دائمی', constPhone: '021-55418794', phone: '09336448037', address: 'تهران، خیابان کارگر جنوبی، چهارراه لشگر، غفاری', type: 'آپارتمان', date: '1401/4/30', dateJ: {}, state: 'رهن و اجاره', fileNumber: '1012', role: 'شمالی', meterage: '120', bedroom: 'سه خوابه', floor: '1', numOfFloors: '5', unit: '1', buildAge: '6', parking: 'دارد', warehouse: 'دارد', elevator: 'دارد', kitchen: 'MDF', view: '', floortype: 'سرامیک', service: '', heatingAndCoolingSystem: 'شوفاژ', price: 1000, fullPrice: 100000},
    // { _id: 6, fileNumber: '1234', area: '22', ownerName: 'فرحان دائمی', constPhone: '021-55418794', phone: '09336448037', address: 'تهران، خیابان کارگر جنوبی، چهارراه لشگر، غفاری', type: 'آپارتمان', date: '1401/4/30', dateJ: {}, state: 'رهن و اجاره', fileNumber: '1012', role: 'شمالی', meterage: '120', bedroom: 'سه خوابه', floor: '1', numOfFloors: '5', unit: '1', buildAge: '6', parking: 'دارد', warehouse: 'دارد', elevator: 'دارد', kitchen: 'MDF', view: '', floortype: 'سرامیک', service: '', heatingAndCoolingSystem: 'شوفاژ', price: 1000, fullPrice: 100000},
    // { _id: 7, fileNumber: '1234', area: '22', ownerName: 'فرحان دائمی', constPhone: '021-55418794', phone: '09336448037', address: 'تهران، خیابان کارگر جنوبی، چهارراه لشگر، غفاری', type: 'زمین', date: '1401/4/30', dateJ: {}, state: 'پیش‌فروش', fileNumber: '1012', role: 'شمالی', meterage: '120', bedroom: 'سه خوابه', floor: '1', numOfFloors: '5', unit: '1', buildAge: '6', parking: 'دارد', warehouse: 'دارد', elevator: 'دارد', kitchen: 'MDF', view: '', floortype: 'سرامیک', service: '', heatingAndCoolingSystem: 'شوفاژ', price: 1000, fullPrice: 100000},
    // { _id: 8, fileNumber: '1234', area: '22', ownerName: 'فرحان دائمی', constPhone: '021-55418794', phone: '09336448037', address: 'تهران، خیابان کارگر جنوبی، چهارراه لشگر، غفاری', type: 'آپارتمان', date: '1401/4/30', dateJ: {}, state: 'فروش', fileNumber: '1012', role: 'شمالی', meterage: '120', bedroom: 'سه خوابه', floor: '1', numOfFloors: '5', unit: '1', buildAge: 'نوساز', parking: 'دارد', warehouse: 'دارد', elevator: 'دارد', kitchen: 'MDF', view: '', floortype: 'سرامیک', service: '', heatingAndCoolingSystem: 'شوفاژ', price: 1000, fullPrice: 100000},
    // { _id: 9, fileNumber: '1234', area: '22', ownerName: 'فرحان دائمی', constPhone: '021-55418794', phone: '09336448037', address: 'تهران، خیابان کارگر جنوبی، چهارراه لشگر، غفاری', type: 'آپارتمان', date: '1401/4/30', dateJ: {}, state: 'فروش', fileNumber: '1012', role: 'شمالی', meterage: '120', bedroom: 'سه خوابه', floor: '1', numOfFloors: '5', unit: '1', buildAge: 'نوساز', parking: 'دارد', warehouse: 'دارد', elevator: 'دارد', kitchen: 'MDF', view: '', floortype: 'سرامیک', service: '', heatingAndCoolingSystem: 'شوفاژ', price: 1000, fullPrice: 100000},
    // { _id: 10, fileNumber: '1234', area: '22', ownerName: 'فرحان دائمی', constPhone: '021-55418794', phone: '09336448037', address: 'تهران، خیابان کارگر جنوبی، چهارراه لشگر، غفاری', type: 'آپارتمان', date: '1401/4/30', dateJ: {}, state: 'فروش', fileNumber: '1012', role: 'شمالی', meterage: '120', bedroom: 'سه خوابه', floor: '1', numOfFloors: '5', unit: '1', buildAge: 'نوساز', parking: 'دارد', warehouse: 'دارد', elevator: 'دارد', kitchen: 'MDF', view: '', floortype: 'سرامیک', service: '', heatingAndCoolingSystem: 'شوفاژ', price: 1000, fullPrice: 100000},
    // { _id: 11, fileNumber: '1234', area: '22', ownerName: 'فرحان دائمی', constPhone: '021-55418794', phone: '09336448037', address: 'تهران، خیابان کارگر جنوبی، چهارراه لشگر، غفاری', type: 'زمین', date: '1401/4/30', dateJ: {}, state: 'پیش‌فروش', fileNumber: '1012', role: 'شمالی', meterage: '120', bedroom: 'سه خوابه', floor: '1', numOfFloors: '5', unit: '1', buildAge: '6', parking: 'دارد', warehouse: 'دارد', elevator: 'دارد', kitchen: 'MDF', view: '', floortype: 'سرامیک', service: '', heatingAndCoolingSystem: 'شوفاژ', price: 1000, fullPrice: 100000},
    // { _id: 12, fileNumber: '1234', area: '22', ownerName: 'فرحان دائمی', constPhone: '021-55418794', phone: '09336448037', address: 'تهران، خیابان کارگر جنوبی، چهارراه لشگر، غفاری', type: 'آپارتمان', date: '1401/4/30', dateJ: {}, state: 'فروش', fileNumber: '1012', role: 'شمالی', meterage: '120', bedroom: 'سه خوابه', floor: '1', numOfFloors: '5', unit: '1', buildAge: 'نوساز', parking: 'دارد', warehouse: 'دارد', elevator: 'دارد', kitchen: 'MDF', view: '', floortype: 'سرامیک', service: '', heatingAndCoolingSystem: 'شوفاژ', price: 1000, fullPrice: 100000},
    // { _id: 13, fileNumber: '1234', area: '22', ownerName: 'فرحان دائمی', constPhone: '021-55418794', phone: '09336448037', address: 'تهران، خیابان کارگر جنوبی، چهارراه لشگر، غفاری', type: 'آپارتمان', date: '1401/4/30', dateJ: {}, state: 'فروش', fileNumber: '1012', role: 'شمالی', meterage: '120', bedroom: 'سه خوابه', floor: '1', numOfFloors: '5', unit: '1', buildAge: 'نوساز', parking: 'دارد', warehouse: 'دارد', elevator: 'دارد', kitchen: 'MDF', view: '', floortype: 'سرامیک', service: '', heatingAndCoolingSystem: 'شوفاژ', price: 1000, fullPrice: 100000},
    // { _id: 14, fileNumber: '1234', area: '22', ownerName: 'فرحان دائمی', constPhone: '021-55418794', phone: '09336448037', address: 'تهران، خیابان کارگر جنوبی، چهارراه لشگر، غفاری', type: 'آپارتمان', date: '1401/4/30', dateJ: {}, state: 'فروش', fileNumber: '1012', role: 'شمالی', meterage: '120', bedroom: 'سه خوابه', floor: '1', numOfFloors: '5', unit: '1', buildAge: 'نوساز', parking: 'دارد', warehouse: 'دارد', elevator: 'دارد', kitchen: 'MDF', view: '', floortype: 'سرامیک', service: '', heatingAndCoolingSystem: 'شوفاژ', price: 1000, fullPrice: 100000},
  ]);
  useEffect(() => {
    api.get('/api-mobile')
      .then(res => {
        console.log(res.data);
      }).catch(err => console.log(err));
  });
  return (
    <View style={styles.container}>
      <Search />
      <FlatList
          // inverted={true}
          // horizontal={true}
          style={styles.flatList}
          data={files}
          keyExtractor={item => item._id}
          renderItem={({item}) => {
            return(
              <TouchableOpacity onPress={() => {navigation.navigate("FileView", {file: item});}}>
                <FileView1 file={item}/>
              </TouchableOpacity>
            )
          }}
          />
      <RefreshButton />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: colors.lightBackground,
        alignContent: 'center',
        alignItems: 'center',
    },
    tabBar:{
        fontFamily: 'iransans',
        fontSize: 14,
        padding: 0,
        margin: 0,
    },
    flatList: {
      width: '100%',
      marginTop: 20,
    }

});

export default FileList;
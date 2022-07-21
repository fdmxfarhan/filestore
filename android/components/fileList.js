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

const FileList = (props) => {
  var [files, setFiles] = useState([
    { _id: 1, area: '22', ownerName: 'فرحان دائمی', constPhone: '021-55418794', phone: '09336448037', address: 'تهران، خیابان کارگر جنوبی، چهارراه لشگر، غفاری', type: 'آپارتمان', date: '1401/4/30', dateJ: {}, state: 'فروش', fileNumber: '1012', role: 'شمالی', meterage: '120', bedroom: 'سه خوابه', floor: '1', numOfFloors: '5', unit: '1', buildAge: '6', parking: 'دارد', warehouse: 'دارد', elevator: 'دارد', kitchen: 'MDF', view: '', floortype: 'سرامیک', service: '', heatingAndCoolingSystem: 'شوفاژ', price: 1000, fullPrice: 100000},
    { _id: 2, area: '22', ownerName: 'فرحان دائمی', constPhone: '021-55418794', phone: '09336448037', address: 'تهران، خیابان کارگر جنوبی، چهارراه لشگر، غفاری', type: 'آپارتمان', date: '1401/4/30', dateJ: {}, state: 'فروش', fileNumber: '1012', role: 'شمالی', meterage: '120', bedroom: 'سه خوابه', floor: '1', numOfFloors: '5', unit: '1', buildAge: '6', parking: 'دارد', warehouse: 'دارد', elevator: 'دارد', kitchen: 'MDF', view: '', floortype: 'سرامیک', service: '', heatingAndCoolingSystem: 'شوفاژ', price: 1000, fullPrice: 100000},
    { _id: 3, area: '22', ownerName: 'فرحان دائمی', constPhone: '021-55418794', phone: '09336448037', address: 'تهران، خیابان کارگر جنوبی، چهارراه لشگر، غفاری', type: 'آپارتمان', date: '1401/4/30', dateJ: {}, state: 'فروش', fileNumber: '1012', role: 'شمالی', meterage: '120', bedroom: 'سه خوابه', floor: '1', numOfFloors: '5', unit: '1', buildAge: '6', parking: 'دارد', warehouse: 'دارد', elevator: 'دارد', kitchen: 'MDF', view: '', floortype: 'سرامیک', service: '', heatingAndCoolingSystem: 'شوفاژ', price: 1000, fullPrice: 100000},
  ]);
  return (
    <View style={styles.container}>
      <Search />
      <FlatList
          // inverted={true}
          // horizontal={true}
          data={files}
          keyExtractor={item => item._id}
          renderItem={({item}) => {
            return(
              <FileView1 file={item}/>
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
    }
});

export default FileList;
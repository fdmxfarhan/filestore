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
import FilterButton from './filterButton';

const Filters = ({navigation, files, showingFiles, setShowingFiles, setLoading}) => {
    var [apartment, setapartment] = useState(true);
    var [vilage, setvilage] = useState(true);
    var [old, setold] = useState(true);
    var [business, setbusiness] = useState(true);
    var [office, setoffice] = useState(true);
    var [officeEstate, setofficeEstate] = useState(true);
    var [land, setland] = useState(true);
    var [mostaghelat, setmostaghelat] = useState(true);
    var [sell, setsell] = useState(true);
    var [presell, setpresell] = useState(true);
    var [exchange, setexchange] = useState(true);
    var [cooperate, setcooperate] = useState(true);
    var [rent, setrent] = useState(true);
    var [rent2, setrent2] = useState(true);
    var [changable, setchangable] = useState(false);
    var [parking, setparking] = useState(false);
    var [warehouse, setwarehouse] = useState(false);
    var [elevator, setelevator] = useState(false);
    var isChangable = (file) => {
        // file = file.changable.replace(' ', '');
        if(file.state != 'رهن و اجاره' && file.state != 'رهن کامل') return true;
        if(typeof(file.changable) == 'undefined') return false;
        if(file.changable == '') return false;
        if(file.changable == 'ندارد') return false;
        if(file.changable == 'دارد') return true;
        if(file.changable == 'جزئی') return true;
        if(file.changable == 'جزیی') return true;
        return false;
    }
    var haveParking = (file) => {
        if(typeof(file.parking) == 'undefined') return false;
        if(file.parking == '') return false;
        if(file.parking == 'ندارد') return false;
        return true;
    }
    var haveWarehouse = (file) => {
        if(typeof(file.warehouse) == 'undefined') return false;
        if(file.warehouse == '') return false;
        if(file.warehouse == 'ندارد') return false;
        return true;
    }
    var haveElevator = (file) => {
        if(typeof(file.elevator) == 'undefined') return false;
        if(file.elevator == '') return false;
        if(file.elevator == 'ندارد') return false;
        return true;
    }
    var filterFiles = () => {
        showingFiles = [];
        var names = ['آپارتمان' ,'ویلایی' ,'کلنگی' ,'تجاری' ,'اداری' ,'موقعیت اداری' ,'زمین' ,'مستغلات' ,'فروش' ,'پیش‌فروش' ,'معاوضه' ,'مشارکت' ,'رهن و اجاره' ,'رهن کامل'];
        setLoading(true);
        for(var i=0; i<files.length; i++){
            if     (!apartment    && files[i].type  == 'آپارتمان');
            else if(!vilage       && files[i].type  == 'ویلایی');
            else if(!old          && files[i].type  == 'کلنگی');
            else if(!business     && files[i].type  == 'تجاری');
            else if(!office       && files[i].type  == 'اداری');
            else if(!officeEstate && files[i].type  == 'موقعیت اداری');
            else if(!land         && files[i].type  == 'زمین');
            else if(!mostaghelat  && files[i].type  == 'مستغلات');
            else if(!sell         && files[i].state == 'فروش');
            else if(!presell      && (files[i].state == 'پیش‌فروش' || files[i].state == 'پیش فروش'));
            else if(!exchange     && files[i].state == 'معاوضه');
            else if(!cooperate    && files[i].state == 'مشارکت');
            else if(!rent         && files[i].state == 'رهن و اجاره');
            else if(!rent2        && files[i].state == 'رهن کامل');
            else {
                if(parking && !haveParking(files[i]));
                else if(warehouse && !haveWarehouse(files[i]));
                else if(elevator && !haveElevator(files[i]));
                else if((rent || rent2) && changable && !isChangable(files[i]));
                else if(names.indexOf(files[i].type) != -1 && names.indexOf(files[i].state) != -1)
                    showingFiles.push(files[i]);
            }
        }
        setShowingFiles(showingFiles);
        setLoading(false);
    }
    return (
      <View style={styles.container}>
        <ScrollView
            horizontal={true}
            inverted={true}
            style={styles.scrollview}
            contentContainerStyle={styles.contentContainerStyle}
            >
            <FilterButton onpress={() => {setapartment(!apartment); apartment = !apartment; filterFiles();}} text={'آپارتمان'} enable={apartment} />
            <FilterButton onpress={() => {setvilage(!vilage); vilage = !vilage; filterFiles();}} text={'ویلایی'} enable={vilage} />
            <FilterButton onpress={() => {setold(!old); old = !old; filterFiles();}} text={'کلنگی'} enable={old} />
            <FilterButton onpress={() => {setbusiness(!business); business = !business; filterFiles();}} text={'تجاری'} enable={business} />
            <FilterButton onpress={() => {setoffice(!office); office = !office; filterFiles();}} text={'اداری'} enable={office} />
            <FilterButton onpress={() => {setofficeEstate(!officeEstate); officeEstate = !officeEstate; filterFiles();}} text={'موقعیت اداری'} enable={officeEstate} />
            <FilterButton onpress={() => {setland(!land); land = !land; filterFiles();}} text={'زمین'} enable={land} />
            <FilterButton onpress={() => {setmostaghelat(!mostaghelat); mostaghelat = !mostaghelat; filterFiles();}} text={'مستغلات'} enable={mostaghelat} />
            <FilterButton onpress={() => {setsell(!sell); sell = !sell; filterFiles();}} text={'فروش'} enable={sell} />
            <FilterButton onpress={() => {setpresell(!presell); presell = !presell; filterFiles();}} text={'پیش‌فروش'} enable={presell} />
            <FilterButton onpress={() => {setexchange(!exchange); exchange = !exchange; filterFiles();}} text={'معاوضه'} enable={exchange} />
            <FilterButton onpress={() => {setcooperate(!cooperate); cooperate = !cooperate; filterFiles();}} text={'مشارکت'} enable={cooperate} />
            <FilterButton onpress={() => {setrent(!rent); rent = !rent; filterFiles();}} text={'رهن و اجاره'} enable={rent} />
            <FilterButton onpress={() => {setrent2(!rent2); rent2 = !rent2; filterFiles();}} text={'رهن کامل'} enable={rent2} />
            <FilterButton onpress={() => {setchangable(!changable); changable = !changable; filterFiles();}} text={'قابل تبدیل'} enable={changable} />
            <FilterButton onpress={() => {setparking(!parking); parking = !parking; filterFiles();}} text={'پارکینگ'} enable={parking} />
            <FilterButton onpress={() => {setwarehouse(!warehouse); warehouse = !warehouse; filterFiles();}} text={'انباری'} enable={warehouse} />
            <FilterButton onpress={() => {setelevator(!elevator); elevator = !elevator; filterFiles();}} text={'آسانسور'} enable={elevator} />
        </ScrollView>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 52,
        marginVertical: 10,
        width: '90%',
        textAlign: 'right'
    },
    contentContainerStyle: {
        flexDirection: 'row-reverse'
    },
    scrollview: {
    },
    filterItem: {
        fontFamily: 'iransans',
        fontSize: 18,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginHorizontal: 3,
        marginVertical: 7,
        borderRadius: 10,
        borderColor: colors.blue,
        borderWidth: 2,
    }
});

export default Filters;
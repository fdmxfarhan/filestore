import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
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
import api from '../config/api';
import TwoSideInput from './twoSideInput';
import TextAreaInput from './TextAreaInput';
import TwoSideSelectInput from './twoSideSelectInput';
const {saveData, readData, saveFiles} = require('../config/save');

const AddFileView = ({navigation, setFiles, files}) => {
    var types = ['آپارتمان','ویلایی','کلنگی','تجاری','اداری','موقعیت اداری','زمین','مستغلات'];
    var states = ['فروش','پیش‌فروش','معاوضه','مشارکت','رهن و اجاره','رهن کامل'];
    var [ownerName, setownerName] = useState('');
    var [constPhone, setconstPhone] = useState('');
    var [address, setaddress] = useState('');
    var [phone, setphone] = useState('');
    var [date, setdate] = useState('');
    var [type, settype] = useState('');
    var [state, setstate] = useState('');
    var [meterage, setmeterage] = useState('');
    var [bedroom, setbedroom] = useState('');
    var [floor, setfloor] = useState('');
    var [numOfFloors, setnumOfFloors] = useState('');
    var [unit, setunit] = useState('');
    var [buildAge, setbuildAge] = useState('');
    var [parking, setparking] = useState('');
    var [warehouse, setwarehouse] = useState('');
    var [elevator, setelevator] = useState('');
    var [kitchen, setkitchen] = useState('');
    var [view, setview] = useState('');
    var [floortype, setfloortype] = useState('');
    var [service, setservice] = useState('');
    var [heatingAndCoolingSystem, setheatingAndCoolingSystem] = useState('');
    var [options, setoptions] = useState('');
    var [price, setprice] = useState('');
    var [fullPrice, setfullPrice] = useState('');
    var [role, setrole] = useState('');
    var [advertiser, setadvertiser] = useState('');
    var [area, setarea] = useState('');
    var [lone, setlone] = useState('');
    var [changable, setchangable] = useState('');
    var [discount, setdiscount] = useState('');
    var [documentState, setdocumentState] = useState('');
    var [transfer, settransfer] = useState('');
    var submitForm = () => {
        readData().then(data => {
            var fileData = { creatorCode: data.estate.code, ownerName, constPhone, address, phone, date, type, state, meterage, bedroom, floor, numOfFloors, unit, buildAge, parking, warehouse, elevator, kitchen, view, floortype, service, heatingAndCoolingSystem, options, price, fullPrice, role, advertiser, area, lone, changable, discount, documentState, transfer};
            api.post('/api-mobile/add-new-file', {fileData}).then(res => {
                navigation.navigate('Bookmark');
            }).catch(err => {
                alert('عدم اتصال به اینترنت');
            })
        }).catch(err => console.log(err));
    }
    return(
        <View style={styles.container}>
            <View style={styles.topView}>
                <ScrollView>
                    <Text style={styles.pageTitle}>+ افزودن فایل جدید</Text>
                    <Text style={styles.pageInfoText}>فایل‌های ثبت شده در قسمت فایل های نشان شده قابل دسترسی است.</Text>
                    <TwoSideInput title1={'نام مالک'} title2={'تلفن'} set1={setownerName} set2={setconstPhone} />
                    <TextAreaInput title1={'آدرس'} set={setaddress}/>
                    <TwoSideInput title1={'همراه'}     title2={'تاریخ'} set1={setphone} set2={setdate} />
                    <TwoSideSelectInput title1={'نوع'} title2={'وضعیت'} options1={types} options2={states} set1={settype} set2={setstate} />

                    <TwoSideInput title1={'متراژ'}    title2={'خواب'} set1={setmeterage} set2={setbedroom} />
                    <TwoSideInput title1={'طبقه'}     title2={'طبقات'} set1={setfloor} set2={setnumOfFloors} />
                    <TwoSideInput title1={'واحد'}     title2={'سن بنا'} set1={setunit} set2={setbuildAge} />
                    <TwoSideInput title1={'پارکینگ'}  title2={'انباری'} set1={setparking} set2={setwarehouse} />
                    <TwoSideInput title1={'آسانسور'}  title2={'آشپزخانه'} set1={setelevator} set2={setkitchen} />
                    <TwoSideInput title1={'نما'}      title2={'کف'} set1={setview} set2={setfloortype} />
                    <TwoSideInput title1={'سرویس'}    title2={'سرمایش گرمایش'} set1={setservice} set2={setheatingAndCoolingSystem} />
                    <TextAreaInput title1={'امکانات'} set={setoptions} />
                    <TextAreaInput title1={'قیمت متری/رهن'} set={setprice} />
                    <TextAreaInput title1={'قیمت کل/اجاره'} set={setfullPrice} />

                    <TwoSideInput title1={'سمت'}      title2={'آگهی دهنده'} set1={setrole} set2={setadvertiser} />
                    <TwoSideInput title1={'منطقه'}    title2={'وام'} set1={setarea} set2={setlone} />
                    <TwoSideInput title1={'قابلیت تبدیل'}      title2={'تخفیف'} set1={setchangable} set2={setdiscount} />
                    <TwoSideInput title1={'وضعیت سند'}      title2={'تحویل'} set1={setdocumentState} set2={settransfer} />

                    <View style={styles.topViewSpace} />
                </ScrollView>
            </View>
            <View style={styles.bottomView}>
                <TouchableOpacity style={styles.addButton} onPress={submitForm}>
                    <Text style={styles.addButtonText}>ثبت فایل</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        display: 'flex',
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
    },
    topView: {
        width: '100%',
        flex: 11,
    },
    bottomView: {
        flex: 1,
        width: '100%',
        alignContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        backgroundColor: colors.darkblue,
        width: '90%',
        borderRadius: 5,
    },
    addButtonText: {
        color: colors.white,
        fontFamily: 'iransans',
        fontSize: 18,
        textAlign: 'center',
        paddingVertical: 10,
        marginHorizontal: '5%',
    },
    topViewSpace: {
        height: 50,
    },
    pageTitle: {
        fontFamily: 'iransans',
        fontSize: 20,
        textAlign: 'center',
        paddingTop: 30,
        color: colors.darkblue,
        fontWeight: 'bold',
        paddingBottom: 10,
    },
    pageInfoText: {
        fontFamily: 'iransans',
        fontSize: 13,
        textAlign: 'center',
    },
});

export default AddFileView;
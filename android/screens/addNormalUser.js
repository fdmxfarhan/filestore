import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    PermissionsAndroid,
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
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../components/colors';
import RadioButton from '../components/radioButton';
const {saveData, readData} = require('../config/save');


const AddNormalUser = (props) => {
    var [userpermissionrent, setUserpermissionrent ] = useState(true);
    var [userpermissionsell, setUserpermissionsell ] = useState(true);
    var [userpermissionchange, setUserpermissionchange ] = useState(true);
    var [userpermissionapartment, setUserpermissionapartment ] = useState(true);
    var [userpermissionoffice, setUserpermissionoffice ] = useState(true);
    var [userpermissionfeild, setUserpermissionfeild ] = useState(true);
    var [fullname, setFullname] = useState(false);
    var [phone, setPhone] = useState(false);
    var [address, setAddress] = useState(false);
    var [password, setPassword] = useState(false);
    
    var registerNormalUser = () => {
        readData().then(data => {
            if(data != null) {
                api.post(`/api-mobile/add-normal-user`, {
                    username: data.estate.code,
                    userpermissionrent,
                    userpermissionsell,
                    userpermissionchange,
                    userpermissionapartment,
                    userpermissionoffice,
                    userpermissionfeild,
                    fullname,
                    phone,
                    address,
                    password,
                }).then(res => {
                    if(res.data.status == 'ok'){
                        props.navigation.navigate('UserControl');
                    }
                    else alert('خطایی رخ داده است');
                }).catch(err => {
                    alert('عدم اتصال به اینترنت')
                })
            }
        }).catch(err => console.log(err));
    }
    return(
        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.title}>افزودن کاربر</Text>
                <Text style={styles.label}>نام و نام خانوادگی:</Text>
                <TextInput
                    style={[styles.textInput]}
                    // placeholder={'بینهایت'}
                    // keyboardType={'number-pad'}
                    // onSubmitEditing={() => {searchFiles();}}
                    // secureTextEntry={true}
                    onChange={(text) => {
                        setFullname(text.nativeEvent.text);
                    }}/>
                <Text style={styles.label}>شماره موبایل:</Text>
                <TextInput
                    style={[styles.textInput]}
                    // placeholder={'بینهایت'}
                    // keyboardType={'number-pad'}
                    // onSubmitEditing={() => {searchFiles();}}
                    // secureTextEntry={true}
                    onChange={(text) => {
                        setPhone(text.nativeEvent.text);
                    }}/>
                <Text style={styles.label}>آدرس:</Text>
                <TextInput
                    style={[styles.textInput]}
                    // placeholder={'بینهایت'}
                    // keyboardType={'number-pad'}
                    // onSubmitEditing={() => {searchFiles();}}
                    // secureTextEntry={true}
                    onChange={(text) => {
                        setAddress(text.nativeEvent.text);
                    }}/>
                <Text style={styles.label}>کلمه عبور</Text>
                <TextInput
                    style={[styles.textInput]}
                    // placeholder={'بینهایت'}
                    // keyboardType={'number-pad'}
                    // onSubmitEditing={() => {searchFiles();}}
                    secureTextEntry={true}
                    onChange={(text) => {
                        setPassword(text.nativeEvent.text);
                    }}/>
                <View style={styles.radioVeiw}>
                    <RadioButton style={styles.radio} setFunc={setUserpermissionrent} val={userpermissionrent} text={'رهن و اجاره، رهن کامل'}/>
                    <RadioButton style={styles.radio} setFunc={setUserpermissionsell} val={userpermissionsell} text={'فروش، پیش‌فروش'}/>
                    <RadioButton style={styles.radio} setFunc={setUserpermissionchange} val={userpermissionchange} text={'معاوضه، مشارکت'}/>
                    <RadioButton style={styles.radio} setFunc={setUserpermissionapartment} val={userpermissionapartment} text={'آپارتمان، ویلایی'}/>
                    <RadioButton style={styles.radio} setFunc={setUserpermissionoffice} val={userpermissionoffice} text={'اداری، موقعیت اداری، تجاری'}/>
                    <RadioButton style={styles.radio} setFunc={setUserpermissionfeild} val={userpermissionfeild} text={'کلنگی، زمین، مستغلات'}/>
                </View>
            </View>
            <View style={styles.buttonView}>
                <TouchableOpacity style={styles.addButton} onPress={registerNormalUser}>
                    <Text style={styles.addButtonText}>+افزودن کاربر</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightBackground,
        alignContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontFamily: 'iransans',
        fontSize: 17,
        color: colors.gray,
        marginTop: 20,
        marginBottom: 30,
    },
    label: {
        fontFamily: 'iransans',
        fontSize: 17,
        color: colors.darkblue,
        textAlign: 'right',
        width: '80%',
    },
    textInput: {
        fontFamily: 'iransans',
        fontSize: 17,
        backgroundColor: colors.white,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        width: '80%',
        textAlign: 'right',
        marginBottom: 10,
    },
    form: {
        width: '100%',
        alignContent: 'center',
        alignItems: 'center',
    },
    buttonView: {
        width: '100%',
        alignContent: 'center',
        alignItems: 'center',
    },
    addButton: {
        marginTop: 30,
        backgroundColor: colors.darkblue,
        width: '80%',
        borderRadius: 10,
    },
    addButtonText: {
        fontFamily: 'iransans',
        fontSize: 17,
        paddingVertical: 10,
        color: colors.white,
        textAlign: 'center',
    },
    radioVeiw: {
        // alignContent: 'flex-start',
        width: '80%',
    },
});

export default AddNormalUser;
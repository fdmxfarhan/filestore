import React, { useEffect, useRef, useState } from 'react';
import {
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
import { TextInput } from 'react-native-gesture-handler';
import colors from '../components/colors';
import api from '../config/api';
const {saveData, readData} = require('../config/save');

const Register = (props) => {
    var [name, setName] = useState('');
    var [address, setAddress] = useState('');
    var [phone, setPhone] = useState('');
    var [password, setPassword] = useState('');
    var addressRef = useRef(null);
    var phoneRef = useRef(null);
    var passwordRef = useRef(null);
    var checkRegister = () => {
        api.post(`/api-mobile/register-user?`, {name, address, phone, password})
            .then(res => {
                if(res.data.status == 'ok'){
                    var estate = res.data.estate;
                    saveData({estate});
                    props.navigation.navigate('Home');
                }
                else{
                    // alert('کد اشتراک یا کلمه عبور صحیح نیست')
                }
            }).catch(err => {
                alert('عدم اتصال به اینترنت')
            })
    }
    return(
        <View style={styles.container}>
            <Image 
                source={require('../assets/logo.png')}
                style={styles.logo}
            />
            <Text style={styles.title}>ثبت نام در فایل استور </Text>
            <TextInput 
                style={[styles.textInput]}
                placeholder={'نام مشاور املاک'}
                placeholderTextColor={colors.lightgray}
                onSubmitEditing={()=>addressRef.current.focus()}
                returnKeyType={'next'}
                onChange={(text) => {
                    setName(text.nativeEvent.text)
                }}/>
            <TextInput 
                style={[styles.textInput]}
                placeholder={'آدرس'}
                placeholderTextColor={colors.lightgray}
                onSubmitEditing={()=>phoneRef.current.focus()}
                returnKeyType={'next'}
                ref={addressRef}
                onChange={(text) => {
                    setAddress(text.nativeEvent.text)
                }}/>
            <TextInput 
                style={[styles.textInput]}
                placeholder={'شماره موبایل'}
                placeholderTextColor={colors.lightgray}
                onSubmitEditing={()=> checkRegister}
                returnKeyType={'next'}
                keyboardType={'number-pad'}
                ref={phoneRef}
                onChange={(text) => {
                    setPhone(text.nativeEvent.text)
                }}/>
            {/* <TextInput 
                style={[styles.textInput]}
                placeholder={'کلمه عبور'}
                secureTextEntry={true}
                placeholderTextColor={colors.lightgray}
                ref={passwordInput}
                keyboardType={'number-pad'}
                onSubmitEditing={checkLogin}
                maxLength={4}
                onChange={(text) => {
                    setPassword(text.nativeEvent.text)
                }}/> */}
            <TouchableOpacity style={[styles.loginBtn, {marginTop: 50}]} onPress={checkRegister}>
                <Text style={styles.loginText}>ثبت نام</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginBtn} onPress={() => props.navigation.navigate('Login')}>
                <Text style={styles.loginText}>ورود</Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.darkBackground,
        alignContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        marginTop: 100,
    },
    title: {
        fontFamily: 'iransans',
        fontSize: 22,
        color: colors.lightBackground,
        marginTop: 20,
        fontWeight: 'bold',
        // marginTop: 150,
        marginBottom: 30,
    },
    textInput:{
        backgroundColor: colors.lightDark,
        width: '80%',
        fontFamily: 'iransans',
        borderBottomWidth: 2,
        textAlign: 'center',
        borderWidth: 0,
        borderBottomWidth: 0,
        paddingVertical: 8,
        fontSize: 16,
        marginTop: 20,
        color: colors.white,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    loginBtn:{
        backgroundColor: colors.blue,
        width: '80%',
        borderBottomWidth: 2,
        borderWidth: 0,
        borderBottomWidth: 0,
        paddingVertical: 8,
        marginTop: 20,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    loginText:{
        textAlign: 'center',
        fontFamily: 'iransans',
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Register;
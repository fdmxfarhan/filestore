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

const Login = (props) => {
    var [username, setUsername] = useState('');
    var [password, setPassword] = useState('');
    var [loginView, setLoginView] = useState('admin');
    var passwordInput = useRef(null);
    useEffect(() => {
        
    })
    var checkLogin = () => {
        if(loginView == 'admin'){
            api.get(`/api-mobile/login?username=${username}&password=${password}`)
                .then(res => {
                    if(res.data.correct == true){
                        var estate = res.data.estate;
                        saveData({estate});
                        props.navigation.navigate('Home');
                    }
                    else{
                        alert('کد اشتراک یا کلمه عبور صحیح نیست')
                    }
                }).catch(err => {
                    alert('عدم اتصال به اینترنت')
                })
        }
        else {
            api.get(`/api-mobile/login-normal-user?phone=${username}&password=${password}`)
                .then(res => {
                    if(res.data.correct == true){
                        var estate = res.data.estate;
                        saveData({estate});
                        props.navigation.navigate('Home');
                    }
                    else{
                        alert('کد اشتراک یا کلمه عبور صحیح نیست')
                    }
                }).catch(err => {
                    alert('عدم اتصال به اینترنت')
                })
        }
    }
    return(
        <View style={styles.container}>
            <Image 
                source={require('../assets/logo.png')}
                style={styles.logo}
            />
            <Text style={styles.title}>به فایل استور خوش آمدید</Text>
            
            <View style={styles.viewSelector}>
                <TouchableOpacity style={[styles.viewSelectorButton, {backgroundColor: loginView == 'admin'? colors.blue : 'transparent'}]} onPress={() => setLoginView('admin')}>
                    <Text style={styles.viewSelectorText}>ادمین</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.viewSelectorButton, {backgroundColor: loginView == 'user'? colors.blue : 'transparent'}]} onPress={() => setLoginView('user')}>
                    <Text style={styles.viewSelectorText}>کاربر</Text>
                </TouchableOpacity>
            </View>
            <View style={{display: loginView == 'admin'? 'flex' : 'none', width: '100%', alignItems: 'center'}}>
                <TextInput 
                    style={[styles.textInput]}
                    placeholder={'کد اشتراک'}
                    placeholderTextColor={colors.lightgray}
                    onSubmitEditing={()=>passwordInput.current.focus()}
                    returnKeyType={'next'}
                    keyboardType={'number-pad'}
                    onChange={(text) => {
                        setUsername(text.nativeEvent.text)
                    }}/>
                <TextInput 
                    style={[styles.textInput]}
                    placeholder={'کلمه عبور'}
                    secureTextEntry={true}
                    placeholderTextColor={colors.lightgray}
                    ref={passwordInput}
                    keyboardType={'number-pad'}
                    onSubmitEditing={checkLogin}
                    onChange={(text) => {
                        setPassword(text.nativeEvent.text)
                    }}/>
            </View>
            <View style={{display: loginView == 'user'? 'flex' : 'none', width: '100%', alignItems: 'center'}}>
                <TextInput 
                    style={[styles.textInput]}
                    placeholder={'شماره موبایل'}
                    placeholderTextColor={colors.lightgray}
                    onSubmitEditing={()=>passwordInput.current.focus()}
                    returnKeyType={'next'}
                    keyboardType={'number-pad'}
                    onChange={(text) => {
                        setUsername(text.nativeEvent.text)
                    }}/>
                <TextInput 
                    style={[styles.textInput]}
                    placeholder={'کلمه عبور'}
                    secureTextEntry={true}
                    placeholderTextColor={colors.lightgray}
                    ref={passwordInput}
                    keyboardType={'number-pad'}
                    onSubmitEditing={checkLogin}
                    onChange={(text) => {
                        setPassword(text.nativeEvent.text)
                    }}/>
            </View>
            <TouchableOpacity style={styles.loginBtn} onPress={checkLogin}>
                <Text style={styles.loginText}>ورود</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginBtn} onPress={() => props.navigation.navigate('Register')}>
                <Text style={styles.loginText}>ثبت نام</Text>
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
        marginBottom: 10,
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
    viewSelector: {
        flexDirection: 'row-reverse',
        width: '80%',
        marginTop: 20,
    },
    viewSelectorButton: {
        flex: 1,
        borderBottomColor: colors.blue,
        borderBottomWidth: 1,
    },
    viewSelectorText: {
        textAlign: 'center',
        color: colors.white,
        paddingVertical: 10,

    },
});

export default Login;
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
    var passwordInput = useRef(null);

    useEffect(() => {
        
    })
    var checkLogin = () => {
        api.post('/api-mobile/login', {username, password})
            .then(res => {
                console.log(res.data);
            }).catch(err => {
                console.log(err);
            })
    }
    return(
        <View style={styles.container}>
            <Image 
                source={require('../assets/logo.png')}
                style={styles.logo}
            />
            <Text style={styles.title}>به فایل استور خوش آمدید</Text>
            <TextInput 
                style={[styles.textInput]}
                placeholder={'نام کاربری'}
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
            <TouchableOpacity style={styles.loginBtn} onPress={checkLogin}>
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
        marginBottom: 60,
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
        marginTop: 50,
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

export default Login;
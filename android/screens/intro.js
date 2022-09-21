import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import colors from '../components/colors';
import IntroStep from '../components/introStep';
import api from '../config/api';
const {saveData, readData} = require('../config/save');
import Icon from 'react-native-vector-icons/FontAwesome';

const Intro = (props) => {
    var [currentStep, setCurrentStep] = useState(0);
    return(
        <View style={styles.container}>
            <IntroStep step={0} currentStep={currentStep} source={require('../assets/intro-download.jpg')} description={'بارگیری تمام اطلاعات فایل‌های منطقه'} title={'بارگیری فایل‌ها'} />
            <IntroStep step={1} currentStep={currentStep} source={require('../assets/intro-colors.jpg')} description={'قرمز: مستقلات، کلنگی و زمین \n آبی: فروش و پیش‌فروش \n سبز: رهن و اجاره و رهن کامل'} title={'رنگ بندی فایل‌ها'} />
            <IntroStep step={2} currentStep={currentStep} source={require('../assets/intro-bookmarks.jpg')} description={'فایل‌های نشان شده و فایل‌های شخصی در این قسمت در دسترس است.'} title={'فایل‌های نشان شده'} />
            <IntroStep step={3} currentStep={currentStep} source={require('../assets/intro-usercontrol.jpg')} description={'در این قسمت می‌توان کاربران را حذف یا اضافه نمود.'} title={'مدیریت کاربران'} />
            <IntroStep step={4} currentStep={currentStep} source={require('../assets/intro-addfile.jpg')} description={'با وارد کردن اطلاعات فایل می‌توانید یک فایل جدید اضافه کنید. \n دسترسی به این فایل فقط توسط کاربران مشاور املاک امکان پذیر است.'} title={'افزودن فایل'} />
            <IntroStep step={5} currentStep={currentStep} source={require('../assets/intro-profile.jpg')} description={'مشخصات کاربر، اشتراک های فعال و مدیریت کاربران \n در این قسمت در دسترس است.'} title={'پروفایل'} />
            <View style={styles.control}>
                <TouchableOpacity style={styles.nextButton} onPress={() => {
                    if(currentStep<5) setCurrentStep(currentStep+1);
                    else props.navigation.navigate('Login');
                    }}>
                    <Text style={styles.nextButtonText}>{'<'} بعدی</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.prevButton} onPress={() => {if(currentStep>0) setCurrentStep(currentStep-1)}}>
                    <Text style={styles.prevButtonText}>قبلی {'>'}</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => {props.navigation.navigate('Login');}}>
                <Icon style={styles.closeButtonText} name="times" />
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
    control: {
        flexDirection: 'row-reverse',
        height: 60,
    },
    nextButton: {
        flex: 1,
    },
    nextButtonText: {
        textAlign: 'center',
        fontFamily: 'iransans',
        fontSize: 18,
        color: colors.white,
    },
    prevButton: {
        flex: 1,
    },
    prevButtonText: {
        textAlign: 'center',
        fontFamily: 'iransans',
        fontSize: 18,
        color: colors.white,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    closeButtonText: {
        fontSize: 18,
        color: colors.red,
        padding: 4
    },
});

export default Intro;

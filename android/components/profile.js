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
const {saveData, readData, readFiles, readBookmark, saveBookmark} = require('../config/save');
var { convertDate } = require('../config/dateConvert');

const Profile = (props) => {
    var [estate, setEstate] = useState({});
    var [readOnce, setReadOnce] = useState(false);
    var [planName, setPlanName] = useState('');
    var [planImage, setPlanImage] = useState('');
    var [planAreas, setPlanAreas] = useState('');
    var [planDate, setPlanDate] = useState('');
    var [planRemaining, setPlanRemaining] = useState('');
    var [hasPlan, setHasPlan] = useState(false);
    useEffect(() => {
        if(!readOnce){
            readData().then(data => {
                if(data != null) {
                    api.get(`/api-mobile/login?username=${data.estate.code}&password=${data.estate.password}`)
                        .then(res => {
                            if(res.data.correct == true){
                                estate = res.data.estate;
                                setEstate(estate);
                                console.log(estate);
                                setPlanName(estate.planType);
                                if(estate.planType == '1 ماهه') setPlanImage(require('../assets/bronze.png'));
                                if(estate.planType == '3 ماهه') setPlanImage(require('../assets/silver.png'));
                                if(estate.planType == '6 ماهه') setPlanImage(require('../assets/gold.png'));
                                if(estate.planType == '1 ساله') setPlanImage(require('../assets/diamond.png'));
                                planAreas = '';
                                for(var i=0; i<estate.selectedareas.length-1; i++){
                                    planAreas += estate.selectedareas[i] + ', ';
                                }
                                planAreas += estate.selectedareas[estate.selectedareas.length-1];
                                setPlanAreas(planAreas);
                                var payDate = new Date(estate.payDate).getTime();
                                var now = (new Date()).getTime();
                                var endDate = 0;
                                if(data.estate.planType == 'trial')  endDate = payDate + 3 * 24 * 60 * 60 * 1000;
                                if(data.estate.planType == '1 ماهه') endDate = payDate + 1 * 30 * 24 * 60 * 60 * 1000;
                                if(data.estate.planType == '3 ماهه') endDate = payDate + 3 * 30 * 24 * 60 * 60 * 1000;
                                if(data.estate.planType == '6 ماهه') endDate = payDate + 6 * 30 * 24 * 60 * 60 * 1000;
                                if(data.estate.planType == '1 ساله') endDate = payDate + 12 * 30 * 24 * 60 * 60 * 1000;
                                if(endDate > now) setHasPlan(true);
                                setPlanRemaining(Math.floor((endDate - now)/(1000*60*60*24)));
                                setPlanDate(convertDate(new Date(endDate)));
                                saveData({estate});
                            }
                            else{
                                alert('کد اشتراک یا کلمه عبور صحیح نیست')
                            }
                        }).catch(err => {
                            alert('عدم اتصال به اینترنت')
                        })
                }
            }).catch(err => console.log(err));
            readOnce = true;
            setReadOnce(true);
        }
    });
    return (
        <View style={styles.container}>
            <View style={styles.topBlueView}>
                <View style={styles.iconContainer}>
                    <Icon style={styles.userIcon} name="user" />
                </View>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.username}>{estate.code}</Text>
                <View style={styles.infoTextView}>
                    <Icon style={styles.iconIcon} name="user" />
                    <Text style={styles.infoText}>{estate.name}</Text>
                </View>
                <View style={styles.infoTextView}>
                    <Icon style={styles.iconIcon} name="map-marker" />
                    <Text style={styles.infoText}>{estate.address}</Text>
                </View>
                <View style={styles.infoTextView}>
                    <Icon style={styles.iconIcon} name="dollar" />
                    <Text style={styles.infoText}>اشتراک‌های فعال:</Text>
                </View>
            </View>
            <View style={[styles.plansViewContainer, {display: hasPlan == true ? 'flex' : 'none'}]}>
                <View style={styles.planView}>
                    <Image style={styles.planImage} source={planImage} />
                    <Text style={styles.planTitle} >اشتراک {planName}</Text>
                    <Text style={styles.planItem} >منطقه {planAreas}</Text>
                    <Text style={styles.planItem} >تاریخ انقضا: {planDate}</Text>
                    <Text style={styles.planItem} >{planRemaining} تا پایان اشتراک</Text>
                </View>
            </View>
            <TouchableOpacity style={[styles.controlButton, {display: estate.role == 'admin' ? 'flex' : 'none'}]} onPress={() => {props.navigation.navigate('UserControl')}}>
                <Text style={[styles.controlButtonText]}>مدیریت کاربران</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    topBlueView: {
        backgroundColor: colors.darkblue,
        width: '100%',
        height: 120,
        alignItems: 'center',
        alignContent: 'center',
    },
    userIcon: {
        backgroundColor: colors.white,
        width: 120,
        // height: 130,
        paddingTop: 25,
        paddingBottom: 35,
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 60,
        borderRadius: 100,
    },
    iconContainer: {
        position: 'absolute',
        bottom: -50,
    },
    infoContainer: {
        // backgroundColor: colors.file2,
        width: '90%',
        marginHorizontal: '5%',
        marginTop: 52,
    },
    username: {
        textAlign: 'center',
        fontFamily: 'iransans',
        fontSize: 25,
        // fontWeight: 'bold',
        color: colors.blue,
    },
    infoTextView: {
        flexDirection: 'row-reverse',
        marginTop: 10,
    },
    infoText: {
        textAlign: 'right',
        fontFamily: 'iransans',
        fontSize: 18,
        color: colors.lightDark,
        width: '90%',
    },
    iconIcon: {
        paddingLeft: 20,
        fontFamily: 'iransans',
        fontSize: 25,
        color: colors.blue,
    },
    plansViewContainer: {
        width: '90%',
        marginHorizontal: '5%',
        marginTop: 20,
    },
    planView: {
        backgroundColor: colors.white,
        borderRadius: 10,
        width: '80%',
        marginHorizontal: '10%',
        position: 'relative',
        paddingBottom: 30,
        marginBottom: 50,
    },
    planImage: {
        position: 'absolute',
        width: 30,
        resizeMode: 'stretch',
        height: 100,
        left: 20,
    },
    planTitle: {
        fontFamily: 'iransans',
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 20,
        paddingVertical: 25,
    },
    planItem: {
        fontFamily: 'iransans',
        fontSize: 18,
        paddingHorizontal: 20,
        paddingVertical: 3,
    },
    controlButton: {
        backgroundColor: colors.darkblue,
        borderRadius: 10,
        marginTop: 20,
        width: '80%',
        marginHorizontal: '10%',
    },
    controlButtonText: {
        color: colors.white,
        paddingVertical: 10,
        textAlign: 'center',
        fontFamily: 'iransans',
        fontSize: 18,
    },
});

export default Profile;
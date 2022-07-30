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

const Profile = (props) => {
    var [estate, setEstate] = useState({});
    var [readOnce, setReadOnce] = useState(false);
    useEffect(() => {
        if(!readOnce){
            readData().then(data => {
                if(data != null) {
                    setEstate(data.estate);
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
            <View style={styles.plansViewContainer}>
                <View style={styles.planView}>
                    <Image style={styles.planImage} source={require('../assets/gold.png')} />
                    <Text style={styles.planTitle} >اشتراک شش ماهه</Text>
                    <Text style={styles.planItem} >منطقه 22</Text>
                    <Text style={styles.planItem} >تاریخ انقضا: 1401/7/2</Text>
                    <Text style={styles.planItem} >3 ماه و 2 روز تا پایان اشتراک</Text>
                </View>
            </View>
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
});

export default Profile;
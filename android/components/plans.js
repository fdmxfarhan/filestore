import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    FlatList,
    Image,
  Linking,
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
const {saveData, readData} = require('../config/save');

const Plans = ({navigation, enabled, setEnabled}) => {
    var [readOnce, setReadOnce] = useState(false);
    var [plans, setPlans] = useState([
        {_id: 0, name: 'یک ماهه', image: require('../assets/bronze.png'), fullPrice: '170 هزار تومان', price: '170 هزار تومان'},
        {_id: 1, name: 'سه ماهه', image: require('../assets/silver.png'), fullPrice: '510 هزار تومان', price: '470 هزار تومان'},
        {_id: 2, name: 'شش ماهه', image: require('../assets/gold.png'),   fullPrice: '1 میلیون و 20 هزار تومان', price: '816 هزار تومان'},
        {_id: 3, name: 'یک ساله', image: require('../assets/diamond.png'),fullPrice: '2 میلیون و 40 هزار تومان', price: '1 میلیون و 428 هزار تومان'},
    ]);
    useEffect(() => {
        if(!readOnce){
            api.get(`/api-mobile/get-settings`)
                .then(res => {
                    plans[0].fullPrice = data.settings.oneMonthFullText;
                    plans[1].fullPrice = data.settings.threeMonthFullText;
                    plans[2].fullPrice = data.settings.sixMonthFullText;
                    plans[3].fullPrice = data.settings.oneYearFullText;
                    plans[0].price = data.settings.oneMonthText;
                    plans[1].price = data.settings.threeMonthText;
                    plans[2].price = data.settings.sixMonthText;
                    plans[3].price = data.settings.oneYearText;
                    setPlans(plans);
                }).catch(err => {console.log(err)});

            setReadOnce(true);
            readOnce = true;
        }
    })
    if(enabled){
        return(
            <View style={styles.modal}>
                <View style={styles.popup}>
                    <Text style={styles.planTitle}>خرید اشتراک</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setEnabled(false)}><Icon style={styles.closeButtonText} name='times' /></TouchableOpacity>
                    <FlatList data={plans} inverted={true} horizontal={true} renderItem={({item}) => {
                        return(
                            <View style={styles.plan}>
                                <Image style={styles.planImage} source={item.image}/>
                                <Text style={styles.planName}>{item.name}</Text>
                                <Text style={styles.planFullPrice}>{item.fullPrice}</Text>
                                <Text style={styles.planPrice}>{item.price}</Text>
                                <View style={styles.planItem}><Icon style={styles.planItemIcon} name='check'/><Text style={styles.planItemText}> دسترسی به فایل‌های منطقه </Text></View>
                                <View style={styles.planItem}><Icon style={styles.planItemIcon} name='check'/><Text style={styles.planItemText}> جستجوی پیشرفته </Text></View>
                                <View style={styles.planItem}><Icon style={styles.planItemIcon} name='check'/><Text style={styles.planItemText}> ذخیره سازی اطلاعات </Text></View>
                                <View style={styles.planItem}><Icon style={styles.planItemIcon} name='check'/><Text style={styles.planItemText}> پشتیبانی </Text></View>
                                <View style={styles.planItem}><Icon style={styles.planItemIcon} name='check'/><Text style={styles.planItemText}> پرینت </Text></View>
                                <View style={styles.planItem}><Icon style={styles.planItemIcon} name='check'/><Text style={styles.planItemText}> دسته بندی فایل‌ها </Text></View>
                                <TouchableOpacity style={styles.buyButton} onPress={() => {
                                    readData().then((data) => {
                                        if(data != null){
                                            Linking.openURL(`https://fileestore.ir/api-mobile/pay-estate?username=${data.estate.code}&password=${data.estate.password}&plan=${item._id}`)
                                        }
                                    });
                                }}>
                                    <Text style={styles.buyButtonText}>خرید اشتراک</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }}/>
                </View>
            </View>
        );
    }else{return(<View></View>)}
}

const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
        backgroundColor: colors.modal,
    },
    popup: {
        backgroundColor: colors.white,
        marginTop: 150,
        width: '90%',
        marginHorizontal: '5%',
        padding: 20,
        borderRadius: 10,
        position: 'relative',
    },
    planTitle: {
        color: colors.gray,
        fontFamily: 'iransans', 
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center',

    },
    plan: {
        position: 'relative',
        width: 250,
        marginVertical: 30,
        marginLeft: 20,
        borderColor: colors.lightgray,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
    },
    planImage: {
        position: 'absolute',
        width: 30,
        height: 100,
        resizeMode: 'stretch',
        left: 10,
    },
    planName: {
        fontFamily: 'iransans',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    planFullPrice: {
        textDecorationLine: 'line-through',
        color: colors.gray,
        fontFamily: 'iransans',
        fontSize: 17,
        textAlign: 'center',
        marginTop: 10,
    },
    planPrice: {
        textDecorationLine: 'line-through',
        color: colors.green,
        fontWeight: 'bold',
        fontFamily: 'iransans',
        fontSize: 17,
        textAlign: 'center',
        marginBottom: 10,
    },
    planItem: {
        flexDirection: 'row-reverse',
    },
    buyButton: {
        backgroundColor: colors.darkblue,
        borderRadius: 10,
        marginTop: 20,
    },
    buyButtonText: {
        fontFamily: 'iransans',
        fontSize: 18,
        color: colors.white,
        paddingVertical: 10,
        textAlign: 'center',
    },
    planItemIcon: {
        color: colors.green,
        fontSize: 16,
    },
    planItemText: {
        fontFamily: 'iransans',
        fontSize: 16,

    },
    closeButton: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    closeButtonText: {
        fontSize: 18,
        color: colors.red,
    },
});

export default Plans;
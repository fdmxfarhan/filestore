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
import SelectArea from './selectArea';
import SelectNumOfUsers from './selectNumOfUsers';
import PaymentInfo from './paymentInfo';
const {saveData, readData} = require('../config/save');

const Plans = ({navigation, enabled, setEnabled}) => {
    var [readOnce, setReadOnce] = useState(false);
    var [selectedAreas, setSelectedAreas] = useState([]);
    var [planusernum, setPlanusernum] = useState(1);
    var [selectedPlan, setSelectedPlan] = useState(null);
    var [paymentInfo, setPaymentInfo] = useState({fullprice: 0, discount: 0, payable: 0});
    var [oneMonthPrice, setoneMonthPrice] = useState(0);
    var [threeMonthPrice, setthreeMonthPrice] = useState(0);
    var [sixMonthPrice, setsixMonthPrice] = useState(0);
    var [oneYearPrice, setoneYearPrice] = useState(0);
    var [discountPerUser1, setdiscountPerUser1] = useState(0);
    var [discountPerUser2, setdiscountPerUser2] = useState(0);
    var [discountPerUser3, setdiscountPerUser3] = useState(0);
    var [discountPerUser4, setdiscountPerUser4] = useState(0);
    var [plans, setPlans] = useState([
        {_id: 0, name: 'یک ماهه', image: require('../assets/bronze.png'), fullPrice: '- هزار تومان', price: '- هزار تومان'},
        {_id: 1, name: 'سه ماهه', image: require('../assets/silver.png'), fullPrice: '- هزار تومان', price: '- هزار تومان'},
        {_id: 2, name: 'شش ماهه', image: require('../assets/gold.png'),   fullPrice: '- هزار تومان', price: '- هزار تومان'},
        {_id: 3, name: 'یک ساله', image: require('../assets/diamond.png'),fullPrice: '- هزار تومان', price: '- هزار تومان'},
    ]);
    var updatePaymentInfo = () => {
        if(selectedPlan == null) return;
        var paymentFullPrice = 0;
        var paymentDiscount = 0; 
        var paymentPayable = 0;
        if(selectedPlan == 0) paymentFullPrice = oneMonthPrice;
        if(selectedPlan == 1) paymentFullPrice = threeMonthPrice;
        if(selectedPlan == 2) paymentFullPrice = sixMonthPrice;
        if(selectedPlan == 3) paymentFullPrice = oneYearPrice;
        paymentFullPrice += (planusernum - 1) * 8000;
        paymentFullPrice *= selectedAreas.length;
        if(selectedPlan == 0) paymentDiscount = discountPerUser1 * paymentFullPrice * (planusernum - 1);
        if(selectedPlan == 1) paymentDiscount = discountPerUser2 * paymentFullPrice * (planusernum - 1);
        if(selectedPlan == 2) paymentDiscount = discountPerUser3 * paymentFullPrice * (planusernum - 1);
        if(selectedPlan == 3) paymentDiscount = discountPerUser4 * paymentFullPrice * (planusernum - 1);
        paymentPayable = paymentFullPrice - paymentDiscount;
        setPaymentInfo({
            fullprice: paymentFullPrice, 
            discount: paymentDiscount, 
            payable: paymentPayable,
        })
    }
    var payButtonHandler = () => {
        readData().then(data => {
            // Linking.openURL(`https://fileestore.ir/api-mobile/pay-estate2?username=${data.estate.code}&password=${data.estate.password}&plan=${selectedPlan}&paymentfullprice=${paymentInfo.fullprice}&paymentdiscount=${paymentInfo.discount}&paymentpayable=${paymentInfo.payable}&selectedareas=${selectedAreas}&planusernum=${planusernum}`)
            Linking.openURL(`http://192.168.56.148:3000/api-mobile/pay-estate2?username=${data.estate.code}&password=${data.estate.password}&plan=${selectedPlan}&paymentfullprice=${paymentInfo.fullprice}&paymentdiscount=${paymentInfo.discount}&paymentpayable=${paymentInfo.payable}&selectedareas=${selectedAreas}&planusernum=${planusernum}`)
        }).catch(err => console.log(err));
    }
    useEffect(() => {
        if(!readOnce){
            api.get(`/api-mobile/get-settings`)
                .then(res => {
                    plans[0].fullPrice = res.data.settings.oneMonthFullText;
                    plans[1].fullPrice = res.data.settings.threeMonthFullText;
                    plans[2].fullPrice = res.data.settings.sixMonthFullText;
                    plans[3].fullPrice = res.data.settings.oneYearFullText;
                    plans[0].price = res.data.settings.oneMonthText;
                    plans[1].price = res.data.settings.threeMonthText;
                    plans[2].price = res.data.settings.sixMonthText;
                    plans[3].price = res.data.settings.oneYearText;
                    setoneMonthPrice(res.data.settings.oneMonth);
                    setthreeMonthPrice(res.data.settings.threeMonth);
                    setsixMonthPrice(res.data.settings.sixMonth);
                    setoneYearPrice(res.data.settings.oneYear);
                    setdiscountPerUser1(res.data.settings.discountPerUser1);
                    setdiscountPerUser2(res.data.settings.discountPerUser2);
                    setdiscountPerUser3(res.data.settings.discountPerUser3);
                    setdiscountPerUser4(res.data.settings.discountPerUser4);
                    setPlans([...plans]);
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
                    <SelectArea selectedAreas={selectedAreas} setSelectedAreas={(data) => {
                        setSelectedAreas(data);
                        selectedAreas = data;
                        updatePaymentInfo();
                        }} />
                    <SelectNumOfUsers planusernum={planusernum} setPlanusernum={(data) => {
                        setPlanusernum(data);
                        planusernum = data;
                        updatePaymentInfo();
                        }}/>
                    <FlatList data={plans} inverted={true} horizontal={true} renderItem={({item}) => {
                        return(
                            <TouchableOpacity style={selectedPlan == item._id ? styles.planActive : styles.plan} onPress={() => {
                                    setSelectedPlan(item._id);
                                    selectedPlan = item._id;
                                    updatePaymentInfo();
                                }}>
                                <Image style={styles.planImage} source={item.image}/>
                                <Text style={selectedPlan == item._id ? styles.planNameActive : styles.planName}>{item.name}</Text>
                                {/* <Text style={styles.planFullPrice}>{item.fullPrice}</Text> */}
                                <Text style={styles.planPrice}>{item.price}</Text>
                                <View style={styles.planItem}><Icon style={styles.planItemIcon} name='check'/><Text style={selectedPlan == item._id ? styles.planItemTextActive : styles.planItemText}> دسترسی به فایل‌های منطقه </Text></View>
                                <View style={styles.planItem}><Icon style={styles.planItemIcon} name='check'/><Text style={selectedPlan == item._id ? styles.planItemTextActive : styles.planItemText}> جستجوی پیشرفته </Text></View>
                                <View style={styles.planItem}><Icon style={styles.planItemIcon} name='check'/><Text style={selectedPlan == item._id ? styles.planItemTextActive : styles.planItemText}> ذخیره سازی اطلاعات </Text></View>
                                <View style={styles.planItem}><Icon style={styles.planItemIcon} name='check'/><Text style={selectedPlan == item._id ? styles.planItemTextActive : styles.planItemText}> پشتیبانی </Text></View>
                                <View style={styles.planItem}><Icon style={styles.planItemIcon} name='check'/><Text style={selectedPlan == item._id ? styles.planItemTextActive : styles.planItemText}> پرینت </Text></View>
                                <View style={styles.planItem}><Icon style={styles.planItemIcon} name='check'/><Text style={selectedPlan == item._id ? styles.planItemTextActive : styles.planItemText}> دسته بندی فایل‌ها </Text></View>
                                {/* <TouchableOpacity style={styles.buyButton} onPress={() => {
                                    readData().then((data) => {
                                        if(data != null){
                                            Linking.openURL(`https://fileestore.ir/api-mobile/pay-estate?username=${data.estate.code}&password=${data.estate.password}&plan=${item._id}`)
                                        }
                                    });
                                }}>
                                    <Text style={styles.buyButtonText}>خرید اشتراک</Text>
                                </TouchableOpacity> */}

                            </TouchableOpacity>
                        )
                    }}/>
                    <PaymentInfo paymentInfo={paymentInfo}/>
                    <TouchableOpacity style={styles.payButton2} onPress={payButtonHandler}>
                        <Text style={styles.payButtonText2}>پرداخت</Text>
                    </TouchableOpacity>
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
        marginTop: 50,
        width: '90%',
        marginHorizontal: '5%',
        padding: 20,
        borderRadius: 10,
        position: 'relative',
    },
    planTitle: {
        color: colors.darkblue,
        fontFamily: 'iransansbold', 
        fontSize: 17,
        // fontWeight: 'bold',
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
    planActive: {
        backgroundColor: colors.darkblue,
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
        fontSize: 23,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    planNameActive: {
        fontFamily: 'iransans',
        fontSize: 23,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: colors.white,
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
        // textDecorationLine: 'line-through',
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
    payButton2: {
        backgroundColor: colors.darkblue,
        borderRadius: 10,
        marginTop: 20,
    },
    payButtonText2: {
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
    planItemTextActive: {
        fontFamily: 'iransans',
        fontSize: 16,
        color: colors.white,
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
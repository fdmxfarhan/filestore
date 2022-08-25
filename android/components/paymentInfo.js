import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    FlatList,
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
var { getPrice, showPrice } = require('../config/dateConvert');

const PaymentInfo = ({navigation, paymentInfo}) => {
    var [readOnce, setReadOnce] = useState(false);
    useEffect(() => {
        if(!readOnce){
            readOnce = true;
            setReadOnce(true);
        }
    });
    return (
        <View style={styles.container}>
            <View style={styles.item}>
                <Text style={styles.itemTitle}>مبلغ کل:</Text>
                <Text style={[styles.itemValue, {color: colors.gray}]}>{showPrice(paymentInfo.fullprice)}   تومان</Text>
            </View>

            <View style={styles.item}>
                <Text style={styles.itemTitle}>تخفیف:</Text>
                <Text style={[styles.itemValue, {color: colors.blue}]}>{showPrice(paymentInfo.discount)}   تومان</Text>
            </View>

            <View style={styles.item}>
                <Text style={styles.itemTitle}>قابل پرداخت:</Text>
                <Text style={[styles.itemValue, {color: colors.green}]}>{showPrice(paymentInfo.payable)}   تومان</Text>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    item: {
        flexDirection: 'row-reverse',
        alignContent: 'flex-start',
        alignItems: 'flex-start',
    },
    itemTitle: {
        fontFamily: 'iransans',
        fontSize: 17,
    },
    itemValue: {
        paddingRight: 10,
        fontSize: 17,
        fontWeight: 'bold',
    },
});

export default PaymentInfo;
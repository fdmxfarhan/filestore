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
import { getFileColor } from '../config/files';

const FileView1 = ({navigation, file}) => {
    return (
      <View style={[styles.container, {backgroundColor: getFileColor(file)}]}>
        <View style={styles.flexContainer}>
            <View style={styles.info}>
                <Text style={styles.title}>{file.type}، {file.meterage} متری، {file.buildAge} {file.buildAge == 'نوساز' ? '' : 'سال ساخت'}</Text>
                <Text style={styles.address}>آدرس: {file.address}</Text>
                <View style={styles.pricesContainer}>
                    <View style={styles.priceView}>
                        <Text style={styles.priceTitle}>قیمت متری: </Text>
                        <Text style={styles.priceValue}>{file.price}</Text>
                    </View>
                    <View style={styles.priceView}>
                        <Text style={styles.priceTitle}>قیمت کل: </Text>
                        <Text style={styles.priceValue}>{file.fullPrice}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.image}>
                <Icon style={styles.fileIcon} name='file-o' />
            </View>
        </View>
        <Text style={styles.fileDate}>{file.date}</Text>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        padding: 10, 
        borderRadius: 10,
        width: '90%',
        marginHorizontal: '5%',
        marginVertical: 5,
        position: 'relative',
    },
    fileDate: {
        position: 'absolute',
        bottom: 10,
        left: 10,
    },
    flexContainer: {
        writingDirection: 'rtl',
        textAlign: 'right',
        direction: 'rtl',
        flexDirection: 'row-reverse',
    },
    info: {
        flex: 8,
        textAlign: 'rihgt',
    },
    image: {
        flex: 1,
    },
    fileIcon: {
        fontSize: 20,
        paddingTop: 10,
        color: colors.blue,
    },
    title:{
        fontFamily: 'iransans',
        fontSize: 15,
        fontWeight: 'bold',
    },
    address: {
        fontFamily: 'iransans',
        fontSize: 15,
    },
    pricesContainer: {
        marginTop: 10,
        width: '100%',
        flexDirection: 'row-reverse',
    },
    priceView: {
        width: '100%',
        flexDirection: 'row-reverse',
        flex: 1,
    },
    priceTitle: {
        fontFamily: 'iransans',
        fontSize: 15,
        fontWeight: 'bold',
    },
    priceValue: {
        fontFamily: 'iransans',
        fontSize: 15,
        fontWeight: 'bold',
        color: 'green',
    },
});

export default FileView1;
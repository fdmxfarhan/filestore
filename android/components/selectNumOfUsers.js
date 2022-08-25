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

const SelectNumOfUsers = ({navigation, planusernum, setPlanusernum}) => {
    var [readOnce, setReadOnce] = useState(false);
    useEffect(() => {
        if(!readOnce){
            readOnce = true;
            setReadOnce(true);
        }
    });
    return (
        <View style={styles.container}>
            <Text style={styles.title}>تعداد کاربران:</Text>
            <View style={styles.listView}>
                <TouchableOpacity style={styles.minusButton} onPress={() => {
                    if(planusernum > 1 ) setPlanusernum(planusernum-1)
                    }}><Text style={styles.minusButtonText}>-</Text></TouchableOpacity>
                <Text style={styles.planusernum}>{planusernum}</Text>
                <TouchableOpacity style={styles.plusButton} onPress={() => {
                    if(planusernum < 24) setPlanusernum(planusernum+1)
                    }}><Text style={styles.plusButtonText}>+</Text></TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row-reverse',
        alignContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: 20,
    },
    title: {
        flex: 1,
        fontFamily: 'iransans',
        fontSize: 17,
    },
    listView: {
        flex: 2,
        flexDirection: 'row-reverse',
    },
    minusButton: {
        backgroundColor: colors.darkblue,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderColor: colors.darkblue,
        borderWidth: 1,
    },
    minusButtonText: {
        paddingHorizontal: 10,
        paddingVertical: 1,
        color: colors.white,
        fontSize: 20,
        width: 30,
        textAlign: 'center',
        fontFamily: 'iransans',
    },
    planusernum: {
        width: 40,
        textAlign: 'center',
        fontFamily: 'iransans',
        fontSize: 18,
        borderColor: colors.darkblue,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        paddingTop: 5,
    },
    plusButton: {
        backgroundColor: colors.darkblue,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderColor: colors.darkblue,
        borderWidth: 1,
    },
    plusButtonText: {
        paddingHorizontal: 10,
        paddingVertical: 1,
        color: colors.white,
        fontSize: 20,
        width: 30,
        fontFamily: 'iransans',
        textAlign: 'center',
    },
});

export default SelectNumOfUsers;
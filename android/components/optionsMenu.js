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
    TouchableWithoutFeedback,
    useColorScheme,
    View,
} from 'react-native';
import colors from '../components/colors';
import Icon from 'react-native-vector-icons/FontAwesome';

const OptionsMenu = ({navigation, data, enabled, setEnable}) => {
    if(enabled){
        return (
            <TouchableOpacity style={styles.modal} onPress={() => setEnable(false)}>
                <View style={styles.container}>
                    <FlatList 
                        data={data}
                        renderItem={({item}) => {
                            return(
                                <TouchableOpacity onPress={item.function} style={styles.button}>
                                    <Text style={styles.buttonText}>{item.title}</Text>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </View>
            </TouchableOpacity>
        );
    }else return(<View></View>)
}

const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        height: '100%',
        backgroundColor: colors.modal,
        zIndex: 10,
    },
    container: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: colors.white,
        width: '100%',
        paddingVertical: 50,
        shadowOffset: {width: 2, height: -4},  
        shadowColor: '#171717',  
        shadowOpacity: 0.2,  
        shadowRadius: 3,  
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    button: {
        paddingVertical: 15,
        marginHorizontal: '15%',
        fontFamily: 'iransans',
        fontSize: 18,
        borderBottomColor: colors.lightgray,
        borderBottomWidth: 1,
        textAlign: 'center',
    },
    buttonText: {
        fontFamily: 'iransans',
        textAlign: 'center',
        fontSize: 18,
    },
});

export default OptionsMenu;
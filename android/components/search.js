import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
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

const Search = ({navigation, setFiles, files}) => {
    var [proSearchHidden, setProSearchHidden] = useState('none');
    var [searchText, setSearchText] = useState('');
    var [minPrice1, setMinPrice1] = useState(0);
    var [maxPrice1, setMaxPrice1] = useState(-1);
    var [minPrice2, setMinPrice2] = useState(0);
    var [maxPrice2, setMaxPrice2] = useState(-1);
    var [minPrice3, setMinPrice3] = useState(0);
    var [maxPrice3, setMaxPrice3] = useState(-1);
    var [minPrice4, setMinPrice4] = useState(0);
    var [maxPrice4, setMaxPrice5] = useState(-1);
    const slideAnim = useRef(new Animated.Value(0)).current;
    var slideDown = () => {
        setProSearchHidden('flex');
        Animated.timing(
            slideAnim,
            {
                toValue: 230,
                duration: 500,
                useNativeDriver: false,
            }
        ).start();
    }
    var slideUp = () => {
        Animated.timing(
            slideAnim,
            {
                toValue: 0,
                duration: 500,
                useNativeDriver: false,
            }
        ).start();
        setTimeout(() => {
            setProSearchHidden('none');
        }, 400);
    }
    var checkFile = (file) => {
        if(file.address    && file.address.toString().indexOf(searchText)    != -1) return true;
        if(file.ownerName  && file.ownerName.toString().indexOf(searchText)  != -1) return true;
        if(file.phone      && file.phone.toString().indexOf(searchText)      != -1) return true;
        if(file.fileNumber && file.fileNumber.toString().indexOf(searchText) != -1) return true;
        if(file.metrage    && file.metrage.toString().indexOf(searchText)    != -1) return true;
        return false;
    }
    var checkFilters = (file) => {
        if(!file.price) file.price = 0;
        if(!file.fullPrice) file.fullPrice = 0;
        if(file.state == 'رهن و اجاره' || file.state == 'رهن کامل'){
            if(file.price >= minPrice3 && (maxPrice3 == -1 || file.price < maxPrice3)) 
                if(file.fullPrice >= minPrice4 && (maxPrice4 == -1 || file.fullPrice < maxPrice4)) 
                    return true;
        }else{
            if(file.price >= minPrice1 && (maxPrice1 == -1 || file.price < maxPrice1)) 
                if(file.fullPrice >= minPrice2 && (maxPrice2 == -1 || file.fullPrice < maxPrice2)) 
                    return true;
        }
        return false;
    }
    var searchFiles = () => {
        
        slideUp();
        var showingFiles = [];
        for (let i = 0; i < files.length; i++) {
            if(checkFile(files[i]) && checkFilters(files[i])) 
                showingFiles.push(files[i]);
        }
        setFiles(showingFiles);
    }
    return (
        <View>
            <View style={styles.searchView}>
                <TextInput
                    // secureTextEntry={secureTextEntry}
                    style={[styles.textInput]}
                    placeholder={'جستجو ...'}
                    onChange={(text) => {
                        setSearchText(text.nativeEvent.text)
                    }}
                    onFocus={() => {
                        // setProSearchHidden('flex')
                        slideDown();
                    }}
                    // onBlur={() => {setProSearchHidden('none')}}
                    // blurOnSubmit={blurOnSubmit}
                    // returnKeyType={returnKeyType}
                    onSubmitEditing={() =>{
                        // setProSearchHidden('none')
                        searchFiles();
                    }}
                    // ref={refrence}
                    // keyboardType={keyboardType}
                />
                <TouchableOpacity style={styles.searchButton} onPress={() => {searchFiles();}}>
                    {/* <Text style={styles.searchIcon}>جستجوی پیشرفته</Text> */}
                    <Icon style={styles.searchIcon} name='search'/>
                </TouchableOpacity>
            </View>
            <Animated.View style={[styles.proSearch, {height: slideAnim, display: proSearchHidden}]}>
                <View style={styles.proSearchField}>
                    <Text style={styles.proSearchText}>قیمت متری:</Text>
                    <TextInput 
                        style={[styles.proTextInput]}
                        placeholder={'0'}
                        keyboardType={'number-pad'}
                        onSubmitEditing={() => {searchFiles();}}
                        onChange={(text) => {
                            if(text.nativeEvent.text == '') setMinPrice1(0);
                            else setMinPrice1(parseInt(text.nativeEvent.text));
                        }}/>
                    <Text style={styles.proSearchText2}>تا</Text>
                    <TextInput 
                        style={[styles.proTextInput]}
                        placeholder={'بینهایت'}
                        keyboardType={'number-pad'}
                        onSubmitEditing={() => {searchFiles();}}
                        onChange={(text) => {
                            if(text.nativeEvent.text == '') setMaxPrice1(-1);
                            else setMaxPrice1(parseInt(text.nativeEvent.text));
                        }}/>
                    <Text style={styles.proSearchText2}>تومان</Text>
                </View>
                <View style={styles.proSearchField}>
                    <Text style={styles.proSearchText}>قیمت کل:</Text>
                    <TextInput 
                        style={[styles.proTextInput]}
                        placeholder={'0'}
                        keyboardType={'number-pad'}
                        onSubmitEditing={() => {searchFiles();}}
                        onChange={(text) => {
                            if(text.nativeEvent.text == '') setMinPrice2(0);
                            else setMinPrice2(parseInt(text.nativeEvent.text));
                        }}/>
                    <Text style={styles.proSearchText2}>تا</Text>
                    <TextInput 
                        style={[styles.proTextInput]}
                        placeholder={'بینهایت'}
                        keyboardType={'number-pad'}
                        onSubmitEditing={() => {searchFiles();}}
                        onChange={(text) => {
                            if(text.nativeEvent.text == '') setMaxPrice2(-1);
                            else setMaxPrice2(parseInt(text.nativeEvent.text));
                        }}/>
                    <Text style={styles.proSearchText2}>تومان</Text>
                </View>
                <View style={styles.proSearchField}>
                    <Text style={styles.proSearchText}>قیمت رهن:</Text>
                    <TextInput 
                        style={[styles.proTextInput]}
                        placeholder={'0'}
                        keyboardType={'number-pad'}
                        onSubmitEditing={() => {searchFiles();}}
                        onChange={(text) => {
                            if(text.nativeEvent.text == '') setMinPrice3(0);
                            else setMinPrice3(parseInt(text.nativeEvent.text));
                        }}/>
                    <Text style={styles.proSearchText2}>تا</Text>
                    <TextInput 
                        style={[styles.proTextInput]}
                        placeholder={'بینهایت'}
                        keyboardType={'number-pad'}
                        onSubmitEditing={() => {searchFiles();}}
                        onChange={(text) => {
                            if(text.nativeEvent.text == '') setMaxPrice3(-1);
                            else setMaxPrice3(parseInt(text.nativeEvent.text));
                        }}/>
                    <Text style={styles.proSearchText2}>تومان</Text>
                </View>
                <View style={styles.proSearchField}>
                    <Text style={styles.proSearchText}>قیمت اجاره:</Text>
                    <TextInput 
                        style={[styles.proTextInput]}
                        placeholder={'0'}
                        keyboardType={'number-pad'}
                        onSubmitEditing={() => {searchFiles();}}
                        onChange={(text) => {
                            if(text.nativeEvent.text == '') setMinPrice4(0);
                            else setMinPrice4(parseInt(text.nativeEvent.text));
                        }}/>
                    <Text style={styles.proSearchText2}>تا</Text>
                    <TextInput 
                        style={[styles.proTextInput]}
                        placeholder={'بینهایت'}
                        keyboardType={'number-pad'}
                        onSubmitEditing={() => {searchFiles();}}
                        onChange={(text) => {
                            if(text.nativeEvent.text == '') setMaxPrice4(-1);
                            else setMaxPrice4(parseInt(text.nativeEvent.text));
                        }}/>
                    <Text style={styles.proSearchText2}>تومان</Text>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    searchView: {
        writingDirection: 'rtl',
        textAlign: 'right',
        direction: 'rtl',
        width: '90%',
        paddingHorizontal: '4%',
        marginHorizontal: '5%',
        backgroundColor: colors.white,
        borderRadius: 20,
        marginTop: 20,
        flexDirection: 'row-reverse',
    },
    textInput:{
        flex: 10,
        fontFamily: 'iransans',
        borderBottomWidth: 2,
        textAlign: 'right',
        borderWidth: 0,
        borderBottomWidth: 0,
        paddingVertical: 8,
        fontSize: 16,
    },
    searchButton: {
        flex: 1,
        textAlign: 'center',
    },
    searchIcon: {
        fontSize: 19,
        paddingTop: 10,
        color: colors.gray,
    },
    proSearch: {
        // height: 230,
    },
    proSearchField: {
        flexDirection: 'row-reverse',
        marginTop: 20,
        width: '95%',
    },
    proTextInput: {
        backgroundColor: colors.white,
        paddingVertical: 3,
        textAlign: 'center',
        paddingHorizontal: 5,
        width: '25%',
        borderRadius: 10,
    },
    proSearchText: {
        fontFamily: 'iransans',
        fontSize: 17,
        paddingVertical: 3,
        paddingHorizontal: 6,
        width: '27%',
    },
    proSearchText2: {
        fontFamily: 'iransans',
        fontSize: 17,
        paddingVertical: 3,
        paddingHorizontal: 6,
    },
});

export default Search;
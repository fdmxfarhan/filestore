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

const SelectArea = ({navigation, selectedAreas, setSelectedAreas}) => {
    var [areas, setAreas] = useState([]);
    var [readOnce, setReadOnce] = useState(false);
    useEffect(() => {
        if(!readOnce){
            api.get(`/api-mobile/get-settings`)
                .then(res => {
                    areas = [];
                    for(var i=0; i<res.data.settings.areas.length; i++){
                        areas.push({name: res.data.settings.areas[i], id: i});
                    }
                    setAreas([...areas]);
                }).catch(err => {

                })
            readOnce = true;
            setReadOnce(true);
        }
    });
    return (
        <View style={styles.container}>
            <Text style={styles.title}>مناطق:</Text>
            <View style={styles.listView}>
                <FlatList
                    style={styles.flatListView}
                    data={areas}
                    horizontal={true}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => {
                        if(selectedAreas.indexOf(item.name) == -1){
                            return(
                                <TouchableOpacity style={styles.itemButton} onPress={() => {
                                    selectedAreas.push(item.name);
                                    setSelectedAreas([...selectedAreas])
                                }}>
                                    <Text style={styles.itemText}>منطقه {item.name}</Text>
                                </TouchableOpacity>
                            )
                        }
                        else {
                            return(
                                <TouchableOpacity style={styles.itemButtonActive} onPress={() => {
                                    for(var i=0; i<selectedAreas.length; i++){
                                        if(selectedAreas[i] == item.name){
                                            selectedAreas.splice(i, 1);
                                            setSelectedAreas([...selectedAreas])
                                            return;
                                        }
                                    }
                                }}>
                                    <Text style={styles.itemTextActive}>منطقه {item.name}</Text>
                                </TouchableOpacity>
                            )
                        }
                    }}/>
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
        flex: 5,
    },
    flatListView: {

    },
    itemButton: {
        backgroundColor: colors.white,
        borderRadius: 10,
        borderColor: colors.blue,
        borderWidth: 1,
        marginRight: 5,
    },
    itemText: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontFamily: 'iransans',
        fontSize: 15,
        color: colors.blue
    },
    itemButtonActive: {
        backgroundColor: colors.blue,
        borderRadius: 10,
        borderColor: colors.blue,
        borderWidth: 1,
        marginRight: 5,
    },
    itemTextActive: {
        color: colors.white,
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontFamily: 'iransans',
        fontSize: 15,
    },
});

export default SelectArea;
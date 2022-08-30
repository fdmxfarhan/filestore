import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    PermissionsAndroid,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../components/colors';
const {saveData, readData} = require('../config/save');


const UserControl = (props) => {    
    var [normalUsers, setNormalUsers] = useState([]);
    var [readOnce, setReadOnce] = useState(false);
    var updateList = () => {
        readData().then(data => {
            if(data != null) {
                api.get(`/api-mobile/get-normal-user?username=${data.estate.code}`)
                    .then(res => {
                        if(res.data.status == 'ok'){
                            setNormalUsers(res.data.normalUsers);
                        }
                    }).catch(err => {
                        alert('عدم اتصال به اینترنت')
                    })
            }
        }).catch(err => console.log(err));
    }
    useEffect(() => {
        if(!readOnce){
            updateList();
            readOnce = true;
            setReadOnce(true);
        }
    })
    return(
        <View style={styles.container}>
            <View style={styles.itemViewLable}>
                <Text style={styles.itemNameLable}>نام</Text>
                <Text style={styles.itemPermissionsViewLable}>دسترسی ها</Text>
                <Text style={styles.itemStatusLable}>وضعیت</Text>
                <Text style={styles.itemActionLable}>عملیات</Text>
            </View>
            <FlatList
                style={styles.flatListView}
                data={normalUsers}
                keyExtractor={e => e._id}
                renderItem={({item}) => {
                    return(
                        <View style={styles.itemView}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <View style={styles.itemPermissionsView}>
                                
                            </View>
                            <Text style={styles.itemStatus}>فعال</Text>
                            <TouchableOpacity style={styles.itemAction} onPress={() => {
                                api.get(`/api-mobile/delete-normal-user?userID=${item._id}`).then(res => {
                                    if(res.data.status == 'ok'){
                                        updateList();
                                    }
                                    else alert('خطایی رخ داده است');
                                }).catch(err => {
                                    alert('عدم اتصال به اینترنت')
                                })
                            }}>
                                <Icon style={styles.itemActionIcon} name={'trash'} />
                            </TouchableOpacity>
                        </View>
                    )
                }}
                />
            <TouchableOpacity style={styles.addButton} onPress={() => props.navigation.navigate('AddNormalUser')}>
                <Text style={styles.addButtonText}>+ افزودن کاربر جدید</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightBackground,
        alignContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    flatListView: {
        width: '100%',
    },
    itemView: {
        flexDirection: 'row-reverse',
        width: '90%',
        marginHorizontal: '5%',
        shadowColor: colors.modal,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 1,
        shadowRadius: 3.84,
        elevation: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 15,
        backgroundColor: colors.white,
        borderRadius: 3,
    },
    itemName: {
        flex: 4,
        fontFamily: 'iransans',
        fontSize: 16,
        textAlign: 'right',
    },
    itemPermissionsView: {
        flex: 6,
    },
    itemStatus: {
        flex: 1,
        fontFamily: 'iransans',
        fontSize: 16,
        color: colors.green,
    },
    itemAction: {
        flex: 1,
    },
    itemActionIcon: {
        color: colors.red,
        paddingTop: 2,
        fontSize: 17,
    },
    itemViewLable: {
        flexDirection: 'row-reverse',
        width: '90%',
        marginHorizontal: '5%',
        paddingHorizontal: 10,
        marginBottom: 15,
        borderRadius: 3,
        marginTop: 40,
    },
    itemNameLable: {
        flex: 3,
    },
    itemPermissionsViewLable: {
        flex: 4,
    },
    itemStatusLable: {
        flex: 1,
    },
    itemActionLable: {
        flex: 1,
    },
    addButton: {
        marginBottom: 30,
        backgroundColor: colors.darkblue,
        borderRadius: 10,
        marginTop: 20,
        width: '90%',
        marginHorizontal: '5%',
    },
    addButtonText: {
        color: colors.white,
        paddingVertical: 10,
        textAlign: 'center',
        fontFamily: 'iransans',
        fontSize: 18,
    },
});

export default UserControl;
import React, { useEffect, useState } from 'react';
import {
    Image,
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
import colors from '../components/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FileList from '../components/fileList';

const Tab = createBottomTabNavigator();

const FileScreen = (props) => {
    return (
      <View style={styles.container}>
        <FileList navigation={props.navigation}/>
      </View>
    );
}
const BookmarkScreen = (props) => {
    return (
      <View style={styles.container}>
        <Text>Bookmarks</Text>
      </View>
    );
}
const AddScreen = (props) => {
    return (
      <View style={styles.container}>
        <Text>Add</Text>
      </View>
    );
}
const ProfileScreen = (props) => {
    return (
      <View style={styles.container}>
        <Text>Profile</Text>
      </View>
    );
}

const Home = (props) => {    
    return(
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    if (route.name === 'Files')     return <Icon name={'file-o'} size={17} color={color}/>;
                    if (route.name === 'Bookmark')  return <Icon name={'bookmark-o'} size={17} color={color}/>;
                    if (route.name === 'Add')       return <Icon name={'plus'} size={17} color={color}/>;
                    if (route.name === 'Profile')   return <Icon name={'user-o'} size={17} color={color}/>;
                },
                tabBarActiveTintColor: colors.lightblue,
                tabBarInactiveTintColor: 'gray',
            })} initialRouteName={"Files"}>
            
            <Tab.Screen 
                name="Profile" 
                component={ProfileScreen} options={({route}) => ({
                    headerShown: false, 
                    title: 'پروفایل',
                    tabBarLabelStyle: styles.tabBar,
                })} />
            <Tab.Screen 
                name="Add" 
                component={AddScreen} options={({route}) => ({
                    headerShown: false, 
                    title: 'افزودن',
                    tabBarLabelStyle: styles.tabBar,
                })} />
            <Tab.Screen 
                name="Bookmark" 
                component={BookmarkScreen} options={({route}) => ({
                    headerShown: false, 
                    title: 'نشان شده',
                    tabBarLabelStyle: styles.tabBar,
                })} />
            <Tab.Screen 
                name="Files" 
                component={FileScreen} options={({route}) => ({
                    headerShown: false, 
                    title: 'فایل‌ها',
                    tabBarLabelStyle: styles.tabBar,
                })}/>
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.lightBackground,
        alignContent: 'center',
        alignItems: 'center',
    },
    tabBar:{
        fontFamily: 'iransans',
        fontSize: 14,
        padding: 0,
        margin: 0,
    }
});

export default Home;
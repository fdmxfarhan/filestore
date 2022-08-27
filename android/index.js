import React, { useEffect, useState } from 'react';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import colors from './components/colors';

import Splash from './screens/splash';
import Home from './screens/home';
import FileView from './screens/fileView';
import Login from './screens/login';
import Register from './screens/register';
import UserControl from './screens/userControl';

const App = (props) => {
    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                    name="Splash" 
                    component={Splash} 
                    options={({ route }) => ({ headerShown: false })}
                />
                <Stack.Screen 
                    name="Home" 
                    component={Home} 
                    options={({ route }) => ({ headerShown: false })}
                />
                <Stack.Screen 
                    name="FileView" 
                    component={FileView} 
                    options={({ route }) => ({ headerShown: false })}
                />
                <Stack.Screen 
                    name="Login" 
                    component={Login} 
                    options={({ route }) => ({ headerShown: false })}
                />
                <Stack.Screen 
                    name="Register" 
                    component={Register} 
                    options={({ route }) => ({ headerShown: false })}
                />
                <Stack.Screen 
                    name="UserControl" 
                    component={UserControl} 
                    options={({ route }) => ({ headerShown: false })}
                />
                
            </Stack.Navigator>
        </NavigationContainer>
    )
};
AppRegistry.registerComponent(appName, () => App);

import React, { useEffect, useState } from 'react';
import {
  FlatList,
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
import Search from './search';
import RefreshButton from './refreshButton';
import FileView1 from './fileView1';
import api from '../config/api';
import Loading from './loading';
import Filters from './filters';
import Plans from './plans';
const {saveData, readData, readFiles} = require('../config/save');

const FileList = ({navigation}) => {
  var [loading, setLoading] = useState(false);
  var [plansEnabled, setPlansEnabled] = useState(false);
  var [files, setFiles] = useState([]);
  var [showingFiles, setShowingFiles] = useState([]);
  var [showingFiles2, setShowingFiles2] = useState([]);
  var [readOnce, setReadOnce] = useState(false);
  useEffect(() => {
    if(!readOnce){
      setLoading(true);
      readFiles().then(data => {
        if(data != null) {
          setLoading(false);
          setFiles(data);
          setShowingFiles(data);
          setShowingFiles2(data);
        }
      }).catch(err => setLoading(false));
      setReadOnce(true);
      readOnce = true;
    }
  });
  return (
    <View style={styles.container}>
      <Search setFiles={setShowingFiles2} files={showingFiles} />
      <Filters files={files} showingFiles={showingFiles} setShowingFiles={(files) => {setShowingFiles(files); setShowingFiles2(files)}} setLoading={setLoading} />
      <FlatList
          // inverted={true}
          // horizontal={true}
          style={styles.flatList}
          data={showingFiles2}
          keyExtractor={item => item._id}
          renderItem={({item}) => {
            return(
              <TouchableOpacity onPress={() => {navigation.navigate("FileView", {file: item});}}>
                <FileView1 file={item}/>
              </TouchableOpacity>
            )
          }}
          />
      <RefreshButton setFunction={(data) => {setFiles(data); setShowingFiles(data); setShowingFiles2(data);}} setLoading={setLoading} setPlansEnabled={setPlansEnabled}/>
      <Loading visible={loading}/>
      <Plans enabled={plansEnabled} setEnabled={setPlansEnabled}/>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: colors.lightBackground,
        alignContent: 'center',
        alignItems: 'center',
    },
    tabBar:{
        fontFamily: 'iransans',
        fontSize: 14,
        padding: 0,
        margin: 0,
    },
    flatList: {
      width: '100%',
      marginTop: 0,
    }

});

export default FileList;
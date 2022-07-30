import AsyncStorage from '@react-native-async-storage/async-storage';
import Storage from 'react-native-storage';
var RNFS = require('react-native-fs');

const STORAGE_KEY = '@store_file'
const FILE_STORAGE_KEY = '@files'
const BOOKMARK_KEY = '@bookmark'
var path = RNFS.ExternalDirectoryPath + '/files.json';

// Login Data Save and Read
var saveData = async (data) => {
  try {await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data))} 
  catch (e) {console.log(e)}
}
const readData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY)
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {console.log(e)}
}

// Book Marks Save and Read
var saveBookmark = async (data) => {
  try {
    await AsyncStorage.setItem(BOOKMARK_KEY, JSON.stringify(data))
  } catch (e) {console.log(e)}
}
const readBookmark = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(BOOKMARK_KEY)
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {console.log(e)}
}

// File Data Save and Read
var saveFiles = (data) => {
  RNFS.writeFile(path, JSON.stringify(data), (err) => {
    if(err) console.log(err);
  });
}
const readFiles = async () => {
  const jsonValue = await RNFS.readFile(path);
  return jsonValue != null ? JSON.parse(jsonValue) : null;
}
module.exports = {saveData, readData, saveFiles, readFiles, saveBookmark, readBookmark};
import AsyncStorage from '@react-native-async-storage/async-storage';
import Storage from 'react-native-storage';
var RNFS = require('react-native-fs');

const STORAGE_KEY = '@store_file'
const FILE_STORAGE_KEY = '@files'
// var path = RNFS.DocumentDirectoryPath + '/files.json';
var path = RNFS.ExternalDirectoryPath + '/files.json';
console.log(path)
var saveData = async (data) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    // console.log('Data successfully saved');
  } catch (e) {
    // console.log('Failed to save data');
    console.log(e)
  }
}
const readData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY)
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e)
    }
}

var saveFiles = (data) => {
  RNFS.writeFile(path, JSON.stringify(data), (err) => {
    if(err) console.log(err);
  })
}
const readFiles = async () => {
  console.log('reading')
  const jsonValue = await RNFS.readFile(path);
  return jsonValue != null ? JSON.parse(jsonValue) : null;
}
module.exports = {saveData, readData, saveFiles, readFiles};
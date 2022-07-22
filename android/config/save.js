import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@store_file'
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

const STORAGE_KEY2 = '@store_notif'
var saveNotif = async (notif) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY2, JSON.stringify({data: notif}))
    // console.log('Data successfully saved');
  } catch (e) {
    // console.log('Failed to save data');
    console.log(e)
  }
}

var clearNotif = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY2, JSON.stringify({data: ''}))
    // console.log('Data successfully saved');
  } catch (e) {
    // console.log('Failed to save data');
    console.log(e)
  }
}


const readNotif = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY2)
      return jsonValue != null ? JSON.parse(jsonValue).data : null;
    } catch (e) {
      console.log(e)
    }
}

module.exports = {saveData, readData, saveNotif, readNotif, clearNotif};
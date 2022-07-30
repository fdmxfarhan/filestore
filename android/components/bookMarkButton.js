import React, { useEffect, useState } from 'react';
import {
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
import FileImage from '../components/fileImage';
var { getPrice, showPrice } = require('../config/dateConvert');
var { saveBookmark, readBookmark } = require('../config/save');

const BookMarkButton = ({navigation, file}) => {
    var [bookmarked, setBookmarked] = useState(false);
    var [readOnce, setReadOnce] = useState(false);
    useEffect(() => {
        if(!readOnce){
            readBookmark().then(bookmarks => {
                if(bookmarks != null){
                    for (let i = 0; i < bookmarks.length; i++) {
                        if(bookmarks[i]._id == file._id){
                            setBookmarked(true);
                            break;
                        }
                    }
                }else{
                    setBookmarked(false);
                }
            }).catch(err => {
                setBookmarked(false);
            })
            readOnce = true;
            setReadOnce(true);
        }
    })
    if(bookmarked){
        return (
            <TouchableOpacity style={styles.bookmarkBtn} onPress={() => {
                readBookmark().then(bookmarks => {
                    if(bookmarks != null){
                        for (let i = 0; i < bookmarks.length; i++) {
                            if(bookmarks[i]._id == file._id){
                                bookmarks.splice(i, 1);
                                saveBookmark(bookmarks);
                                break;
                            }
                        }
                    }
                }).catch(err => {
                    console.log(err);
                })
                setBookmarked(false);
            }}>
                <Icon style={styles.bookmarkIconActive} name='bookmark' />
            </TouchableOpacity>
        );
    }else{
        return (
            <TouchableOpacity style={styles.bookmarkBtn} onPress={() => {
                readBookmark().then(bookmarks => {
                    if(bookmarks != null){
                        bookmarks.push(file);
                        saveBookmark(bookmarks);
                    }else{
                        saveBookmark([file]);
                    }
                }).catch(err => {
                    console.log(err);
                })
                setBookmarked(true);
            }}>
                <Icon style={styles.bookmarkIcon} name='bookmark-o' />
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    bookmarkBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        borderRadius: 10,
        flexDirection: 'row',
    },
    bookmarkIcon: {
        color: colors.text,
        fontSize: 30,
        padding: 5,
    },
    bookmarkIconActive: {
        color: colors.yellow,
        fontSize: 30,
        padding: 5,
    },
});

export default BookMarkButton;

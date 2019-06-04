import React, { Component } from 'react';
import { Text, View } from 'react-native';
import {createStackNavigator as createStack , createAppContainer as routingContainer } from 'react-navigation';
import MovieDetails from './MovieDetails';
import NewHome from './NewHome';

const navigation = createStack({
    NewHome:{
        screen: NewHome,
        path: "/NewHome",
        headerMode:'none',
        navigationOptions:()=>({
            header:null,
            headerVisible: false,
            title:null,
            headerBackTitle: null
        })
    },
    MovieDetails:{
        screen: MovieDetails,
        path: "/MovieDetails",
        navigationOptions:()=>({
            title:'Movie Details',
            headerBackTitle: null,
            headerStyle:{
                backgroundColor: "#212121",
                borderBottomColor: "#E75252",
                borderBottomWidth: 1,
            },
            headerTintColor:"#fff"
        })
    },
})
export default routingContainer(navigation);
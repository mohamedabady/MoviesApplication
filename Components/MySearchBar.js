import React, { Component } from 'react'
import {Text, View, TextInput, TouchableOpacity} from 'react-native'

export default class MySearchBar extends Component {
    constructor(props){
        super(props);
        this.state={
            searchListShown:false
        }
    }
    render() {        
        return (
            <View style={{minHeight:150}}>
                <View style={{
                    flexDirection:"column",
                    justifyContent:"center",
                    alignItems:"center",
                    flex:1,
                    backgroundColor: "#212121",
                    height: 100,
                    marginBottom: 10,
                }}>
                    <Text style={{
                        fontSize:20,
                        fontWeight:"800",
                        color:"#fff",
                        textAlign:"center",
                        paddingHorizontal:30
                    }}>All the Movies and TV shows you love, Delivered</Text>
                </View>

                <View style={{
                    flexDirection:"row", 
                    borderBottomColor: "#E75252",
                    borderBottomWidth:1.5,
                    paddingHorizontal:10,
                }}>
                        <TextInput 
                        onChangeText={this.props.onChangeText}
                        value={this.props.value}
                        keyboardType="web-search"
                        underlineColorAndroid="transparent"
                        placeholder="Type something to search..."
                        pointerEvents="none"
                        clearTextOnFocus
                        onFocus={this.props.searchHistoryList}
                        style={{
                            height:40,
                            flex:3,
                            marginBottom:20,
                            backgroundColor:"#fff",
                            borderRadius:20,
                            marginRight:20
                        }}
                    />
                    {this.state.searchListShown && this.props.searchHistoryList()}
                    <TouchableOpacity onPress={this.props.onPress} style={{
                        flex:1,
                        backgroundColor: "#E75252",
                        borderRadius:20,
                        height:40,
                        justifyContent:"center",
                        alignItems:"center"
                    }}>
                    <Text style={{color:"#fff", fontSize:16, fontWeight:"400"}}>Search</Text>
                    </TouchableOpacity>
                </View>

                <View style={{
                    justifyContent:"center",
                    alignItems:"center"
                }}>
                    <Text style={{
                        fontSize:18,
                        color: "#FF0000",
                        fontWeight:"600"
                    }}>{this.props.searchResult}</Text>
                </View>
            </View>
        )        
    }
}

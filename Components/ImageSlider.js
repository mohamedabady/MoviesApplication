import React, { Component } from 'react'
import { View, Dimensions, ScrollView, Image} from 'react-native'

const{width}=Dimensions.get("window");

export default class ImageSlider extends Component {
    render() {
        return (
            <View>
                <ScrollView
                ref={(scrollView)=>{_scrollView= scrollView}}
                horizontal={true}
                pagingEnabled={true}
                >
                {this.props.images.map((image, index)=>
                    <Image
                    key={index}
                    source={{uri:"http://image.tmdb.org/t/p/w500"+image.file_path}}
                    resizeMode={this.props.imageResizeMode}                    
                    style={{
                        width:width-90, 
                        height:this.props.height,
                        marginLeft:30,
                        marginRight:30,
                        marginBottom:15,
                        marginTop:15,
                        shadowOpacity:1,
                        shadowColor: "#E75252",
                        shadowRadius:0,
                        shadowOffset: {
                            width:2,
                            height:2
                        },
                    }}
                    />
                )}
                </ScrollView>
            </View>
        )
    }
}

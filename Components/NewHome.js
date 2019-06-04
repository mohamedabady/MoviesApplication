import React, { Component } from "react";
import {
  FlatList,
  Dimensions,
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity
} from "react-native";
import { ListItem } from "react-native-elements";
import MySearchBar from "./MySearchBar";
import axios from "axios";

export default class NewHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResult: "",
      searchKey: "",
      searchedItem: "",
      data: [],
      loading: false,
      page: 1,
      error: null,
      refreshing: false,
      searchHistory: ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]
    };
  }
  renderSearchHistoryList = () => {
    return this.state.searchHistory.map((searchQuery, index) => {
      return (
        <TouchableOpacity key={index}>
          <Text>{searchQuery}</Text>
        </TouchableOpacity>
      );
    });
  };
  makeRemoteRequest = () => {
    const { page, searchKey, searchedItem } = this.state;
    if (searchKey === "") {
      this.setState({
        searchResult: "search query can not be empty !!!",
        data: [],
        searchKey: "",
        searchedItem: "",
        page: 1,
        loading: false,
        refreshing: false
      });
      return -1;
    }
    const url = `http://api.themoviedb.org/3/search/movie?api_key=b3070a5d3abfb7c241d2688d066914e7&query=${searchKey}&page=${page}`;
    this.setState({ loading: true });
    axios
      .get(url)
      .then(response => {
        if (
          response.data.results.length == 0 ||
          response.data.results === undefined
        ) {
          this.setState({
            searchResult: "No Results found !!!",
            data: [],
            searchKey: "",
            searchedItem: "",
            page: 1,
            loading: false,
            refreshing: false
          });
          return -1;
        }
        if (searchedItem === searchKey) {
          this.setState({
            data: [...this.state.data, ...response.data.results],
            searchResult: "",
            refreshing: false
          });
          return -1;
        }
        this.setState({
          data: response.data.results,
          searchResult: "",
          total_pages: response.data.total_pages,
          page: 1,
          searchedItem: this.state.searchKey,
          error: response.error || null,
          loading: false,
          refreshing: false
        });
      })
      .catch(response => {
        this.setState({
          error: response.error,
          loading: false
        });
      });
  };
  keyExtractor = (item, index) => index.toString();

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 0.5,
          backgroundColor: "#E75252",
          marginBottom: 15,
          marginTop: 5,
          marginLeft: 10,
          marginRight: 10
        }}
      />
    );
  };
  renderFooter = () => {
    if (!this.state.loading) return null;
    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopColor: "#000",
          borderTopWidth: 1
        }}
      >
        <ActivityIndicator animating size={"large"} />
      </View>
    );
  };
  handleChangeText = text => {
    this.setState({ searchKey: text });
  };
  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true,
        searchResult: ""
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };
  handleLoadMore = () => {
    if (this.state.page < this.state.total_pages) {
      this.setState(
        prevState => {
          return { page: prevState.page + 1 };
        },
        () => {
          this.makeRemoteRequest();
        }
      );
      return -1;
    }
  };
  navigateToMovieDetails = (id, title) => {
    this.props.navigation.navigate("MovieDetails", { id: id, title: title });
  };
  renderItem = ({ item }) => (
    <View>
      <ListItem
        containerStyle={{
          borderRadius: 3,
          borderWidth: 3,
          borderColor: "#fff",
          shadowColor: "#000",
          shadowOpacity: 0.6,
          shadowRadius: 3,
          shadowOffset: {
            width: 7,
            height: 6
          },
          marginBottom: 10,
          elevation: 1,
          height: 700,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
          marginHorizontal: 10,
          paddingHorizontal: 0
        }}
        contentContainerStyle={{
          maxHeight: 50,
          marginBottom: 10
        }}
        titleStyle={{
          fontSize: 20,
          fontWeight: "600",
          color: "#000",
          textAlign: "center"
        }}
        subtitleStyle={{
          fontSize: 16,
          fontWeight: "400",
          color: "#000",
          textAlign: "center"
        }}
        rightContentContainerStyle={{
          flexDirection: "column",
          justifyContent: "flex-start",
          maxHeight: 65,
          marginBottom: 10,
          overflow: "hidden"
        }}
        rightSubtitle={item.overview}
        title={item.title}
        subtitle={item.release_date}
        leftAvatar={{
          rounded: false,
          containerStyle: {
            height: 500,
            width: Dimensions.get("window").width - 25
          },
          source:
            item.poster_path != null
              ? { uri: "http://image.tmdb.org/t/p/w500" + item.poster_path }
              : require("../Images/no_poster.jpg")
        }}
      />

      <TouchableOpacity
        style={{
          borderWidth: 1.5,
          borderColor: "#E75252",
          borderRadius: 20,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 10
        }}
        onPress={() => {
          this.navigateToMovieDetails(item.id, item.title);
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: "#fff",
            fontWeight: "600"
          }}
        >
          Go to Movie
        </Text>
      </TouchableOpacity>
    </View>
  );
  render() {
    return (
      <FlatList
        data={this.state.data}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        ItemSeparatorComponent={this.renderSeparator}
        ListHeaderComponent={
          <MySearchBar
            onChangeText={this.handleChangeText}
            value={this.state.searchKey}
            onPress={this.makeRemoteRequest}
            searchResult={this.state.searchResult}
            searchHistoryList={this.renderSearchHistoryList}
          />
        }
        ListFooterComponent={this.renderFooter}
        refreshing={this.state.refreshing}
        onRefresh={this.handleRefresh}
        onEndReached={this.handleLoadMore}
        onEndReachedThreshold={2}
        style={{
          backgroundColor: "#212121",
          backfaceVisibility: "visible"
        }}
      />
    );
  }
}

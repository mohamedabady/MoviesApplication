import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Linking,
  TouchableOpacity,
  RefreshControl
} from "react-native";
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";
import ImageSlider from "./ImageSlider";
import { Icon } from "react-native-elements";

export default class MovieDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      movieId: 0,
      loading: false,
      adult: false,
      backdropImages: [],
      posters: [],
      videoKey: "",
      belongsToCollection: {},
      budget: 0,
      genres: [],
      language: "",
      title: "",
      overview: "",
      homePage: "", //https://www.imdb.com/find?ref_=nv_sr_fn&q=${this.state.title}&s=all
      popularity: 0,
      poster_path: "",
      production_companies: [],
      production_countries: [],
      release_date: "",
      revenue: 0,
      runtime: 0,
      spoken_languages: [],
      status: "",
      tagline: "",
      vote_average: 0,
      vote_count: 0
    };
  }
  componentWillMount() {
    const id = this.props.navigation.getParam("id", {});
    const title = this.props.navigation.getParam("title", {});
    this.setState({ movieId: id, title: title });
  }
  componentDidMount = () => {
    this.makeRemoteRequest();
  };

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  makeRemoteRequest = () => {
    this.setState({
      loading: true
    });
    const movieDataURL = `http://api.themoviedb.org/3/movie/${
      this.state.movieId
    }?api_key=b3070a5d3abfb7c241d2688d066914e7`;
    axios
      .get(movieDataURL)
      .then(movieResponse => {
        this.setState({
          adult: movieResponse.data.adult,
          belongsToCollection: movieResponse.data.belongs_to_collection,
          budget: movieResponse.data.budget,
          genres: movieResponse.data.genres.map(genre => genre.name),
          language: movieResponse.data.original_language.toUpperCase(),
          overview: movieResponse.data.overview,
          homePage: movieResponse.data.homepage
            ? movieResponse.data.homepage
            : `https://www.imdb.com/find?ref_=nv_sr_fn&q=${
                this.state.title
              }&s=all`,
          popularity: movieResponse.data.popularity,
          poster_path: movieResponse.data.poster_path,
          production_companies: movieResponse.data.production_companies,
          production_countries: movieResponse.data.production_countries,
          release_date: movieResponse.data.release_date,
          revenue: movieResponse.data.revenue,
          runtime: movieResponse.data.runtime,
          spoken_languages: movieResponse.data.spoken_languages,
          status: movieResponse.data.status,
          tagline: movieResponse.data.tagline,
          vote_average: movieResponse.data.vote_average,
          vote_count: movieResponse.data.vote_count
        });
      })
      .catch(response => {
        this.setState({
          error: response.error,
          loading: false,
          refreshing: false
        });
      });

    const imagesURL = `http://api.themoviedb.org/3/movie/${
      this.state.movieId
    }/images?api_key=b3070a5d3abfb7c241d2688d066914e7&include_image_language=en,null`;
    axios
      .get(imagesURL)
      .then(imageResponse => {
        this.setState({
          backdropImages: imageResponse.data.backdrops, // imageResponse.data.backdrops.map((backdrop) => {backdrop.file_path}),
          posters: imageResponse.data.posters,
          loading: false,
          refreshing: false
        });
      })
      .catch(response => {
        this.setState({
          error: response.error,
          loading: false,
          refreshing: false
        });
      });

    const videosURL = `http://api.themoviedb.org/3/movie/${
      this.state.movieId
    }/videos?api_key=b3070a5d3abfb7c241d2688d066914e7&include_image_language=en,null`;
    axios
      .get(videosURL)
      .then(videoResponse => {
        this.setState({
          loading: false,
          refreshing: false,
          videoKey: videoResponse.data.results[0].key
        });
      })
      .catch(response => {
        this.setState({
          error: response.error,
          loading: false,
          refreshing: false
        });
      });
  };
  renderActivityIndicator = () => {
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
  goToWebsite = () => {
    Linking.openURL(this.state.homePage);
  };
  goToTrailer = () => {
    Linking.openURL("https://www.youtube.com/watch?v=" + this.state.videoKey);
  };
  render() {
    return (
      //Container
      <ScrollView
        contentContainerStyle={styles.scrollViewContainerStyle}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
          />
        }
      >
        {/*activity Indicator render*/}
        {this.renderActivityIndicator()}

        {/*backgroundImage render*/}
        <Image
          style={styles.backGroundImageStyle}
          resizeMode="cover"
          blurRadius={1}
          source={{
            uri: "http://image.tmdb.org/t/p/w500" + this.state.poster_path
          }}
        />

        {/*Poster render*/}
        <Image
          style={styles.posterImageStyle}
          source={{
            uri: "http://image.tmdb.org/t/p/w500" + this.state.poster_path
          }}
        />

        {/*title render*/}
        <Text style={styles.titleTextStyle}>
          {this.state.title}{" "}
          <Text style={{ fontSize: 18, fontWeight: "600", color: "#fff" }}>
            ({this.state.release_date.split("-", 1)})
          </Text>
        </Text>

        {/*separator render*/}
        <View style={styles.separatorStyle} />

        {/*tagline render*/}
        <Text style={styles.tagLineStyle}>" {this.state.tagline} ...."</Text>

        {/*separator render*/}
        <View style={styles.separatorStyle} />

        {/*genres render and rating render*/}
        <View style={styles.genreAndRatingContainer}>
          <View style={{ flexDirection: "row", flex: 0.6 }}>
            <Text style={styles.labelTextStyle}>Genres :</Text>
            <View style={{ flexDirection: "column" }}>
              {this.state.genres.map((genre, index) => (
                <View key={index} style={styles.genreItemStyle}>
                  <Text style={styles.genreItemText}>#{genre}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ flexDirection: "column", flex: 0.4 }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  color: "#fff",
                  textDecorationLine: "underline",
                  marginRight: 10
                }}
              >
                Rating :
              </Text>
              <Icon
                name="star"
                iconStyle={{ marginTop: 5 }}
                color="#DAAC06"
                type="material"
                size={16}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "400",
                  color: "#fff",
                  marginRight: 10
                }}
              >
                <Text
                  style={{ fontSize: 18, fontWeight: "600", color: "#fff" }}
                >
                  {this.state.vote_average}
                </Text>{" "}
                / 10
              </Text>
            </View>

            <Text style={styles.smallLabelTextStyle}>
              votes : {this.state.vote_count}
            </Text>
            <Text style={styles.labelTextStyle}>popularity :</Text>
            <Text style={styles.smallLabelTextStyle}>
              {this.state.popularity}
            </Text>
            <Text style={styles.labelTextStyle}>Run-Time :</Text>
            <Text style={styles.smallLabelTextStyle}>
              {this.state.runtime} minutes
            </Text>
          </View>
        </View>

        {/*separator render*/}
        <View style={styles.separatorStyle} />

        {/*overview*/}
        <View style={styles.overviewContainerStyle}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "400",
              color: "#fff",
              marginBottom: 10
            }}
          >
            Movie Overview :
          </Text>
          <Text style={styles.overviewTextStyle}>{this.state.overview}</Text>
        </View>

        {/*separator render*/}
        <View style={styles.separatorStyle} />

        {/*render movie posters*/}
        <View style={styles.basicContainerStyle}>
          <Text style={styles.labelTextStyle}>Movie Posters : </Text>
          <ImageSlider
            images={this.state.posters}
            height={400}
            imageResizeMode="contain"
          />
        </View>

        {/*separator render*/}
        <View style={styles.separatorStyle} />

        {/*render movie snapshots*/}
        <View style={styles.basicContainerStyle}>
          <Text style={styles.labelTextStyle}>Movie Snapshots : </Text>
          <ImageSlider
            images={this.state.backdropImages}
            height={200}
            imageResizeMode="cover"
          />
        </View>

        {/*separator render*/}
        <View style={styles.separatorStyle} />

        {/*movie links*/}
        <View style={styles.basicContainerStyle}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "400",
              color: "#fff",
              marginBottom: 10,
              textDecorationLine: "underline"
            }}
          >
            Movie Links :{" "}
          </Text>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={this.goToWebsite}
          >
            <Text style={styles.buttonTextStyle}>Go to Movie Website</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={this.goToTrailer}
          >
            <Text style={styles.buttonTextStyle}>Go to Movie Trailer</Text>
          </TouchableOpacity>
        </View>

        {/*separator render*/}
        <View style={styles.separatorStyle} />

        {/*movie details*/}
        <View style={styles.basicContainerStyle}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "400",
              color: "#fff",
              textDecorationLine: "underline"
            }}
          >
            Movie Details :{" "}
          </Text>
          {/*language */}
          <View style={styles.detailsItemStyle}>
            <Text style={styles.detailsItemLabelTextStyle}>Language : </Text>
            <Text style={styles.detailsItemTextStyle}>
              {this.state.language.toUpperCase()}
            </Text>
          </View>
          <View style={styles.detailsDividerStyle} />

          {/*budget*/}
          <View style={styles.detailsItemStyle}>
            <Text style={styles.detailsItemLabelTextStyle}>Budget : </Text>
            <Text style={styles.detailsItemTextStyle}>
              {this.state.budget / 1000000} $ Million Dollars{" "}
            </Text>
          </View>
          <View style={styles.detailsDividerStyle} />

          {/*revenue*/}
          <View style={styles.detailsItemStyle}>
            <Text style={styles.detailsItemLabelTextStyle}>Revenue : </Text>
            <Text style={styles.detailsItemTextStyle}>
              {Math.ceil(this.state.revenue / 1000000)} $ Million Dollars{" "}
            </Text>
          </View>
          <View style={styles.detailsDividerStyle} />

          {/*release date*/}
          <View style={styles.detailsItemStyle}>
            <Text style={styles.detailsItemLabelTextStyle}>
              Release Date :{" "}
            </Text>
            <Text style={styles.detailsItemTextStyle}>
              {this.state.release_date}
            </Text>
          </View>
          <View style={styles.detailsDividerStyle} />

          {/*status*/}
          <View style={styles.detailsItemStyle}>
            <Text style={styles.detailsItemLabelTextStyle}>Status : </Text>
            <Text style={styles.detailsItemTextStyle}>{this.state.status}</Text>
          </View>
          <View style={styles.detailsDividerStyle} />

          {/*adult*/}
          <View style={styles.detailsItemStyle}>
            <Text style={styles.detailsItemLabelTextStyle}>Adult : </Text>
            <Text style={styles.detailsItemTextStyle}>
              {this.state.adult ? "Yes" : "No"}
            </Text>
          </View>
          <View style={styles.detailsDividerStyle} />

          {/*Collection*/}

          <View style={styles.arrayContainerStyle}>
            <Text style={styles.arrayLabelTextStyle}>Collection : </Text>
            {this.state.belongsToCollection ? (
              <View style={styles.collectionPosterStyle}>
                <Image
                  resizeMode="contain"
                  style={styles.collectionPosterImageStyle}
                  source={{
                    uri:
                      "http://image.tmdb.org/t/p/w500" +
                      this.state.belongsToCollection.poster_path
                  }}
                />
                <Text style={styles.collectionNameStyle}>
                  {this.state.belongsToCollection.name}
                </Text>
              </View>
            ) : (
              <Text style={styles.detailsItemTextStyle}>
                Not belonging to collection
              </Text>
            )}
          </View>

          <View style={styles.detailsDividerStyle} />

          {/*spoken languages*/}
          <View style={styles.arrayContainerStyle}>
            <Text style={styles.arrayLabelTextStyle}>Spoken Languages : </Text>
            <View style={styles.languageContainerStyle}>
              {this.state.spoken_languages.map((language, index) => (
                <View key={index} style={styles.languageStyle}>
                  <Text style={styles.languageTextStyle}>{language.name}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.detailsDividerStyle} />

          {/*production countries*/}
          <View style={styles.arrayContainerStyle}>
            <Text style={styles.arrayLabelTextStyle}>
              Production Countries :{" "}
            </Text>
            <View style={styles.languageContainerStyle}>
              {this.state.production_countries.map((country, index) => (
                <View key={index} style={styles.languageStyle}>
                  <Text style={styles.languageTextStyle}>{country.name}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.detailsDividerStyle} />

          {/*production companies*/}
          <View style={styles.arrayContainerStyle}>
            <Text style={styles.arrayLabelTextStyle}>
              ProductionCompanies :{" "}
            </Text>
            <View>
              {this.state.production_companies.map((company, index) => (
                <View key={index} style={styles.companyStyle}>
                  <Image
                    style={{ width: 100, height: 100 }}
                    resizeMode="contain"
                    source={{
                      uri: "http://image.tmdb.org/t/p/w500" + company.logo_path
                    }}
                  />
                  <Text
                    style={{ fontSize: 14, fontWeight: "600", color: "#000" }}
                  >
                    {company.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.detailsDividerStyle} />

          {/*signature*/}
          <View style={styles.signatureContainerStyle}>
            <Text style={styles.signatureTextStyle}>
              Developed by : Mohamed Abady in JUNE 2019
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  scrollViewContainerStyle: {
    backgroundColor: "#212121"
  },
  backGroundImageStyle: {
    height: Dimensions.get("window").height / 2,
    width: Dimensions.get("window").width,
    opacity: 0.5
  },
  posterImageStyle: {
    marginTop: -240,
    width: Dimensions.get("window").width - 70,
    height: 450,
    shadowColor: "#2B2B2B",
    shadowRadius: 0,
    shadowOpacity: 1,
    shadowOffset: {
      width: -1,
      height: 1
    },
    marginLeft: 35,
    marginRight: 35
  },
  titleTextStyle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    textTransform: "uppercase",
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 10
  },
  separatorStyle: {
    height: 1,
    backgroundColor: "#E75252",
    flex: 1,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 10
  },
  tagLineStyle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15
  },
  genreAndRatingContainer: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  labelTextStyle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#fff",
    textDecorationLine: "underline"
  },
  genreItemStyle: {
    borderColor: "#E75252",
    borderWidth: 0.5,
    height: 25,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10
  },
  genreItemText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    textTransform: "uppercase",
    marginLeft: 5,
    marginRight: 5
  },
  smallLabelTextStyle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#fff",
    marginBottom: 10
  },
  overviewContainerStyle: {
    marginLeft: 15,
    marginRight: 15,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  overviewTextStyle: {
    borderWidth: 0.5,
    borderColor: "#E75252",
    borderRadius: 20,
    minHeight: 100,
    padding: 15,
    color: "#fff",
    fontWeight: "300",
    fontSize: 12,
    textAlign: "justify",
    minWidth: Dimensions.get("window").width - 30
  },
  basicContainerStyle: {
    marginLeft: 15,
    marginRight: 15,
    flexDirection: "column"
  },
  buttonStyle: {
    height: 40,
    maxWidth: Dimensions.get("window").width - 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E75252",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20
  },
  buttonTextStyle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    shadowColor: "#fff",
    shadowOpacity: 1,
    shadowOffset: {
      width: 1,
      height: -1
    },
    shadowRadius: 0
  },
  detailsDividerStyle: {
    width: Dimensions.get("window").width - 150,
    marginLeft: 75,
    marginRight: 75,
    height: 0.5,
    backgroundColor: "#E75252"
  },
  detailsItemStyle: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  detailsItemLabelTextStyle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#fff",
    marginLeft: 10,
    width: 70,
    alignSelf: "flex-start"
  },
  detailsItemTextStyle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#F5B7B1"
  },
  arrayContainerStyle: {
    marginVertical: 10,
    marginHorizontal: 10,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start"
  },
  arrayLabelTextStyle: {
    fontSize: 12,
    fontWeight: "400",
    color: "#fff",
    marginBottom: 5
  },
  collectionPosterStyle: {
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  collectionPosterImageStyle: {
    height: 150,
    width: 100
  },
  collectionNameStyle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#F5B7B1",
    marginLeft: 15
  },
  languageContainerStyle: {
    flexDirection: "column",
    minHeight: 30,
    justifyContent: "flex-start",
    alignItems: "center",
    width: Dimensions.get("window").width - 60
  },
  languageStyle: {
    marginHorizontal: 10,
    height: 30,
    justifyContent: "center",
    alignItems: "center"
  },
  languageTextStyle: {
    fontWeight: "600",
    fontSize: 12,
    color: "#F5B7B1"
  },
  companiesContainer: {
    flexDirection: "column",
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10
  },
  companyStyle: {
    flexDirection: "row",
    marginBottom: 15,
    borderRadius: 15,
    width: Dimensions.get("window").width - 60,
    backgroundColor: "#fff",
    height: 100,
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  companyImageStyle: {
    height: 70,
    flex: 0.5
  },
  companyTextStyle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    flex: 0.5
  },
  signatureContainerStyle: {
    height: 50,
    marginHorizontal: 15,
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  signatureTextStyle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center"
  }
});

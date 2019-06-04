this application is built with react-native v 0.59

gradle Version used v 4.10.2

title:
Movies Search Applications

features: 
1- Search for movies by name.
2- preview movies related to search key.
3- Prompt the user when no matches are found.
4- Prompt the user when the search input is submitted empty.
5- Make API request using axios to fetch search results.
6- pull to refresh from the top of the screen
7- Continous paging on scroll end reached.
8- Preview activity indicator untill the api response arrives successfully
9- Catching errors and presenting them.
10- Make API request to fetch further information about each movie
11- Make API request to fetch further images from each movie. 
12- Make API request to fetch further Videos for each movie.
13- Navigating to each movie Website and in case of no movie searching for it on imdb.com
14- Navigating to each movie Trailer on youtube.
16- Robust and reliable data fetching technique.
17- Comfortable and well ordered presentation of the retrieved information.
18- smooth navigation between application pages.

design decision:
-the application is targeting direct and easy user understanding.
-No major paging targets direct access to information.
-Dark theme with vibrant reddish hue suppose excitment and well captured Movie infomation and pictures.

architecture:
the application is built on three main general components:
1- HomeScreen component.
2- MoviesDetails component.
3- Routing component to navigate between the previous screens.

other custom components made : Movie_list_item, Image_Slider, Search_Bar

application is tested only on android. i don't know if dependencies will work for ios.

IMPORTANT NOTE ########
-in this stage of learning react native, i was an explorer. 
- I faced tremendous problems to implement the seamingly easy business logic of the application, 
  but managing libraries and external dependencies required a huge effort.
- I had to change decisions on using specific components due to lack of knowledge of how to implement them.
- I'm extremly sorry for late submition.

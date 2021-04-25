# Moviestar Data Warehouse

An application to calculate the outcome of your Movie based on Actors/Actresses, Directors/Directresses, Production Companies, Social Media Presence, etc.


## How to use it?

You can use the live version of the app via <https://moviestar-dashboard.herokuapp.com/home> or clone this repo to create your own development server. The next steps explain how to do so:


### Prerequisites

+ [Node.js](https://nodejs.org/en/download/ "Download Node.js")
+ [Python3](https://www.python.org/downloads/ "Download Python")
+ [ElasticSearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/install-elasticsearch.html "Installing ElasticSearch")
+ [Twitter API Token](https://developer.twitter.com/en/apply-for-access "Create Twitter Developer Account")
+ [TMDB API Token](https://www.themoviedb.org/signup "Create TMDB Account")


### Setup Working Space

Setup your Workspace by cloning this Repository via ssh or http (<https://github.com/thephilippbusch/DataWarehouse_MovieStars>).


#### FastAPI GraphQL Server

Once cloned, we first setup our FastAPI GraphQL Server by navigating to _/fastapi-graphql_:

```
cd /fastapi-graphql
```

Create a virtual python environment via venv or your preferred option. To create and use a Virtual Environment, simple type the following in your _/fastapi-graphql_ root folder:

```
python3 -m venv some_env_name
source some_env_name/bin/activate
```

When succesfully started your venv, you can now install all requirements via:

```
pip install -r requirements.txt
```

Now add a _.env_ file to your _/fastapi-graphql_ directory with an "TWITTER_API_TOKEN" key and your Twitter API token:

```
TWITTER_API_TOKEN=your_twitter_api_token
```

Finally, you should be able to start your development API Server through this command:

```
python main.py
```


#### React Dashboard App

To start your React Frontend development server, navigate to the _/react_ folder. Now install all required node packages via:

```
npm install
```

Don't worry, this might take a while.

After succesfully installing all requirements, you need to add your TMDB API Token and your API Server host to a _.env_ file in your _/react_ root directory:

```
REACT_APP_TMDB_API_KEY=your_tmdb_api_token
REACT_APP_GRAPHQL_BASE_URL=http://localhost:8000 (or another port, if you've set one)
```

Now you can run your app via

```
npm start
```

and head to your browser at [localhost:3000](http://localhost:3000).

You should now be able to see the React Dashboard on your localhost and start creating your own Moviestar :sparkles:!


## Understanding your Results

The Moviestar calculation result is formed by different factors of both the TMDB movie data as well as Twitter follower counts. One factor is sampled by the relation of a movies revenue to its budget. Taking the average of the 10 most popular movies of Actors/Actresses and Directors/Directresses as well as each movie related to the selected production companies, we create the first factor. The other one is gathered by the average of the twitter follower of each movie and the relation of each follower count to the calculated average. Those two combined will be multiplied to the used budget and will create the final calculated revenue. More details of the calculation can be retrieved from the documentation.

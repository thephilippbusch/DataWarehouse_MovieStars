import requests, os
from dotenv import dotenv_values
from graphene import ObjectType, List, String, Schema, Field, Mutation, Int, Float, List, Boolean
from starlette.graphql import GraphQLApp
from schemas import MovieType, GenreType, GenreInputType, CompanyType, CompanyInputType
from .elasticsearch import es

if os.environ.get("TWITTER_API_TOKEN"):
    token = os.environ.get("TWITTER_API_TOKEN")
else:
    config = dotenv_values(".env")
    token = config["TWITTER_API_TOKEN"]

twitter_auth_header = {
    "authorization": f"Bearer {token}"
}

class MovieQuery(ObjectType):
    movie_list= None
    get_movie = Field(List(MovieType), id=Int(), title=String(), genre_name=String(), genre_id=Int(), company_id=Int(), company_name=String())
    async def resolve_get_movie(self, info, id=None, title=None, genre_name=None, genre_id=None, company_id=None, company_name=None):
        movie_list = []

        query_args = []
        if id:
            query_args.append({"match": {"id": id}})
        if title:
            query_args.append({"match": {"title": title}})
        if genre_name:
            query_args.append({"match": {"genres.name": genre_name}})
        if genre_id:
            query_args.append({"match": {"genres.id": genre_id}})
        if company_id:
            query_args.append({"match": {"production_companies.id": company_id}})
        if company_name:
            query_args.append({"match": {"production_companies.name": company_name}})

        if id or title or genre_name or genre_id or company_id or company_name:
            res = es.search(
                index="movies",
                body={
                    "size": 1000,
                    "query": {
                        "bool": {
                            "must": query_args
                        }
                    }
                }
            )
            for hit in res['hits']['hits']:
                movie_list.append(hit['_source'])
        else:
            res = es.search(
                index="movies",
                body={
                    "size": 1000,
                    "query": {
                        "match_all": {}
                    }
                }
            )
            for hit in res['hits']['hits']:
                movie_list.append(hit['_source'])

        return movie_list

class CheckMovie(Mutation):
    does_exist = Boolean()

    class Arguments:
        id = Int(required=True)

    async def mutate(self, info, id):
        does_exist = False

        res = es.search(
            index="movies", 
            body={
                "query": {
                    "match": {
                        "id": id
                    }
                }
            }
        )

        if res['hits']['total']['value'] == 0:
            does_exist = False
        if res['hits']['total']['value'] == 1:
            does_exist = True

        return CheckMovie(does_exist)

class AddMovie(Mutation):
    movie = Field(MovieType)

    class Arguments:
        id = Int(required=True)
        title = String(required=True)
        imdb_id = String(required=True)
        budget = Float(required=True)
        revenue = Float(required=True)
        vote_average = Float(required=True)
        genres = List(GenreInputType)
        vote_count = Int()
        runtime = Int()
        popularity = Float()
        production_companies = List(CompanyInputType)
        twitter_id = String()

    async def mutate(self, info, id, title, imdb_id, budget, revenue, vote_average, genres, vote_count=None, runtime=None, popularity=None, production_companies=None, twitter_id=None):
        twitter_follower = None

        if twitter_id:
            response = requests.get(f'https://api.twitter.com/1.1/users/show.json?screen_name={twitter_id}', headers=twitter_auth_header)
            account = response.json()
            if "followers_count" in account:
                twitter_follower = account["followers_count"]
        
        new_movie = {
            'id': id,
            'title': title,
            'imdb_id': imdb_id,
            'budget': budget,
            'revenue': revenue,
            'vote_average': vote_average,
            'vote_count': vote_count,
            'runtime': runtime,
            'popularity': popularity,
            'genres': genres,
            'production_companies': production_companies,
            'twitter_id': twitter_id,
            'twitter_follower': twitter_follower
        }
        res = es.index(
            index="movies", 
            body=new_movie
        )
        return AddMovie(new_movie)

class MovieMutation(ObjectType):
    add_movie = AddMovie.Field()
    check_movie = CheckMovie.Field()
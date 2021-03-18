from graphene import ObjectType, List, String, Schema, Field, Mutation, Int, Float, List
from starlette.graphql import GraphQLApp
from schemas import MovieType
from elasticsearch import Elasticsearch

es = Elasticsearch()

class MovieQuery(ObjectType):
    movie_list= None
    get_movie = Field(List(MovieType), id=String())
    async def resolve_get_movie(self, info, id=None):
        movie_list = []
        res = es.search(
            index="movies", 
            body={
                "query": {
                    "match_all": {}
                }
            }
        )
        for hit in res['hits']['hits']:
            movie_list.append(hit['_source'])
        if(id):
            for movie in movie_list:
                if movie['id'] == id: return [movie]
        return movie_list

class AddMovie(Mutation):
    movie = Field(MovieType)

    class Arguments:
        id = Int(required=True)
        title = String(required=True)
        imdb_id = String(required=True)
        budget = Int(required=True)
        revenue = Int(required=True)
        vote_average = Float(required=True)
        vote_count = Int()
        runtime = Int()
        popularity = Float()
        genres = List(Int)

    async def mutate(self, info, id, title, imdb_id, budget, revenue, vote_average, vote_count=None, runtime=None, popularity=None, genres=None):
        res = es.search(index="movies", body={"query": {"match_all": {}}})
        es_id = res['hits']['total']['value']
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
            'genres': genres
        }
        print(new_movie)
        res = es.index(index="movies", id=es_id, body=new_movie)
        print(res)
        return AddMovie(new_movie)

class MovieMutation(ObjectType):
    add_movie = AddMovie.Field()
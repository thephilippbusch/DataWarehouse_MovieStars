from graphene import ObjectType, List, String, Schema, Field, Mutation, Int, Float, List, Boolean
from starlette.graphql import GraphQLApp
from schemas import PersonType
from elasticsearch import Elasticsearch

es = Elasticsearch()

class PeopleQuery(ObjectType):
    people_list = None
    get_people = Field(List(PersonType), id=String())
    async def resolve_get_people(self, info, id=None):
        people_list = []
        
        res = es.search(
            index="people",
            body={
                "query": {
                    "match_all": {}
                }
            }
        )

        for hit in res['hits']['hits']:
            people_list.append(hit['_source'])
        
        if(id):
            for person in people_list:
                if person['id'] == id: return [person]
        
        return people_list

class CheckPeople(ObjectType):
    does_exist = None
    check_people = Field(Boolean, id=Int())
    async def resolve_check_people(self, info, id):
        does_exist = False

        res = es.search(
            index="people",
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

        return does_exist

class AddPerson(Mutation):
    person = Field(PersonType)

    class Arguments:
        id = Int(required=True)
        name = String(required=True)
        imdb_id = String(required=True)
        known_for_dep = String(required=True)
        popularity = Float(required=True)
        birthday = String(required=True)
        deathday = String()
        popular_movies = List(Int)

    async def mutate(self, info, id, name, imdb_id, known_for_dep, popularity, birthday, popular_movies, deathday=None):
        
        res = es.search(
            index="people",
            body={
                "query": {
                    "match": {
                        "id": id
                    }
                }
            }
        )

        if res['hits']['total']['value'] != 0:
            for hit in res['hits']['hits']:
                if hit['_source']['id'] == id:
                    raise Exception('Person already exists in Database!')

        res = es.search(
            index="people",
            body={
                "query": {
                    "match_all": {}
                }
            }
        )

        es_id = res['hits']['total']['value']
        new_person = {
            'id': id,
            'name': name,
            'imdb_id': imdb_id,
            'known_for_dep': known_for_dep,
            'popularity': popularity,
            'birthday': birthday,
            'deathday': deathday,
            'popular_movies': popular_movies
        }

        res = es.index(
            index="people",
            id=es_id,
            body=new_person
        )
        return AddPerson(new_person)

class PersonMutation(ObjectType):
    add_person = AddPerson.Field()

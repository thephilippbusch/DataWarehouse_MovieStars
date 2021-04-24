from graphene import ObjectType, List, String, Schema, Field, Mutation, Int, Float, List, Boolean
from starlette.graphql import GraphQLApp
from schemas import PersonType
from .elasticsearch import es

class PeopleQuery(ObjectType):
    people_list = None
    get_people = Field(List(PersonType), id=Int(), name=String(), knownForDep=String(), imdb_id=String(), gender=Int())
    async def resolve_get_people(self, info, id=None, name=None, knownForDep=None, imdb_id=None, gender=None):
        people_list = []
        query_args = []
        if id:
            query_args.append({"match": {"id": id}})
        if name:
            query_args.append({"match": {"name": name}})
        if knownForDep:
            query_args.append({"match": {"known_for_dep": knownForDep}})
        if imdb_id:
            query_args.append({"match": {"imdb_id": imdb_id}})
        if gender:
            query_args.append({"match": {"gender": gender}})
        
        if id or name or knownForDep or imdb_id:
            res = es.search(
                index="people",
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
                people_list.append(hit['_source'])
        else:
            res = es.search(
                index="people",
                body={
                    "size": 1000,
                    "query": {
                        "match_all": {}
                    }
                }
            )
            for hit in res['hits']['hits']:
                people_list.append(hit['_source'])

        return people_list

class CheckPerson(Mutation):
    does_exist = Boolean()
    
    class Arguments:
        id = Int(required=True)

    async def mutate(self, info, id):
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

        return CheckPerson(does_exist)

class AddPerson(Mutation):
    person = Field(PersonType)

    class Arguments:
        id = Int(required=True)
        name = String(required=True)
        imdb_id = String(required=True)
        known_for_dep = String(required=True)
        popularity = Float(required=True)
        birthday = String(required=True)
        gender = Int()
        deathday = String()
        popular_movies = List(Int)
        img_path = String()

    async def mutate(self, info, id, name, imdb_id, known_for_dep, popularity, birthday, gender, popular_movies, deathday=None, img_path=None):
        if not deathday:
            deathday = None
        if not img_path:
            img_path = None

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

        new_person = {
            'id': id,
            'name': name,
            'imdb_id': imdb_id,
            'known_for_dep': known_for_dep,
            'popularity': popularity,
            'birthday': birthday,
            'deathday': deathday,
            'popular_movies': popular_movies,
            'img_path': img_path,
            'gender': gender
        }

        res = es.index(
            index="people",
            body=new_person
        )

        return AddPerson(new_person)

class DeletePerson(Mutation):
    ok = Boolean()

    class Arguments:
        id = Int(required=True)

    async def mutate(self, info, id):

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
            raise Exception('Person does not exist in Database!')

        es_id = res['hits']['hits'][0]['_id']
        res = es.delete(
            index="people",
            id=es_id
        )

        if res['result'] != 'deleted':
            raise Exception('Delete was unsuccessful')
        else:
            ok = True

        return DeletePerson(ok)

class UpdateMovieList(Mutation):
    ok = Boolean()

    class Arguments:
        id = Int()
        popular_movies = List(Int)
    
    async def mutate(self, info, id, popular_movies):
        ok = False

        id_res = es.search(
            index='people',
            body={
                "query": {
                    "match": {
                        "id": id
                    }
                }
            }
        )

        es_id = id_res['hits']['hits'][0]["_id"]

        res = es.update(
            index='people',
            id=es_id,
            body={
                "script": {
                    "source": "ctx._source.popular_movies = params.popular_movies",
                    "lang": "painless",
                    "params": {
                        "popular_movies": popular_movies
                    }
                }
            }
        )

        if res["result"] == "updated":
            ok = True
        
        return UpdateMovieList(ok)

class PersonMutations(ObjectType):
    add_person = AddPerson.Field()
    delete_person = DeletePerson.Field()
    check_person = CheckPerson.Field()
    update_movie_list = UpdateMovieList.Field()
import uuid
from graphene import ObjectType, List, String, Schema, Field, Mutation, Int, Float, List, Boolean
from starlette.graphql import GraphQLApp
from schemas import CalculationType
from .elasticsearch import es

class CalculationQuery(ObjectType):
    calculation_list = None
    get_calculations = Field(List(CalculationType), id=Int())
    async def resolve_get_calculations(self, info, id=None):
        calculation_list = []

        query_args = []
        if id:
            query_args.append({"match": {"id": id}})

        if id:
            res = es.search(
                index="calculations",
                body={
                    "size": 50,
                    "query": {
                        "bool": {
                            "must": query_args
                        }
                    }
                }
            )
            for hit in res['hits']['hits']:
                calculation_list.append(hit['_source'])
        else:
            res = es.search(
                index="calculations",
                body={
                    "size": 50,
                    "query": {
                        "match_all": {}
                    }
                }
            )
            for hit in res['hits']['hits']:
                calculation_list.append(hit['_source'])

        return calculation_list

class CheckCalculation(Mutation):
    does_exist = Boolean()

    class Arguments:
        id = String(required=True)

    async def mutate(self, info, id):
        does_exist = False

        res = es.search(
            index="calculations", 
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

        return CheckCalculation(does_exist)

class CreateCalculation(Mutation):
    calculation = Field(CalculationType)

    class Arguments:
        # user = String(required=True)
        creation_date = String(required=True)
        used_budget = Float(required=True)
        acting = List(Int)
        directing = List(Int)
        companies = List(Int)

    async def mutate(self, info, creation_date, used_budget, acting=None, directing=None, companies=None):
        revenue = None
        all_factors = []
        twitter_numbers = []
        all_movies_list = []

        def avg(number_list) -> float:
            return round(sum(number_list) / len(number_list), 2)

        for person in acting:
            movie_factors = []

            people_details = es.search(
                index="people",
                body={
                    "query": {
                        "match": {
                            "id": person
                        }
                    }
                }
            )
            hit = people_details['hits']['hits'][0]['_source']
            for movie in hit['popular_movies']:
                all_movies_list.append(movie)
                movie_details = es.search(
                    index="movies",
                    body={
                        "query": {
                            "match": {
                                "id": movie
                            }
                        }
                    }
                )

                if movie_details['hits']['total']['value'] > 0:
                    movie = movie_details['hits']['hits'][0]['_source']

                    if not movie["budget"] == 0 and not movie["revenue"] == 0:
                        movie_factors.append(round(movie["revenue"]/movie["budget"], 2))

                    if "twitter_follower" in movie:
                        if movie["twitter_follower"]:
                            twitter_numbers.append(movie["twitter_follower"])

            if len(movie_factors) > 0:
                all_factors.append(round(sum(movie_factors) / len(movie_factors), 2))


        for person in directing:
            movie_factors = []

            directing_details = es.search(
                index="people",
                body={
                    "query": {
                        "match": {
                            "id": person
                        }
                    }
                }
            )
            hit = directing_details['hits']['hits'][0]['_source']
            for movie in hit['popular_movies']:
                all_movies_list.append(movie)
                movie_details = es.search(
                    index="movies",
                    body={
                        "query": {
                            "match": {
                                "id": movie
                            }
                        }
                    }
                )

                if movie_details['hits']['total']['value'] > 0:
                    movie = movie_details['hits']['hits'][0]['_source']

                    if not movie["budget"] == 0 and not movie["revenue"] == 0:
                        movie_factors.append(round(movie["revenue"]/movie["budget"], 2))

                    if "twitter_follower" in movie:
                        if movie["twitter_follower"]:
                            twitter_numbers.append(movie["twitter_follower"])

            if len(movie_factors) > 0:
                all_factors.append(round(sum(movie_factors) / len(movie_factors), 2))

        for company in companies:
            movie_factors = []

            movies = es.search(
                index="movies",
                body={
                    "query": {
                        "match": {
                            "production_companies.id": company
                        }
                    }
                }
            )
            for detail in movies['hits']['hits']:
                all_movies_list.append(movie["id"])
                movie = detail['_source']
                
                if not movie["budget"] == 0 and not movie["revenue"] == 0:
                    movie_factors.append(round(movie["revenue"]/movie["budget"], 2))
            if len(movie_factors) > 0:
                all_factors.append(round(sum(movie_factors) / len(movie_factors), 2))

        twitter_follower_avg = round(sum(twitter_numbers) / len(twitter_numbers), 2)
        twitter_factors = []
        for follower in twitter_numbers:
            twitter_factors.append(round(follower/twitter_follower_avg, 2) / 100)


        twitter_factor = round(sum(twitter_factors), 2)
        final_factor = round(sum(all_factors) / len(all_factors), 2) + twitter_factor
        revenue = round(used_budget * final_factor, 2)

        new_calculation = {
            "id": uuid.uuid4(),
            # "user": user,
            "creation_date": creation_date,
            "used_budget": used_budget,
            "acting": acting,
            "directing": directing,
            "companies": companies,
            "movies": all_movies_list,
            "factor": final_factor,
            "calculated_revenue": revenue
        }

        res = es.index(
            index="calculations",
            body=new_calculation
        )

        return CreateCalculation(new_calculation)

class CalculationMutation(ObjectType):
    create_calculation = CreateCalculation.Field()
    check_calculation = CheckCalculation.Field()
from graphene import String, Int, Float, List, ObjectType, InputObjectType, Field

class UserType(ObjectType):
    id = String()
    username = String()
    email = String(required=True)
    password = String(required=True)

class GenreInputType(InputObjectType):
    id = Int(required=True)
    name = String(required=True)

class CompanyInputType(InputObjectType):
    id = Int(required=True)
    name = String(required=True)

class GenreType(ObjectType):
    id = Int(required=True)
    name = String(required=True)

class CompanyType(ObjectType):
    id = Int(required=True)
    name = String(required=True)

class MovieType(ObjectType):
    id = Int(required=True)
    title = String(required=True)
    imdb_id = String(required=True)
    budget = Float(required=True)
    revenue = Float(required=True)
    runtime = Int()
    vote_average = Float(required=True)
    vote_count = Int()
    popularity = Float()
    genres = List(GenreType, required=True)
    production_companies = List(CompanyType)
    twitter_id = String()
    twitter_follower = Float()

class PersonType(ObjectType):
    id = Int(required=True)
    imdb_id = String(required=True)
    name = String(required=True)
    known_for_dep = String(required=True)
    popularity = Float()
    birthday = String(required=True)
    deathday= String()
    popular_movies = List(Int)
    img_path = String()
    gender = Int()

class TestType(ObjectType):
    id = Int(required=True)
    name = String(required=True)
    number_list = List(Int)

class CalculationType(ObjectType):
    id = String()
    # user = String(required=True)
    creation_date = String(required=True)
    used_budget = Float(required=True)
    acting = List(Int)
    directing = List(Int)
    companies = List(Int)
    movies = List(Int)
    factor = Float()
    calculated_revenue = Float()

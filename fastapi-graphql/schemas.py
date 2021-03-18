from graphene import String, Int, Float, List, ObjectType

class CourseType(ObjectType):
    id = String(required=True)
    title = String(required=True)
    instructor = String(required=True)
    publish_date = String()

class MovieType(ObjectType):
    id = Int(required=True)
    title = String(required=True)
    imdb_id = String(required=True)
    budget = Int(required=True)
    revenue = Int(required=True)
    runtime = Int()
    vote_average = Float(required=True)
    vote_count = Int()
    popularity = Float()
    genres = List(String, required=True)

class PersonType(ObjectType):
    id = Int(required=True)
    imdb_id = String(required=True)
    name = String(required=True)
    known_for_dep = String(required=True)
    popularity = Float()
    birthday = String(required=True)
    deathday= String()
    popular_movies = List(Int)

class CompanyType(ObjectType):
    id = Int(required=True)
    name = String(required=True)

class TestType(ObjectType):
    id = Int(required=True)
    name = String(required=True)
    number_list = List(Int)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from graphene import ObjectType, List, String, Schema, Field, Mutation, Int, Float, List
from graphql.execution.executors.asyncio import AsyncioExecutor
from starlette.graphql import GraphQLApp
from schemas import MovieType

from .movies import MovieQuery, MovieMutation
from .people import PeopleQuery, PersonMutations
from .companies import CompanyQuery, CompanyMutation, CheckCompany
from .calculations import CalculationQuery, CalculationMutation

app = FastAPI()

origins=[
    'moviestar-dashboard.herokuapp.com',
    'https://moviestar-dashboard.herokuapp.com',
    'localhost:3000',
    'http://localhost:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_route("/movies", GraphQLApp(
    schema=Schema(query=MovieQuery, mutation=MovieMutation),
    executor_class=AsyncioExecutor
))

# app.add_route("/genres", GraphQLApp(
#     schema=Schema(query=GenreQuery, mutation=GenreMutation),
#     executor_class=AsyncioExecutor
# ))


app.add_route("/calculations", GraphQLApp(
    schema=Schema(query=CalculationQuery, mutation=CalculationMutation),
    executor_class=AsyncioExecutor
))


app.add_route("/people", GraphQLApp(
    schema=Schema(query=PeopleQuery, mutation=PersonMutations),
    executor_class=AsyncioExecutor
))


app.add_route("/companies", GraphQLApp(
    schema=Schema(query=CompanyQuery, mutation=CompanyMutation),
    executor_class=AsyncioExecutor
))
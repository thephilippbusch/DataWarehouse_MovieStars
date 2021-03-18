from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from graphene import ObjectType, List, String, Schema, Field, Mutation, Int, Float, List
from graphql.execution.executors.asyncio import AsyncioExecutor
from starlette.graphql import GraphQLApp
from schemas import CourseType, MovieType
from elasticsearch import Elasticsearch

from .movies import MovieQuery, MovieMutation
from .people import PeopleQuery, PersonMutation, CheckPeople
from .courses import CourseQuery, CourseMutation, CheckCourses
from .companies import CompanyQuery, CompanyMutation
from .test import TestQuery, TestMutation

app = FastAPI()

origins=[
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

app.add_route("/courses", GraphQLApp(
    schema=Schema(query=CourseQuery, mutation=CourseMutation),
    executor_class=AsyncioExecutor
))

app.add_route("/check-courses", GraphQLApp(
    schema=Schema(query=CheckCourses),
    executor_class=AsyncioExecutor
))

app.add_route("/movies", GraphQLApp(
    schema=Schema(query=MovieQuery, mutation=MovieMutation),
    executor_class=AsyncioExecutor
))

app.add_route("/people", GraphQLApp(
    schema=Schema(query=PeopleQuery, mutation=PersonMutation),
    executor_class=AsyncioExecutor
))

app.add_route("/check-people", GraphQLApp(
    schema=Schema(query=CheckPeople),
    executor_class=AsyncioExecutor
))

app.add_route("/companies", GraphQLApp(
    schema=Schema(query=CompanyQuery, mutation=CompanyMutation),
    executor_class=AsyncioExecutor
))

app.add_route("/test", GraphQLApp(
    schema=Schema(query=TestQuery, mutation=TestMutation),
    executor_class=AsyncioExecutor
))

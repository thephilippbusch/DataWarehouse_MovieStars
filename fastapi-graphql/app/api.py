from fastapi import FastAPI
from graphene import ObjectType, List, String, Schema, Field, Mutation
from graphql.execution.executors.asyncio import AsyncioExecutor
from starlette.graphql import GraphQLApp
from schemas import CourseType
from elasticsearch import Elasticsearch

es = Elasticsearch()
app = FastAPI()

class Query(ObjectType):
    course_list = None
    get_course = Field(List(CourseType), id=String())
    async def resolve_get_course(self, info, id=None):
        course_list = []
        res = es.search(index="courses", body={"query": {"match_all": {}}})
        for hit in res['hits']['hits']:
            course_list.append(hit['_source'])
        if(id):
            for course in course_list:
                if course['id'] == id: return [course] 
        return course_list
        
class CreateCourse(Mutation):
    course = Field(CourseType)

    class Arguments:
        id = String(required=True)
        title = String(required=True)
        instructor = String(required=True)
    
    async def mutate(self, info, id, title, instructor):
        res = es.search(index="courses", body={"query": {"match_all": {}}})
        es_id = res['hits']['total']['value']
        new_course = {
            'id': id,
            'title': title,
            'instructor': instructor
        }
        res = es.index(index="courses", id=es_id, body=new_course)
        return CreateCourse(new_course)

class Mutation(ObjectType):
  create_course = CreateCourse.Field()


app.add_route("/", GraphQLApp(
    schema=Schema(query=Query, mutation=Mutation),
    executor_class=AsyncioExecutor
))


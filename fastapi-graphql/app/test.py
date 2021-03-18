from graphene import ObjectType, List, String, Schema, Field, Mutation, Int, Float, List
from starlette.graphql import GraphQLApp
from schemas import TestType
from elasticsearch import Elasticsearch

es = Elasticsearch()

class TestQuery(ObjectType):
    test_list = None
    get_tests = Field(List(TestType), id=String())
    async def resolve_get_tests(self, info, id=None):
        test_list = []

        res = es.search(
            index="test",
            body={
                "query": {
                    "match_all": {}
                }
            }
        )

        for hit in res['hits']['hits']:
            test_list.append(hit['_source'])
        
        if(id):
            for test in test_list:
                if test['id'] == id: return [test]

        return test_list
 
class AddTest(Mutation):
    test = Field(TestType)

    class Arguments:
        id = Int(required=True)
        name = String(required=True)
        number_list = List(Int)
    
    async def mutate(self, info, id, name, number_list):
        res = es.search(
            index="test",
            body={
                "query": {
                    "match_all": {}
                }
            }
        )
        es_id = res['hits']['total']['value']

        new_test = {
            'id': id,
            'name': name,
            'number_list': number_list
        }

        res = es.index(
            index='test',
            id=es_id,
            body=new_test
        )
        return AddTest(new_test)

class TestMutation(ObjectType):
    add_test = AddTest.Field()

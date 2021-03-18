from graphene import ObjectType, List, String, Schema, Field, Mutation, Int, Float, List, Boolean
from starlette.graphql import GraphQLApp
from schemas import CompanyType
from elasticsearch import Elasticsearch

es = Elasticsearch()

class CompanyQuery(ObjectType):
    company_list = None
    get_companies = Field(List(CompanyType), id=String(), name=String())
    async def resolve_get_companies(self, info, id=None, name=None):
        company_list = []
        res = es.search(
            index="companies", 
            body={
                "query": {
                    "match_all": {}
                }
            }
        )
        for hit in res['hits']['hits']:
            company_list.append(hit['_source'])

        if(id):
            for company in company_list:
                if company['id'] == id: return [company]

        if(name):
            filtered_company_list = []
            for company in company_list:
                if name in company['name']:
                    filtered_company_list.append(company)
            return filtered_company_list

        return company_list

class CheckCompany(ObjectType):
    does_exist = None
    check_company = Field(Boolean, id=Int())
    async def resolve_check_company(self, info, id):
        does_exist = False

        res = es.search(
            index="companies",
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

class AddCompany(Mutation):
    company = Field(CompanyType)

    class Arguments:
        id = Int(required=True)
        name = String(required=True)

    async def mutate(self, info, id, name):
        res = es.search(
            index="companies", 
            body={
                "query": {
                    "match_all": {}
                }
            }
        )
        es_id = res['hits']['total']['value']
        new_company = {
            'id': id,
            'name': name
        }
        res = es.index(index="companies", id=es_id, body=new_company)
        return AddCompany(new_company)

class CompanyMutation(ObjectType):
    add_company = AddCompany.Field()

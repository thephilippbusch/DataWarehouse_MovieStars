from graphene import ObjectType, List, String, Schema, Field, Mutation, Int, Float, List, Boolean
from starlette.graphql import GraphQLApp
from schemas import CompanyType
from .elasticsearch import es

class CompanyQuery(ObjectType):
    company_list = None
    get_companies = Field(List(CompanyType), id=String(), name=String())
    async def resolve_get_companies(self, info, id=None, name=None):
        company_list = []

        if id:
            query_args.append({"match": {"id": id}})
        if name:
            query_args.append({"match": {"name": name}})
        
        if id or name:
            res = es.search(
                index="companies",
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
                company_list.append(hit['_source'])
        else:
            res = es.search(
                index="companies",
                body={
                    "size": 1000,
                    "query": {
                        "match_all": {}
                    }
                }
            )
            for hit in res['hits']['hits']:
                company_list.append(hit['_source'])

        return company_list

class CheckCompany(Mutation):
    does_exist = Boolean()
    
    class Arguments:
        id = Int(required=True)

    async def mutate(self, info, id):
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

        return CheckCompany(does_exist)

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
        new_company = {
            'id': id,
            'name': name
        }
        res = es.index(index="companies", body=new_company)
        return AddCompany(new_company)

class DeleteCompany(Mutation):
    ok = Boolean()

    class Arguments:
        id = Int(required=True)

    async def mutate(self, info, id):

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
            raise Exception('Company does not exist in Database!')

        es_id = res['hits']['hits'][0]['_id']
        res = es.delete(
            index="companies",
            id=es_id
        )

        if res['result'] != 'deleted':
            raise Exception('Delete was unsuccessful')
        else:
            ok = True

        return DeleteCompany(ok)

class CompanyMutation(ObjectType):
    add_company = AddCompany.Field()
    check_company = CheckCompany.Field()
    delete_company = DeleteCompany.Field()

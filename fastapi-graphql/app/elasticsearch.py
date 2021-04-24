from elasticsearch import Elasticsearch
import os

host = os.environ.get('BONSAI_URL')

if host:
    es = Elasticsearch([host])
else:
    es = Elasticsearch()
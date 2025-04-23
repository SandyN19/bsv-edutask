import pytest
from pymongo.errors import WriteError
import pytest
import mongomock
from unittest.mock import patch
from src.util.dao import DAO

@pytest.fixture
def mocked_dao():
    with patch('pymongo.MongoClient', new=mongomock.MongoClient):
        dao = DAO('video')
        yield dao
        dao.drop()

def test_create_valid(mocked_dao):
    data = { 
        "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley", 
        "description": "Totally not rick roll" 
        }
    result = mocked_dao.create(data)
    assert result["url"] == data["url"]
    assert result["description"] == data["description"]
    assert "_id" in result


import pytest
from unittest.mock import patch
from src.util.dao import DAO
from pymongo.errors import WriteError

@pytest.fixture
def mocked_dao():
    dao = DAO("integration")
    yield dao
    dao.drop()

def test_create_valid(mocked_dao):
    data = {
        "firstName": "Sandy",
        "lastName": "Nguyen"
    }
    result = mocked_dao.create(data)
    assert result["firstName"] == data["firstName"]
    assert result["lastName"] == data["lastName"]
    assert "_id" in result

def test_create_invalid(mocked_dao):
    data = {
        "firstName": "Sandy",
        "lastName": 21,
    }

    with pytest.raises(WriteError):
        mocked_dao.create(data)

def test_create_none(mocked_dao):
    with pytest.raises(TypeError):
        mocked_dao.create(None)

def test_create_empty(mocked_dao):
    with pytest.raises(WriteError):
        mocked_dao.create({})

def test_create_duplicate(mocked_dao):
    data = {
        "firstName": "Sandy",
        "lastName": "Nguyen"
    }
    mocked_dao.create(data)

    with pytest.raises(WriteError):
        mocked_dao.create(data)

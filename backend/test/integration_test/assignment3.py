import pytest
from unittest.mock import patch
from src.util.dao import DAO
from pymongo.errors import WriteError

@pytest.fixture
def mocked_dao():
    dao = DAO("todo")
    yield dao
    dao.collection.delete_one({"description": "test"})

def test_create_valid(mocked_dao):
    data = {
        "description": "test",
        "done": False,
    }
    result = mocked_dao.create(data)
    assert result["description"] == data["description"]
    assert result["done"] == data["done"]
    assert "_id" in result

def test_create_invalid(mocked_dao):
    data = {
        "description": "test",
        "done": "not_a_boolean",
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
        "description": "duplicate_test",
        "done": False,
    }
    mocked_dao.create(data)

    with pytest.raises(WriteError):
        mocked_dao.create(data)

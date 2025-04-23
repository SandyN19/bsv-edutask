import pytest
from unittest.mock import MagicMock
from src.controllers.usercontroller import UserController
from src.util.dao import DAO

@pytest.fixture
def setup_controller():
    mock_dao = MagicMock(spec=DAO)
    controller = UserController(dao=mock_dao)
    return controller, mock_dao

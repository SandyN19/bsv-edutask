import pytest
from unittest.mock import MagicMock
from src.controllers.usercontroller import UserController
from src.util.dao import DAO

@pytest.fixture
def setup_controller():
    mock_dao = MagicMock(spec=DAO)
    controller = UserController(dao=mock_dao)
    return controller, mock_dao

def test_get_user_by_email_single_user(setup_controller):
    controller, mock_dao = setup_controller
    mock_user = {"email": "sandy@awesome.com", "name": "sandy"}
    mock_dao.find.return_value = [mock_user]
    
    result = controller.get_user_by_email("sandy@awesome.com")
    
    assert result == mock_user
    mock_dao.find.assert_called_once_with({"email": "sandy@awesome.com"})
    
def test_get_user_by_email_returns_first_user(setup_controller):
    controller, mock_dao = setup_controller
    users = [
        {'email': 'linus@awesome.com', 'name': 'User1'},
        {'email': 'linus@awesome.com', 'name': 'User2'},
    ]
    mock_dao.find.return_value = users
    result = controller.get_user_by_email("linus@awesome.com")

    assert result == users[0]

def test_get_user_by_email_logs_warning_for_multiple_users(setup_controller, capfd):
    controller, mock_dao = setup_controller
    users = [
        {'email': 'linus@awesome.com', 'name': 'User1'},
        {'email': 'linus@awesome.com', 'name': 'User2'},
    ]
    mock_dao.find.return_value = users
    controller.get_user_by_email("linus@awesome.com")
    out, _ = capfd.readouterr()

    assert "Error: more than one user found with mail linus@awesome.com" in out

def test_get_user_by_email_no_user(setup_controller):
    controller, mock_dao = setup_controller
    mock_dao.find.return_value = []
    result = controller.get_user_by_email("nonexistent@awesome.com")

    assert result is None
    mock_dao.find.assert_called_once_with({"email": "nonexistent@awesome.com"})

def test_get_user_by_email_invalid_email(setup_controller):
    controller, mock_dao = setup_controller
    with pytest.raises(ValueError):
        controller.get_user_by_email("invalid-email")
    mock_dao.find.assert_not_called()

def test_get_user_by_email_dao_exception(setup_controller):
    controller, mock_dao = setup_controller
    mock_dao.find.side_effect = Exception("Database error")

    with pytest.raises(Exception, match="Database"):
        controller.get_user_by_email("error@awesome.com")
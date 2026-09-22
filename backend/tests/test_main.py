import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_root():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "message": "Bienvenue dans l'API Contacts"
    }


def test_get_contacts():
    response = client.get("/contacts")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_contact_not_found():
    response = client.get("/contacts/999999")

    assert response.status_code == 404
    assert response.json() == {
        "detail": "Contact non trouvé"
    }


def test_create_contact():
    contact = {
        "nom": "Test",
        "prenom": "Jenkins",
        "email": "jenkins.test@example.com",
        "telephone": "0300000000"
    }

    response = client.post("/contacts", json=contact)

    assert response.status_code == 200

    data = response.json()

    assert data["nom"] == "Test"
    assert data["prenom"] == "Jenkins"
    assert data["email"] == "jenkins.test@example.com"
    assert data["telephone"] == "0300000000"
    assert "id" in data



def test_update_contact():
    contact = {
        "nom": "Test",
        "prenom": "Update",
        "email": "update.test@example.com",
        "telephone": "0311111111"
    }

    create_response = client.post("/contacts", json=contact)

    assert create_response.status_code == 200

    contact_id = create_response.json()["id"]

    updated_contact = {
        "nom": "TestModifie",
        "prenom": "UpdateModifie",
        "email": "updated@example.com",
        "telephone": "0322222222"
    }

    response = client.put(
        f"/contacts/{contact_id}",
        json=updated_contact
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == contact_id
    assert data["nom"] == "TestModifie"
    assert data["prenom"] == "UpdateModifie"
    assert data["email"] == "updated@example.com"
    assert data["telephone"] == "0322222222"



def test_delete_contact():
    contact = {
        "nom": "Test",
        "prenom": "Delete",
        "email": "delete.test@example.com",
        "telephone": "0333333333"
    }

    create_response = client.post("/contacts", json=contact)

    assert create_response.status_code == 200

    contact_id = create_response.json()["id"]

    response = client.delete(f"/contacts/{contact_id}")

    assert response.status_code == 200

    assert response.json() == {
    "message": "Contact supprimé avec succès"
    }

    get_response = client.get(f"/contacts/{contact_id}")

    assert get_response.status_code == 404
from pydantic import BaseModel


class ContactCreate(BaseModel):
    nom: str
    prenom: str
    email: str
    telephone: str | None = None


class ContactUpdate(BaseModel):
    nom: str
    prenom: str
    email: str
    telephone: str | None = None

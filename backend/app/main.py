from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .schemas import ContactCreate, ContactUpdate
from .database import Base, engine, get_db

from . import models


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8081",
        "http://192.168.56.102:8081",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)


@app.get("/")
def accueil():
    return {"message": "Bienvenue dans l'API Contacts"}


@app.get("/contacts")
def liste_contacts(db: Session = Depends(get_db)):
    contacts = db.query(models.Contact).all()
    return contacts


@app.get("/contacts/{contact_id}")
def obtenir_contact(contact_id: int, db: Session = Depends(get_db)):
    contact = db.query(models.Contact).filter(models.Contact.id == contact_id).first()

    if contact is None:
        raise HTTPException(status_code=404, detail="Contact non trouvé")

    return contact


@app.put("/contacts/{contact_id}")
def modifier_contact(
    contact_id: int,
    contact_data: ContactUpdate,
    db: Session = Depends(get_db)
):
    contact = db.query(models.Contact).filter(
        models.Contact.id == contact_id
    ).first()

    if contact is None:
        raise HTTPException(
            status_code=404,
            detail="Contact non trouvé"
        )

    contact.nom = contact_data.nom
    contact.prenom = contact_data.prenom
    contact.email = contact_data.email
    contact.telephone = contact_data.telephone

    db.commit()
    db.refresh(contact)

    return contact


@app.post("/contacts")
def creer_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    nouveau_contact = models.Contact(
        nom=contact.nom,
        prenom=contact.prenom,
        email=contact.email,
        telephone=contact.telephone
    )

    db.add(nouveau_contact)
    db.commit()
    db.refresh(nouveau_contact)

    return nouveau_contact



@app.delete("/contacts/{contact_id}")
def supprimer_contact(contact_id: int, db: Session = Depends(get_db)):
    contact = db.query(models.Contact).filter(
        models.Contact.id == contact_id
    ).first()

    if contact is None:
        raise HTTPException(
            status_code=404,
            detail="Contact non trouvé"
        )

    db.delete(contact)
    db.commit()

    return {"message": "Contact supprimé avec succès"}

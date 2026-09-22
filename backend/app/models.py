from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Contact(Base):
    __tablename__ = "contacts"

    id: Mapped[int] = mapped_column(primary_key=True)
    nom: Mapped[str] = mapped_column(String(100), nullable=False)
    prenom: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(150), nullable=False)
    telephone: Mapped[str | None] = mapped_column(String(20), nullable=True)

from sqlalchemy import Column, Integer, String, Boolean
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    barcode = Column(String, unique=True)
    has_laptop = Column(Boolean, default=False)
    laptop_name = Column(String, nullable=True)

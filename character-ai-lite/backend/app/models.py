from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Character(Base):
    __tablename__ = "characters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    avatar_url = Column(String, nullable=True)
    description = Column(Text, default="")
    personality = Column(Text, default="")
    scenario = Column(Text, default="")
    greeting_message = Column(Text, default="")
    nationality = Column(String, default="Unknown")
    appearance = Column(Text, default="")
    speaking_style = Column(Text, default="")

    chats = relationship("Chat", back_populates="character", cascade="all, delete")


class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    character_id = Column(Integer, ForeignKey("characters.id"))
    title = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    character = relationship("Character", back_populates="chats")
    messages = relationship("Message", back_populates="chat", cascade="all, delete")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(Integer, ForeignKey("chats.id"))
    role = Column(String) # 'user' or 'assistant'
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    chat = relationship("Chat", back_populates="messages")


class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    ai_provider = Column(String, default="groq")
    image_generation_enabled = Column(Boolean, default=False)
    dark_mode = Column(Boolean, default=True)

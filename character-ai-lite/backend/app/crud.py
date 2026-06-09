from sqlalchemy.orm import Session
from app import models, schemas

# Character CRUD
def get_character(db: Session, character_id: int):
    return db.query(models.Character).filter(models.Character.id == character_id).first()

def get_characters(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Character).offset(skip).limit(limit).all()

def create_character(db: Session, character: schemas.CharacterCreate):
    db_character = models.Character(**character.model_dump())
    db.add(db_character)
    db.commit()
    db.refresh(db_character)
    return db_character

def update_character(db: Session, character_id: int, character: schemas.CharacterUpdate):
    db_character = get_character(db, character_id)
    if db_character:
        for key, value in character.model_dump().items():
            setattr(db_character, key, value)
        db.commit()
        db.refresh(db_character)
    return db_character

def delete_character(db: Session, character_id: int):
    db_character = get_character(db, character_id)
    if db_character:
        db.delete(db_character)
        db.commit()
    return db_character

# Chat CRUD
def get_chat(db: Session, chat_id: int):
    return db.query(models.Chat).filter(models.Chat.id == chat_id).first()

def get_chats(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Chat).order_by(models.Chat.updated_at.desc()).offset(skip).limit(limit).all()

def create_chat(db: Session, chat: schemas.ChatCreate):
    db_chat = models.Chat(**chat.model_dump())
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)
    return db_chat

def update_chat_title(db: Session, chat_id: int, title: str):
    db_chat = get_chat(db, chat_id)
    if db_chat:
        db_chat.title = title
        db.commit()
        db.refresh(db_chat)
    return db_chat

def delete_chat(db: Session, chat_id: int):
    db_chat = get_chat(db, chat_id)
    if db_chat:
        db.delete(db_chat)
        db.commit()
    return db_chat

# Message CRUD
def get_messages(db: Session, chat_id: int, limit: int = 20):
    return db.query(models.Message).filter(models.Message.chat_id == chat_id).order_by(models.Message.created_at.asc()).limit(limit).all()

def create_message(db: Session, chat_id: int, message: schemas.MessageCreate):
    db_message = models.Message(**message.model_dump(), chat_id=chat_id)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

# Settings CRUD
def get_settings(db: Session):
    settings = db.query(models.Settings).first()
    if not settings:
        settings = models.Settings()
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

def update_settings(db: Session, settings_update: schemas.SettingsUpdate):
    db_settings = get_settings(db)
    for key, value in settings_update.model_dump().items():
        setattr(db_settings, key, value)
    db.commit()
    db.refresh(db_settings)
    return db_settings

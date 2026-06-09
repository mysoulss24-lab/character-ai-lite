from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import crud, models, schemas
from app.database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.ChatResponse])
def read_chats(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_chats(db, skip=skip, limit=limit)

@router.get("/{chat_id}", response_model=schemas.ChatDetailResponse)
def read_chat(chat_id: int, db: Session = Depends(get_db)):
    db_chat = crud.get_chat(db, chat_id=chat_id)
    if db_chat is None:
        raise HTTPException(status_code=404, detail="Chat not found")
    return db_chat

@router.post("/", response_model=schemas.ChatResponse)
def create_chat(chat: schemas.ChatCreate, db: Session = Depends(get_db)):
    db_character = crud.get_character(db, chat.character_id)
    if db_character is None:
        raise HTTPException(status_code=404, detail="Character not found")
    return crud.create_chat(db=db, chat=chat)

@router.delete("/{chat_id}", response_model=schemas.ChatResponse)
def delete_chat(chat_id: int, db: Session = Depends(get_db)):
    db_chat = crud.delete_chat(db, chat_id)
    if db_chat is None:
        raise HTTPException(status_code=404, detail="Chat not found")
    return db_chat

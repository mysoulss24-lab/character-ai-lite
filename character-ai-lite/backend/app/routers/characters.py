from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import crud, models, schemas
from app.database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.CharacterResponse])
def read_characters(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    characters = crud.get_characters(db, skip=skip, limit=limit)
    return characters

@router.get("/{character_id}", response_model=schemas.CharacterResponse)
def read_character(character_id: int, db: Session = Depends(get_db)):
    db_character = crud.get_character(db, character_id=character_id)
    if db_character is None:
        raise HTTPException(status_code=404, detail="Character not found")
    return db_character

@router.post("/", response_model=schemas.CharacterResponse)
def create_character(character: schemas.CharacterCreate, db: Session = Depends(get_db)):
    return crud.create_character(db=db, character=character)

@router.put("/{character_id}", response_model=schemas.CharacterResponse)
def update_character(character_id: int, character: schemas.CharacterUpdate, db: Session = Depends(get_db)):
    db_character = crud.update_character(db, character_id, character)
    if db_character is None:
        raise HTTPException(status_code=404, detail="Character not found")
    return db_character

@router.delete("/{character_id}", response_model=schemas.CharacterResponse)
def delete_character(character_id: int, db: Session = Depends(get_db)):
    db_character = crud.delete_character(db, character_id)
    if db_character is None:
        raise HTTPException(status_code=404, detail="Character not found")
    return db_character

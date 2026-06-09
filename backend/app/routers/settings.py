from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import crud, schemas
from app.database import get_db

router = APIRouter()

@router.get("/", response_model=schemas.SettingsResponse)
def read_settings(db: Session = Depends(get_db)):
    return crud.get_settings(db)

@router.put("/", response_model=schemas.SettingsResponse)
def update_settings(settings: schemas.SettingsUpdate, db: Session = Depends(get_db)):
    return crud.update_settings(db, settings)

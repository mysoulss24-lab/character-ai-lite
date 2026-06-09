from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import crud, models, schemas
from app.database import get_db
from app.services.ai_service import generate_ai_response

router = APIRouter()

@router.post("/{chat_id}/messages", response_model=schemas.MessageResponse)
def send_message(chat_id: int, message: schemas.MessageSend, db: Session = Depends(get_db)):
    chat = crud.get_chat(db, chat_id=chat_id)
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    # Update chat timestamp
    crud.update_chat_title(db, chat_id, chat.title)
        
    # Save user message
    user_msg = schemas.MessageCreate(role="user", content=message.content)
    crud.create_message(db, chat_id=chat_id, message=user_msg)
    
    # Get context (last 20 messages)
    history = crud.get_messages(db, chat_id=chat_id, limit=20)
    
    # We pass history[:-1] to the generator because current message is already in history, 
    # but the AI service function appends current message manually, so let's filter history.
    # Actually `crud.get_messages` returns the latest 20. The last one is the one we just saved.
    history_for_context = history[:-1] if history else []

    app_settings = crud.get_settings(db)
    
    # Generate AI response
    ai_content = generate_ai_response(
        character=chat.character,
        history=history_for_context,
        current_message=message.content,
        app_settings=app_settings
    )
    
    # Save AI message
    ai_msg = schemas.MessageCreate(role="assistant", content=ai_content)
    return crud.create_message(db, chat_id=chat_id, message=ai_msg)

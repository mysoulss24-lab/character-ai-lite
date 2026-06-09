from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

# Character Schemas
class CharacterBase(BaseModel):
    name: str
    avatar_url: Optional[str] = None
    description: Optional[str] = ""
    personality: Optional[str] = ""
    scenario: Optional[str] = ""
    greeting_message: Optional[str] = ""
    nationality: Optional[str] = "Unknown"
    appearance: Optional[str] = ""
    speaking_style: Optional[str] = ""
    user_description: Optional[str] = ""
    additional_characters: Optional[str] = "[]"

class CharacterCreate(CharacterBase):
    pass

class CharacterUpdate(CharacterBase):
    pass

class CharacterResponse(CharacterBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

# Message Schemas
class MessageBase(BaseModel):
    role: str
    content: str

class MessageCreate(MessageBase):
    pass

class MessageResponse(MessageBase):
    id: int
    chat_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class MessageSend(BaseModel):
    content: str

# Chat Schemas
class ChatBase(BaseModel):
    title: str
    is_saved: Optional[bool] = False

class ChatCreate(ChatBase):
    character_id: int

class ChatResponse(ChatBase):
    id: int
    character_id: int
    created_at: datetime
    updated_at: datetime
    is_saved: bool

    model_config = ConfigDict(from_attributes=True)

class ChatDetailResponse(ChatResponse):
    character: CharacterResponse
    messages: List[MessageResponse] = []

    model_config = ConfigDict(from_attributes=True)

# Settings Schemas
class SettingsBase(BaseModel):
    ai_provider: str
    image_generation_enabled: bool
    dark_mode: bool

class SettingsUpdate(SettingsBase):
    pass

class SettingsResponse(SettingsBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

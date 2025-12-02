from pydantic import BaseModel, EmailStr

class LoginSchema(BaseModel):
    email: str
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class PasswordChangeRequest(BaseModel):
    old_password: str
    new_password: str

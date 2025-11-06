from fastapi import FastAPI, APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

# Simpan user dalam memory (untuk testing)
users = []
# Database in memory
wishlist_db = {}

class UserRegister(BaseModel):
    email: str
    password: str
    username: str

class UserLogin(BaseModel):
    email: str
    password: str

class Product(BaseModel):
    id: Optional[str]
    image_url: Optional[str]
    name_display: str
    brand_display: str
    price_num: Optional[float]
    rating_num: Optional[float]
    tags: Optional[str]
    buy_url: Optional[str]

@router.get("/users")
async def get_users():
    # Return list of users without passwords for security
    return {
        "success": True,
        "users": [
            {
                "email": user["email"],
                "username": user["username"]
            } 
            for user in users
        ]
    }

@router.post("/register")
async def register(user: UserRegister):
    if any(u["email"] == user.email for u in users):
        return {"success": False, "message": "Email already registered"}
    
    users.append(user.dict())
    return {"success": True, "message": "Registration successful"}

@router.post("/login")
async def login(user: UserLogin):  # Changed to use UserLogin model
    found_user = next(
        (u for u in users if u["email"] == user.email and u["password"] == user.password),
        None
    )
    
    if found_user:
        return {"success": True, "user": found_user}
    return {"success": False, "message": "Invalid credentials"}

@router.post("/wishlist/{user_email}/add")
async def add_to_wishlist(user_email: str, products: List[Product]):
    print("Received request to add products for user:", user_email)  # Debug print
    print("Products:", products)  # Debug print
    
    if user_email not in wishlist_db:
        wishlist_db[user_email] = []
    
    for product in products:
        if product.dict() not in wishlist_db[user_email]:
            wishlist_db[user_email].append(product.dict())
    
    return {"success": True, "message": "Products added to wishlist"}
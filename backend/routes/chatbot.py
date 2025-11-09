from fastapi import APIRouter, Depends, Request
from database import db
from difflib import get_close_matches
from bson import ObjectId
from .jobs import serialize_job
from .admin import admin_only

router = APIRouter()

@router.post("/chatbot")
async def chat_with_bot(request: Request):
    data = await request.json()
    user_question = data.get("question", "").strip().lower()

    faqs = await db.faqs.find({}).to_list(None)
    questions = [faq['question'].lower() for faq in faqs]
    match = get_close_matches(user_question, questions, n=1, cutoff=0.6)

    if match:
        matched_faq = next((faq for faq in faqs if faq["question"].lower() == match[0]), "Sorry i didn't know answer.")

        if matched_faq and isinstance(matched_faq, dict):     
            return {"answer": matched_faq["answer"]}
    else:
        return {"answer": "I'm sorry, I couldn't find a relevant answer. Please contact support."}

# get all faq
@router.get("/admin/faqs/")
async def get_all_faqs(current_user: dict = Depends(admin_only)):
    faqs = await db.faqs.find().to_list(None)
    return [serialize_job(faq) for faq in faqs]
    
# create faq route
@router.post("/admin/faq/")
async def create_faq(faq: dict, current_user: dict = Depends(admin_only)):
    result = await db.faqs.insert_one(faq)
    return {"message": "FAQ created successfully", "id": str(result.inserted_id)}

# update faq
@router.put("/admin/faq/{faq_id}")
async def update_faq(faq_id: str, updated_data: dict, current_user: dict = Depends(admin_only)):
    updated_data.pop("_id", None)
    updated_data.pop("id", None)
    result = await db.faqs.update_one({"_id": ObjectId(faq_id)}, {"$set": updated_data})
    return {"message": "FAQ updated successfully" if result.modified_count else "No changes made"}

# delete faq
@router.delete("/admin/faq/{faq_id}")
async def delete_faq(faq_id: str, current_user: dict = Depends(admin_only)):
    result = await db.faqs.delete_one({"_id": ObjectId(faq_id)})
    return {"message": "FAQ deleted successfully" if result.deleted_count else "FAQ not found"}


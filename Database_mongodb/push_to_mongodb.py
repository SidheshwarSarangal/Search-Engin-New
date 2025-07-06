import json
from pymongo import MongoClient

# MongoDB connection (replace with your real credentials)
MONGO_URI = "mongodb+srv://srchEngn:srchEngn123@cluster0.ut32dlk.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client["personal_blogs"]
collection = db["entries"]

# Load AI-filtered blog entries
with open("../ai_filter/output/filtered_data.json", "r", encoding="utf-8") as f:
    entries = json.load(f)

inserted_count = 0
skipped_count = 0
irrelevant_count = 0

for entry in entries:
    url = entry.get("url")
    is_relevant = entry.get("relevant", False)

    if not url:
        continue  # skip entries without URL

    if not is_relevant:
        irrelevant_count += 1
        continue  # skip irrelevant entries

    if collection.find_one({"url": url}):
        skipped_count += 1
    else:
        collection.insert_one(entry)
        inserted_count += 1

print(f"✅ Inserted: {inserted_count}")
print(f"⏭️ Skipped (duplicate URL): {skipped_count}")
print(f"🚫 Skipped (irrelevant): {irrelevant_count}")

from pymongo import MongoClient
from es_config import es, INDEX_NAME

# MongoDB connection
MONGO_URI = "mongodb+srv://srchEngn:srchEngn123@cluster0.ut32dlk.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client["personal_blogs"]
collection = db["entries"]

# 🚫 Do NOT delete index
# Just ensure the index exists
if not es.indices.exists(index=INDEX_NAME):
    es.indices.create(index=INDEX_NAME)
    print(f"🆕 Created new index: {INDEX_NAME}")
else:
    print(f"📁 Index already exists: {INDEX_NAME}")

total = collection.count_documents({})
print(f"📦 MongoDB total documents: {total}")

count = 0
for entry in collection.find():
    entry.pop("_id", None)
    url = entry.get("url")

    if not url:
        print("⚠️ Skipping: missing URL")
        continue

    # Check if document with this URL already exists in ES
    if es.exists(index=INDEX_NAME, id=url):
        print(f"⏭️ Skipping already indexed: {url}")
        continue

    # Fill defaults for missing fields
    entry["title"] = entry.get("title", "(No Title)")
    entry["author"] = entry.get("author", "(Unknown)")
    entry["date"] = entry.get("date", "")
    entry["summary"] = entry.get("summary", "(No Summary)")
    entry["reason"] = entry.get("reason", "(No Reason Provided)")

    try:
        es.index(index=INDEX_NAME, id=url, body=entry)
        count += 1
        print(f"✅ Indexed: {url}")
    except Exception as e:
        print(f"❌ Failed to index {url}: {e}")

print(f"\n✅ Total newly indexed: {count}")

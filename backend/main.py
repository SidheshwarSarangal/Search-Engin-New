from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from es_config import es, INDEX_NAME

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adjust to frontend port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/search")
def search_blogs(q: str = Query(..., description="Search query")):
    body = {
        "query": {
            "multi_match": {
                "query": q,
                "fields": [
                    "title^3",       # boost title
                    "author^2",
                    "summary",
                    "reason"
                ]
            }
        }
    }

    res = es.search(index=INDEX_NAME, body=body, size=100)
    hits = res["hits"]["hits"]

    return {
        "results": [
            {
                "title": hit["_source"].get("title", "Untitled"),
                "author": hit["_source"].get("author", "Unknown"),
                "summary": hit["_source"].get("summary", ""),
                "reason": hit["_source"].get("reason", ""),
                "url": hit["_source"].get("url", ""),
                "score": hit["_score"]
            }
            for hit in hits
        ]
    }

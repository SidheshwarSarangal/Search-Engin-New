import json, yaml, time, os
from processor import classify_blog_url

# Load config
with open("config.yaml", "r") as f:
    config = yaml.safe_load(f)

# Load or initialize output
output_path = config["output_path"]
if os.path.exists(output_path):
    with open(output_path, "r", encoding="utf-8") as f:
        processed = json.load(f)
        done_urls = set(entry["url"] for entry in processed)
else:
    processed = []
    done_urls = set()

# Load input URLs
with open(config["input_path"], "r", encoding="utf-8") as f:
    urls = json.load(f)

model = config["model"]

for i, url in enumerate(urls):
    if url in done_urls:
        continue

    print(f"🔗 [{i+1}/{len(urls)}] Processing: {url}")
    result = classify_blog_url(url, model=model)
    processed.append(result)

    # Save immediately after each result
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(processed, f, indent=2, ensure_ascii=False)
    print(f"💾 Saved result for: {url}")

print("✅ All done. Final output saved to", output_path)

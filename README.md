# Search Engine for Blogs and Articles.
This project is done under GDSC @IIT Roorkee. The problem statement was to create a search engine which only shows good and useful personal blogs and article. There should be no course selling pages, advertisement pages or any generic advice pages. 
---
## Description
The project uses the crawler to crawl over the internet and collect the links. The AI-filter then marks the relevant links and py=ut their title, summery, etc. Then this is pushed to mongodb. After this, the data pushed to mongodb is then indexed. I am using elastic search for this. The backend will run the backend to search from the indexed data and the frontend will allow the user to intect with the browser.

The project consists of 5 parts -
- Crawler
- Ai Filter
- Push To Database
- Backend
- Frontend
Note- I have provided the descriptions of each part and the working process together as following-

## Dependencies
You need to install the dependencies in the dofferent folders. For this do -
**In the backend, ai_filter, crawler, Database_mongodb do -**
```bash
     pip install -r requirements.txt
```
**In the frontend, do-**
```bash
    npm install
```

---
## Crawler
The crawler is used to crawl over the internet to get a list of web page links. It uses Breadth-first-search approach. It goes to the web page of the given link and crawl over that web page document, where it finds new links. Then it goes throgh the webpages of those links and this process continues. Along with moving to the different pages, it saves its links and if any saved link comes again then it is not added to the list and we do not move to that again. With this go through the links till we get no more new links and all such unique links are saved.  

**To run this:**

- **Put the link of a website (or several links) in `seed_urls.txt` inside the `crawler` folder.**

- **Then, in the root directory:**

  1. **Move to the crawler folder:**
     ```bash
     cd crawler
     ```

  2. **Run the crawler:**
     ```bash
     scrapy crawl link_collector
     ```

**This will generate a list of links in the file `collected_links.json` located in the `output` folder inside `crawler`.**

---
## AI Filter
This is used prepare a list of links with their link url, summary, author(if present), date(if present) and to mark the useful and relevant links (personal blogs, articles and useful webpages) as true and also put the reason. We are using AI Model Gemma3:1b which is put in our systems with help of ollama. It uses the list created above which is the output of crawler. The prompt we are using is this -
```
You're a blog classifier.
Given a web page's title and first 1200 characters of cleaned content, determine whether it's a **personal blog post** — not marketing, not company, not media.
Respond in **this exact JSON format**:
{{
  "relevant": true or false,
  "reason": "short reason",
  "summary": "brief 2-line summary"
}}
Mark "relevant": true ONLY if:
- It's a thoughtful, reflective blog post or article
- NOT commercial or promotional
- Written in a personal voice (first-person, subjective)
- NOT a landing page or company post
- NOT a news or SEO article
```
There are certain other parameters as well such as domain checking, size of the web page document and declining media(image/audio/video) links. Also we check only first 1000 charaters as Gemma3:1b as it will make the task complete faster.

**To run this:**

- **In the root, open terminal and follow these steps:**

  1. **Move to the `ai_filter` folder:**

     ```bash
     cd ai_filter
     ```

  2. **Run the command:**

     ```bash
     python main.py
     ```

**You will get the filtered links in the `output` folder, inside the file `filtered_data.json`.**

---
## Push to Database
This is done to save only the relevant entries, from the list created as the output of ai filter, to the database which we have chosen as MongoDb.
**To run this:**

- **In the root, open the terminal and follow these steps:**

  1. **Move to the `Database_mongodb` folder:**

     ```bash
     cd Database_mongodb
     ```

  2. **Run the command:**

     ```bash
     python push_to_mongodb.py
     ```

**This will save the entries to the database.**

---
## Backend
The backend consists of two parts -
- Indexing
- Searching with elastic search

In indexing, we just use the entries from the Mongodb and do index them. Indexng is the process of collecting, analyzing, and storing web page data so that it can be retieved and displayed in the search result quickly. I have used Bonsai search for this.
**To run this:**

- **In the root, open the terminal and follow these steps:**

  1. **Move to the `backend` folder:**

     ```bash
     cd backend
     ```

  2. **Run the command:**

     ```bash
     python populate_es.py
     ```

**The entries will now be indexed.**

The searching part is just retreiving the results from the indexed entries on search. Searching will be done with considering title, author, summary and reason. To run the backend, do-

- **In the root, open the terminal and follow these steps:**

  1. **Move to the `backend` folder:**

     ```bash
     cd backend
     ```

  2. **Run the command:**

     ```bash
     uvicorn main:app --reload
     ```

**The backend wll run.**

---

## Frontend

With the forntend you can searh and get the results. It is bullt with React.js and tailwind. In the search result, you see the resulting links page wise.

To run the frontend, do-

- **In the root, open the terminal and follow these steps:**

  1. **Move to the `frontend` folder:**

     ```bash
     cd frontend
     ```

  2. **Run the command:**

     ```bash
     npm run dev
     ```

**The backend wll run.**

---

This is the complete project.

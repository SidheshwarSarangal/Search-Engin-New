import scrapy
from urllib.parse import urljoin

class LinkSpider(scrapy.Spider):
    name = "link_collector"

    def __init__(self):
        self.visited = set()
        self.all_links = set()

    def start_requests(self):
        with open("seed_urls.txt", "r") as f:
            for line in f:
                url = line.strip()
                if url:
                    self.visited.add(url)
                    yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        base_url = response.url
        links = response.css('a::attr(href)').getall()

        for link in links:
            full_url = urljoin(base_url, link)
            if full_url.startswith("http") and full_url not in self.visited:
                self.visited.add(full_url)
                self.all_links.add(full_url)
                yield scrapy.Request(full_url, callback=self.parse)

    def closed(self, reason):
        with open("output/collected_links.json", "w", encoding="utf-8") as f:
            import json
            json.dump(sorted(self.all_links), f, indent=2, ensure_ascii=False)

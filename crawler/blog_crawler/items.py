import scrapy

class BlogCrawlerItem(scrapy.Item):
    url = scrapy.Field()

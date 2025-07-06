from opensearchpy import OpenSearch

BONSAI_URL = "https://rmbm6unac8:4pyvzzoua5@cluster0-6692640281.ap-southeast-2.bonsaisearch.net:443"

es = OpenSearch(
    BONSAI_URL,
    use_ssl=True,
    verify_certs=True
)

INDEX_NAME = "personal_blogs"

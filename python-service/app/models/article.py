from dataclasses import dataclass


@dataclass
class Article:
    title: str
    summary: str
    body: str
    url: str
    published: str
    source: str

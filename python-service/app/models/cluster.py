from dataclasses import dataclass, field
from typing import Any


@dataclass
class Cluster:
    cluster_id: str
    label: str
    articles: list[dict[str, Any]] = field(default_factory=list)
    article_count: int = 0
    start_time: str = ""
    end_time: str = ""
    intensity: int = 0

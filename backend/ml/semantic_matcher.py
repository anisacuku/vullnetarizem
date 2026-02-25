from __future__ import annotations

from functools import lru_cache
from typing import Any, Dict, List

import numpy as np


@lru_cache(maxsize=1)
def _get_model(model_name: str = "all-MiniLM-L6-v2"):
    # Cache the model so it loads only once per server run
    from sentence_transformers import SentenceTransformer  # type: ignore
    return SentenceTransformer(model_name)


def _to_list(x: Any) -> List[str]:
    if not x:
        return []
    if isinstance(x, str):
        return [x]
    if isinstance(x, (list, tuple, set)):
        return [str(i).strip() for i in x if i is not None and str(i).strip()]
    return [str(x).strip()]


def _build_volunteer_text(volunteer: Dict[str, Any]) -> str:
    name = str(volunteer.get("name", "")).strip()
    skills = _to_list(volunteer.get("skills"))
    interests = _to_list(volunteer.get("interests"))

    parts: List[str] = []
    if name:
        parts.append(f"Volunteer: {name}")
    if skills:
        parts.append("Skills: " + ", ".join(skills))
    if interests:
        parts.append("Interests: " + ", ".join(interests))

    return "\n".join(parts).strip()


def _build_opportunity_text(opportunity: Dict[str, Any]) -> str:
    title = str(opportunity.get("title", "")).strip()
    description = str(opportunity.get("description", "")).strip()
    skills_required = _to_list(opportunity.get("skills_required"))
    interests = _to_list(opportunity.get("interests"))
    location = str(opportunity.get("location", "")).strip()

    parts: List[str] = []
    if title:
        parts.append(f"Opportunity: {title}")
    if skills_required:
        parts.append("Required skills: " + ", ".join(skills_required))
    if interests:
        parts.append("Interests: " + ", ".join(interests))
    if location:
        parts.append(f"Location: {location}")
    if description:
        parts.append("Description: " + description)

    return "\n".join(parts).strip()


def semantic_match_score(volunteer: Dict[str, Any], opportunity: Dict[str, Any]) -> float:
    """
    Returns semantic similarity score in [0, 100].
    Uses sentence embeddings + cosine similarity (offline).
    """
    v_text = _build_volunteer_text(volunteer)
    o_text = _build_opportunity_text(opportunity)

    if not v_text or not o_text:
        return 0.0

    model = _get_model()

    # normalize_embeddings=True makes dot product == cosine similarity
    v_emb = model.encode(v_text, normalize_embeddings=True)
    o_emb = model.encode(o_text, normalize_embeddings=True)

    sim = float(np.dot(v_emb, o_emb))  # ~0..1 in practice
    sim = max(0.0, min(1.0, sim))

    return sim * 100.0
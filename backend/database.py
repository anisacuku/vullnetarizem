import os
import json
import csv
from typing import Dict, List, Any, Optional, Tuple
from passlib.context import CryptContext
from datetime import datetime

# =========================
# Paths (ABSOLUTE, stable)
# =========================
# Always resolve paths relative to this file so "data/" is consistent no matter
# where you run uvicorn from.
_BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
_PROJECT_ROOT = os.path.abspath(os.path.join(_BACKEND_DIR, ".."))

DATA_DIR = os.path.join(_PROJECT_ROOT, "data")
VOLUNTEERS_FILE = os.path.join(DATA_DIR, "volunteers.csv")
ORGANIZATIONS_FILE = os.path.join(DATA_DIR, "organizations.csv")
OPPORTUNITIES_FILE = os.path.join(DATA_DIR, "opportunities.csv")
MATCHES_FILE = os.path.join(DATA_DIR, "matches.csv")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

os.makedirs(DATA_DIR, exist_ok=True)


# =========================
# Init files if missing
# =========================
def _ensure_csv(path: str, headers: List[str]) -> None:
    if os.path.exists(path):
        return
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()


def init_data_files() -> None:
    _ensure_csv(
        VOLUNTEERS_FILE,
        ["id", "email", "name", "password", "user_type", "skills", "interests", "availability"],
    )
    _ensure_csv(
        ORGANIZATIONS_FILE,
        ["id", "email", "name", "password", "user_type", "description", "website", "contact"],
    )
    _ensure_csv(
        OPPORTUNITIES_FILE,
        ["id", "title", "description", "organization_id", "skills_required", "interests",
         "location", "date", "duration", "time_requirements"],
    )
    _ensure_csv(
        MATCHES_FILE,
        ["id", "volunteer_id", "opportunity_id", "match_score", "status",
         "volunteer_feedback", "organization_feedback", "created_at", "updated_at"],
    )


init_data_files()


# =========================
# JSON helpers
# =========================
def serialize_list(data: Any) -> str:
    return json.dumps(data) if isinstance(data, list) else "[]"


def serialize_dict(data: Any) -> str:
    return json.dumps(data) if isinstance(data, dict) else "{}"


def deserialize_list(data: Any) -> List[Any]:
    if data is None:
        return []
    s = str(data).strip()
    if not s or s.lower() == "nan":
        return []
    try:
        return json.loads(s)
    except Exception:
        return []


def deserialize_dict(data: Any) -> Dict[str, Any]:
    if data is None:
        return {}
    s = str(data).strip()
    if not s or s.lower() == "nan":
        return {}
    try:
        return json.loads(s)
    except Exception:
        return {}


def _safe_int(v: Any, default: int = 0) -> int:
    try:
        return int(str(v).strip())
    except Exception:
        return default


def _safe_float(v: Any, default: float = 0.0) -> float:
    try:
        return float(str(v).strip())
    except Exception:
        return default


def _file_mtime(path: str) -> float:
    try:
        return os.path.getmtime(path)
    except OSError:
        return 0.0


def _read_csv_rows(path: str) -> List[Dict[str, str]]:
    with open(path, "r", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return [row for row in reader]


def _append_csv_row(path: str, row: Dict[str, str], headers: List[str]) -> None:
    with open(path, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writerow(row)


def _rewrite_csv(path: str, rows: List[Dict[str, str]], headers: List[str]) -> None:
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)


# =========================
# In-memory caches (FAST login)
# =========================
_VOL_CACHE = {"mtime": -1.0, "by_email": {}, "by_id": {}}
_ORG_CACHE = {"mtime": -1.0, "by_email": {}, "by_id": {}}


def _reload_user_caches_if_needed() -> None:
    global _VOL_CACHE, _ORG_CACHE

    vol_mtime = _file_mtime(VOLUNTEERS_FILE)
    if vol_mtime != _VOL_CACHE["mtime"]:
        by_email: Dict[str, Dict[str, Any]] = {}
        by_id: Dict[Tuple[int, str], Dict[str, Any]] = {}

        for r in _read_csv_rows(VOLUNTEERS_FILE):
            email = (r.get("email") or "").strip()
            if not email:
                continue
            user = {
                "id": _safe_int(r.get("id"), 0),
                "email": email,
                "name": r.get("name") or "",
                "password": r.get("password") or "",
                "user_type": r.get("user_type") or "volunteer",
                "skills": deserialize_list(r.get("skills", "[]")),
                "interests": deserialize_list(r.get("interests", "[]")),
                "availability": deserialize_dict(r.get("availability", "{}")),
            }
            by_email[email] = user
            by_id[(user["id"], "volunteer")] = user

        _VOL_CACHE = {"mtime": vol_mtime, "by_email": by_email, "by_id": by_id}

    org_mtime = _file_mtime(ORGANIZATIONS_FILE)
    if org_mtime != _ORG_CACHE["mtime"]:
        by_email = {}
        by_id = {}

        for r in _read_csv_rows(ORGANIZATIONS_FILE):
            email = (r.get("email") or "").strip()
            if not email:
                continue
            user = {
                "id": _safe_int(r.get("id"), 0),
                "email": email,
                "name": r.get("name") or "",
                "password": r.get("password") or "",
                "user_type": r.get("user_type") or "organization",
                "description": r.get("description") or "",
                "website": r.get("website") or "",
                "contact": r.get("contact") or "",
            }
            by_email[email] = user
            by_id[(user["id"], "organization")] = user

        _ORG_CACHE = {"mtime": org_mtime, "by_email": by_email, "by_id": by_id}


# =========================
# User operations
# =========================
def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    if not email:
        return None
    _reload_user_caches_if_needed()
    email = email.strip()
    return _VOL_CACHE["by_email"].get(email) or _ORG_CACHE["by_email"].get(email)


def get_user_by_id(user_id: int, user_type: str) -> Optional[Dict[str, Any]]:
    _reload_user_caches_if_needed()
    key = (_safe_int(user_id, 0), user_type)
    if user_type == "volunteer":
        return _VOL_CACHE["by_id"].get(key)
    return _ORG_CACHE["by_id"].get(key)


def create_user(user_data: Dict[str, Any]) -> Dict[str, Any]:
    if user_data.get("user_type") == "organization":
        return create_organization(user_data)
    return create_volunteer(user_data)


def create_volunteer(data: Dict[str, Any]) -> Dict[str, Any]:
    _reload_user_caches_if_needed()
    existing_ids = [u["id"] for u in _VOL_CACHE["by_email"].values()] if _VOL_CACHE["by_email"] else []
    new_id = (max(existing_ids) + 1) if existing_ids else 1

    row = {
        "id": str(new_id),
        "email": str(data.get("email", "")).strip(),
        "name": str(data.get("name", "")),
        "password": str(data.get("password", "")),  # already hashed by auth.py
        "user_type": "volunteer",
        "skills": serialize_list(data.get("skills", [])),
        "interests": serialize_list(data.get("interests", [])),
        "availability": serialize_dict(data.get("availability", {})),
    }

    _append_csv_row(
        VOLUNTEERS_FILE,
        row,
        ["id", "email", "name", "password", "user_type", "skills", "interests", "availability"],
    )

    # update cache immediately
    user_obj = {
        "id": new_id,
        "email": row["email"],
        "name": row["name"],
        "password": row["password"],
        "user_type": row["user_type"],
        "skills": deserialize_list(row["skills"]),
        "interests": deserialize_list(row["interests"]),
        "availability": deserialize_dict(row["availability"]),
    }
    _VOL_CACHE["by_email"][user_obj["email"]] = user_obj
    _VOL_CACHE["by_id"][(new_id, "volunteer")] = user_obj
    _VOL_CACHE["mtime"] = _file_mtime(VOLUNTEERS_FILE)

    result = data.copy()
    result["id"] = new_id
    result.pop("password", None)
    return result


def create_organization(data: Dict[str, Any]) -> Dict[str, Any]:
    _reload_user_caches_if_needed()
    existing_ids = [u["id"] for u in _ORG_CACHE["by_email"].values()] if _ORG_CACHE["by_email"] else []
    new_id = (max(existing_ids) + 1) if existing_ids else 1

    row = {
        "id": str(new_id),
        "email": str(data.get("email", "")).strip(),
        "name": str(data.get("name", "")),
        "password": str(data.get("password", "")),  # already hashed by auth.py
        "user_type": "organization",
        "description": str(data.get("description", "")),
        "website": str(data.get("website", "")),
        "contact": str(data.get("contact", "")),
    }

    _append_csv_row(
        ORGANIZATIONS_FILE,
        row,
        ["id", "email", "name", "password", "user_type", "description", "website", "contact"],
    )

    user_obj = {
        "id": new_id,
        "email": row["email"],
        "name": row["name"],
        "password": row["password"],
        "user_type": row["user_type"],
        "description": row["description"],
        "website": row["website"],
        "contact": row["contact"],
    }
    _ORG_CACHE["by_email"][user_obj["email"]] = user_obj
    _ORG_CACHE["by_id"][(new_id, "organization")] = user_obj
    _ORG_CACHE["mtime"] = _file_mtime(ORGANIZATIONS_FILE)

    result = data.copy()
    result["id"] = new_id
    result.pop("password", None)
    return result


def verify_user(email: str, password: str) -> Optional[Dict[str, Any]]:
    # temp testing backdoor (remove for production)
    if password == "test123":
        return get_user_by_email(email)

    user = get_user_by_email(email)
    if not user:
        return None

    stored_hash = user.get("password")
    if not stored_hash:
        return None

    try:
        if not pwd_context.verify(password, stored_hash):
            return None
    except Exception:
        return None

    return user


# =========================
# Opportunity operations
# =========================
def get_all_opportunities() -> List[Dict[str, Any]]:
    try:
        rows = _read_csv_rows(OPPORTUNITIES_FILE)
        out: List[Dict[str, Any]] = []
        for r in rows:
            opp = dict(r)
            opp["id"] = _safe_int(r.get("id"), 0)
            opp["organization_id"] = _safe_int(r.get("organization_id"), 0)
            opp["skills_required"] = deserialize_list(r.get("skills_required", "[]"))
            opp["interests"] = deserialize_list(r.get("interests", "[]"))
            opp["time_requirements"] = deserialize_dict(r.get("time_requirements", "{}"))
            out.append(opp)
        return out
    except Exception as e:
        print(f"Opportunity load error: {e}")
        return []


def get_opportunity_by_id(opportunity_id: int) -> Optional[Dict[str, Any]]:
    try:
        target = _safe_int(opportunity_id, 0)
        for r in _read_csv_rows(OPPORTUNITIES_FILE):
            if _safe_int(r.get("id"), -1) == target:
                opp = dict(r)
                opp["id"] = target
                opp["organization_id"] = _safe_int(r.get("organization_id"), 0)
                opp["skills_required"] = deserialize_list(r.get("skills_required", "[]"))
                opp["interests"] = deserialize_list(r.get("interests", "[]"))
                opp["time_requirements"] = deserialize_dict(r.get("time_requirements", "{}"))
                return opp
    except Exception as e:
        print(f"Error getting opportunity by ID: {e}")
    return None


def create_opportunity(data: Dict[str, Any]) -> Dict[str, Any]:
    try:
        rows = _read_csv_rows(OPPORTUNITIES_FILE)
        ids = [_safe_int(r.get("id"), 0) for r in rows] if rows else []
        new_id = (max(ids) + 1) if ids else 1

        row = {
            "id": str(new_id),
            "title": str(data.get("title", "")),
            "description": str(data.get("description", "")),
            "organization_id": str(_safe_int(data.get("organization_id"), 0)),
            "skills_required": serialize_list(data.get("skills_required", [])),
            "interests": serialize_list(data.get("interests", [])),
            "location": str(data.get("location", "")),
            "date": str(data.get("date", "")),
            "duration": str(data.get("duration", "")),
            "time_requirements": serialize_dict(data.get("time_requirements", {})),
        }

        _append_csv_row(
            OPPORTUNITIES_FILE,
            row,
            ["id", "title", "description", "organization_id", "skills_required", "interests",
             "location", "date", "duration", "time_requirements"],
        )

        result = data.copy()
        result["id"] = new_id
        return result
    except Exception as e:
        print(f"Error creating opportunity: {e}")
        return {}


def get_organization_by_id(org_id: int) -> Optional[Dict[str, Any]]:
    return get_user_by_id(org_id, "organization")


# =========================
# Match operations
# =========================
def create_match(volunteer_id: int, opportunity_id: int, match_score: float) -> Dict[str, Any]:
    try:
        rows = _read_csv_rows(MATCHES_FILE)
        ids = [_safe_int(r.get("id"), 0) for r in rows] if rows else []
        new_id = (max(ids) + 1) if ids else 1

        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        match_row = {
            "id": str(new_id),
            "volunteer_id": str(_safe_int(volunteer_id, 0)),
            "opportunity_id": str(_safe_int(opportunity_id, 0)),
            "match_score": str(_safe_float(match_score, 0.0)),
            "status": "pending",
            "volunteer_feedback": serialize_dict({}),
            "organization_feedback": serialize_dict({}),
            "created_at": now,
            "updated_at": now,
        }

        _append_csv_row(
            MATCHES_FILE,
            match_row,
            ["id", "volunteer_id", "opportunity_id", "match_score", "status",
             "volunteer_feedback", "organization_feedback", "created_at", "updated_at"],
        )

        # return typed object
        return {
            "id": new_id,
            "volunteer_id": _safe_int(volunteer_id, 0),
            "opportunity_id": _safe_int(opportunity_id, 0),
            "match_score": _safe_float(match_score, 0.0),
            "status": "pending",
            "volunteer_feedback": {},
            "organization_feedback": {},
            "created_at": now,
            "updated_at": now,
        }
    except Exception as e:
        print(f"Error creating match: {e}")
        return {}


def get_volunteer_matches(volunteer_id: int) -> List[Dict[str, Any]]:
    try:
        target = _safe_int(volunteer_id, 0)
        rows = [r for r in _read_csv_rows(MATCHES_FILE) if _safe_int(r.get("volunteer_id"), -1) == target]
        if not rows:
            return []

        out: List[Dict[str, Any]] = []
        for r in rows:
            opp = get_opportunity_by_id(_safe_int(r.get("opportunity_id"), 0))
            if not opp:
                continue
            org = get_organization_by_id(_safe_int(opp.get("organization_id"), 0))
            org_name = org["name"] if org else "Unknown Organization"

            out.append({
                "id": _safe_int(r.get("id"), 0),
                "status": r.get("status", "pending"),
                "match_score": _safe_float(r.get("match_score"), 0.0),
                "created_at": r.get("created_at", ""),
                "opportunity": {
                    "id": opp["id"],
                    "title": opp.get("title", ""),
                    "description": opp.get("description", ""),
                    "organization_id": opp.get("organization_id", 0),
                    "organization_name": org_name,
                    "location": opp.get("location", ""),
                    "date": opp.get("date", ""),
                    "duration": opp.get("duration", ""),
                },
                "volunteer_feedback": deserialize_dict(r.get("volunteer_feedback", "{}")),
                "organization_feedback": deserialize_dict(r.get("organization_feedback", "{}")),
            })

        return out
    except Exception as e:
        print(f"Error getting volunteer matches: {e}")
        return []


def update_match_status(match_id: int, status: str) -> bool:
    try:
        target = _safe_int(match_id, 0)
        rows = _read_csv_rows(MATCHES_FILE)
        if not rows:
            return False

        updated = False
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        for r in rows:
            if _safe_int(r.get("id"), -1) == target:
                r["status"] = status
                r["updated_at"] = now
                updated = True
                break

        if not updated:
            return False

        headers = ["id", "volunteer_id", "opportunity_id", "match_score", "status",
                   "volunteer_feedback", "organization_feedback", "created_at", "updated_at"]
        _rewrite_csv(MATCHES_FILE, rows, headers)
        return True
    except Exception as e:
        print(f"Error updating match status: {e}")
        return False


def add_match_feedback(match_id: int, feedback: Dict[str, Any], feedback_type: str) -> bool:
    try:
        target = _safe_int(match_id, 0)
        rows = _read_csv_rows(MATCHES_FILE)
        if not rows:
            return False

        col = "volunteer_feedback" if feedback_type == "volunteer" else "organization_feedback"
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        updated = False
        for r in rows:
            if _safe_int(r.get("id"), -1) == target:
                r[col] = serialize_dict(feedback)
                r["updated_at"] = now
                updated = True
                break

        if not updated:
            return False

        headers = ["id", "volunteer_id", "opportunity_id", "match_score", "status",
                   "volunteer_feedback", "organization_feedback", "created_at", "updated_at"]
        _rewrite_csv(MATCHES_FILE, rows, headers)
        return True
    except Exception as e:
        print(f"Error adding match feedback: {e}")
        return False
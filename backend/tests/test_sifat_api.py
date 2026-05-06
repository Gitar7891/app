"""Backend API tests for Lezzet Dolu Sıfatlar (Turkish 6th-grade adjective game).
Covers: session create/get/update/complete + teacher endpoints + _id leakage.
"""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://sifat-oyunu.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def created_session(client):
    r = client.post(f"{API}/sessions", json={"student_name": "TEST_Ogrenci", "class_name": "TEST_6A"})
    assert r.status_code == 200, r.text
    data = r.json()
    return data


# ---------- Health ----------
def test_root(client):
    r = client.get(f"{API}/")
    assert r.status_code == 200
    assert "çalışıyor" in r.json().get("message", "")


# ---------- Session CRUD ----------
def test_create_session_returns_uuid(client, created_session):
    assert "id" in created_session
    assert len(created_session["id"]) == 36
    assert created_session["student_name"] == "TEST_Ogrenci"
    assert created_session["class_name"] == "TEST_6A"
    assert created_session["total_score"] == 0
    assert created_session["max_score"] == 0
    assert "_id" not in created_session


def test_get_session(client, created_session):
    sid = created_session["id"]
    r = client.get(f"{API}/sessions/{sid}")
    assert r.status_code == 200
    data = r.json()
    assert data["id"] == sid
    assert "_id" not in data


def test_get_session_404(client):
    r = client.get(f"{API}/sessions/nonexistent-uuid-1234")
    assert r.status_code == 404


def test_update_scene_recomputes_totals(client, created_session):
    sid = created_session["id"]
    # scene 1
    r1 = client.put(f"{API}/sessions/{sid}/scene", json={
        "scene": "scene_1", "score": 9, "max_score": 9,
        "answers": [{"phase": "identify", "picked": ["şık", "geniş", "aydınlık", "sıcak"]}],
    })
    assert r1.status_code == 200
    d1 = r1.json()
    assert d1["total_score"] == 9
    assert d1["max_score"] == 9
    assert "scene_1" in d1["scenes"]
    assert "_id" not in d1

    # scene 2
    r2 = client.put(f"{API}/sessions/{sid}/scene", json={
        "scene": "scene_2", "score": 4, "max_score": 4, "answers": [],
    })
    assert r2.status_code == 200
    assert r2.json()["total_score"] == 13
    assert r2.json()["max_score"] == 13

    # scene 3
    r3 = client.put(f"{API}/sessions/{sid}/scene", json={
        "scene": "scene_3", "score": 8, "max_score": 8, "answers": [],
    })
    assert r3.status_code == 200
    assert r3.json()["total_score"] == 21
    assert r3.json()["max_score"] == 21

    # scene 4 (Soru) - max 8 (5 phase1 + 3 phase2)
    r4 = client.put(f"{API}/sessions/{sid}/scene", json={
        "scene": "scene_4", "score": 8, "max_score": 8,
        "answers": [{"phase": "identify", "picked": ["Hangi", "Kaç", "Kaçıncı", "Ne", "Nasıl"]}],
    })
    assert r4.status_code == 200
    d4 = r4.json()
    assert d4["total_score"] == 29
    assert d4["max_score"] == 29
    assert "scene_4" in d4["scenes"]

    # scene 5 (Belgisiz) - max 7 (4 phase1 + 3 phase2)
    r5 = client.put(f"{API}/sessions/{sid}/scene", json={
        "scene": "scene_5", "score": 7, "max_score": 7,
        "answers": [{"phase": "identify", "picked": ["Bazı", "Birkaç", "Hiçbir", "Tüm"]}],
    })
    assert r5.status_code == 200
    d5 = r5.json()
    assert d5["total_score"] == 36
    assert d5["max_score"] == 36
    assert "scene_5" in d5["scenes"]


def test_update_scene_404(client):
    r = client.put(f"{API}/sessions/missing-id/scene", json={
        "scene": "scene_1", "score": 1, "max_score": 1, "answers": [],
    })
    assert r.status_code == 404


def test_complete_session(client, created_session):
    sid = created_session["id"]
    r = client.post(f"{API}/sessions/{sid}/complete")
    assert r.status_code == 200
    data = r.json()
    assert data["completed_at"] is not None
    assert "_id" not in data

    # Confirm via GET
    g = client.get(f"{API}/sessions/{sid}")
    assert g.status_code == 200
    assert g.json()["completed_at"] is not None


def test_complete_session_404(client):
    r = client.post(f"{API}/sessions/nonexistent/complete")
    assert r.status_code == 404


# ---------- Teacher endpoints ----------
def test_teacher_sessions_list(client, created_session):
    r = client.get(f"{API}/teacher/sessions")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert any(s["id"] == created_session["id"] for s in data)
    # No _id leak
    for s in data[:5]:
        assert "_id" not in s
    # Sorted desc by started_at
    if len(data) > 1:
        starts = [s["started_at"] for s in data]
        assert starts == sorted(starts, reverse=True)


def test_teacher_stats(client, created_session):
    r = client.get(f"{API}/teacher/stats")
    assert r.status_code == 200
    stats = r.json()
    for k in ("total_students", "total_completed", "avg_score", "avg_percent", "scene_stats"):
        assert k in stats
    assert stats["total_students"] >= 1
    assert stats["total_completed"] >= 1
    for sk in ("scene_1", "scene_2", "scene_3", "scene_4", "scene_5"):
        assert sk in stats["scene_stats"]
        for f in ("avg_score", "avg_max", "participants", "avg_percent"):
            assert f in stats["scene_stats"][sk]


# ---------- Cleanup ----------
def test_zz_cleanup(client, created_session):
    """Pseudo-cleanup: just verify session exists. Teacher panel keeps logs."""
    r = client.get(f"{API}/sessions/{created_session['id']}")
    assert r.status_code == 200

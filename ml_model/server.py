"""
복지 서비스 추천 FastAPI 서버
실행 순서:
  1. python train.py        (최초 1회)
  2. python server.py       (서버 시작)
  3. Spring Boot에서 http://localhost:8000/predict 호출
"""
import os
import re
import time

try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
except ImportError:
    pass

import xml.etree.ElementTree as ET
import joblib
import numpy as np
import requests
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from categories import CATEGORY_KEYWORDS
from roadmap_templates import build_roadmap

# ── 설정 ────────────────────────────────────────────────────────
API_KEY = os.environ["WELFARE_API_KEY"]
API_URL = "https://apis.data.go.kr/B554287/LocalGovernmentWelfareInformations/LcgvWelfarelist"
PAGES   = 10

app = FastAPI()

# ── 모델 로드 ────────────────────────────────────────────────────
model_data = joblib.load("model.pkl")
vectorizer = model_data["vectorizer"]
classifier = model_data["classifier"]
mlb        = model_data["mlb"]

# ── 서비스 캐시 ──────────────────────────────────────────────────
_cache: dict       = {}   # key: cache_key(str) → list of services
_cache_time: dict  = {}   # key: cache_key → timestamp
CACHE_TTL = 3600

# ── API 파라미터 코드 매핑 ────────────────────────────────────────
# lifeArray: 생애주기 코드
LIFE_CODES = {
    "청년":    "004",  # 청년
    "청소년":  "003",  # 청소년
    "아동보육": "002", # 아동
    "노인":    "006",  # 노년
    "신혼부부": "004", # 청년(신혼 포함)
    "출산임신": "004",
}
# trgterIndvdlArray: 가구상황 코드
TRGTER_CODES = {
    "저소득":  "010",
    "장애인":  "020",
    "한부모":  "030",
    "다자녀":  "060",
    "자립":    "010",
    "보훈":    "070",
}
# 시도명 → API ctpvNm 정규화
REGION_TO_CTPV = {
    "서울": "서울특별시", "경기": "경기도", "인천": "인천광역시",
    "부산": "부산광역시", "대구": "대구광역시", "광주": "광주광역시",
    "대전": "대전광역시", "울산": "울산광역시", "세종": "세종특별자치시",
    "강원": "강원도", "충북": "충청북도", "충남": "충청남도",
    "전북": "전라북도", "전남": "전라남도",
    "경북": "경상북도", "경남": "경상남도", "제주": "제주특별자치도",
}

# ── 카테고리 → 사람말 매핑 ───────────────────────────────────────
CAT_SITUATION = {
    "청년":       "청년",
    "취업일자리": "취업 준비 중",
    "주거":       "주거비 부담",
    "저소득":     "저소득",
    "출산임신":   "임신·출산",
    "아동보육":   "어린 자녀 양육",
    "노인":       "고령 가족 돌봄",
    "장애인":     "장애",
    "한부모":     "한부모 가정",
    "신혼부부":   "신혼",
    "보훈":       "국가유공자 가족",
    "자립":       "자립 준비",
    "다자녀":     "다자녀 가정",
    "청소년":     "청소년 자녀",
    "의료건강":   "의료비 부담",
}

CAT_REASON_TMPL = {
    "청년":       "청년을 대상으로 하는 지원 사업",
    "취업일자리": "취업·구직 활동을 돕는 사업",
    "주거":       "주거비 부담을 낮춰주는 사업",
    "저소득":     "저소득 가구의 생활 안정을 위한 사업",
    "출산임신":   "임신·출산 가정을 위한 지원 사업",
    "아동보육":   "자녀 양육을 지원하는 사업",
    "노인":       "어르신과 그 가족을 위한 돌봄 사업",
    "장애인":     "장애인의 자립과 활동을 지원하는 사업",
    "한부모":     "한부모 가정의 생활을 지원하는 사업",
    "신혼부부":   "신혼부부의 안정적인 정착을 돕는 사업",
    "보훈":       "국가유공자 및 가족을 위한 사업",
    "자립":       "자립 준비 청년을 위한 사업",
    "다자녀":     "다자녀 가정에 혜택을 드리는 사업",
    "청소년":     "청소년 자녀를 위한 지원 사업",
    "의료건강":   "의료비 부담을 줄여주는 건강 지원 사업",
}


# ── 사용자 프로필 추출 ────────────────────────────────────────────

def extract_user_profile(text: str) -> dict:
    """사용자 입력 텍스트에서 나이·소득·자산 정보 추출"""
    profile = {
        "age": None,             # 나이 (int, 세)
        "monthly_income": None,  # 월소득 (int, 만원)
        "asset_eok": None,       # 자산 (float, 억원)
        "asset_level": None,     # none / low / mid / high / very_high
        "household": None,       # alone / parents / family
        "unemployed": False,
        "region": None,
    }

    # 나이
    m = re.search(r'(\d{1,2})\s*(?:살|세)\b', text)
    if m:
        age = int(m.group(1))
        if 15 <= age <= 70:
            profile["age"] = age

    # 월 소득 (월 XX만원, 월급 XX만원 등)
    m = re.search(r'월\s*(?:소득|수입|급여|벌[어]?)?\s*(\d+)\s*만원', text)
    if m:
        profile["monthly_income"] = int(m.group(1))

    # 자산 — 억원 단위로 명시된 경우
    m = re.search(r'(?:자산|재산|저축|예금|적금)\s*(?:[이가은는]?\s*)?(?:약\s*)?(\d+(?:\.\d+)?)\s*억', text)
    if m:
        profile["asset_eok"] = float(m.group(1))
        eok = profile["asset_eok"]
        profile["asset_level"] = "very_high" if eok >= 5 else "high" if eok >= 2 else "mid"
    # 자산 — 천만원 단위
    elif re.search(r'(?:자산|재산|저축|예금)\s*(?:[이가]?\s*)?(\d+)\s*천만원', text):
        m2 = re.search(r'(?:자산|재산|저축|예금)\s*(?:[이가]?\s*)?(\d+)\s*천만원', text)
        chun = int(m2.group(1))
        profile["asset_eok"] = chun / 10
        profile["asset_level"] = "mid" if chun < 10 else "high"
    # 자산 없음 키워드
    elif any(kw in text for kw in ["무일푼", "빈털터리", "자산 없", "재산 없", "돈 없", "아무것도 없"]):
        profile["asset_level"] = "none"
    # 자산 있음 간접 표현 (집 있어요, 아파트 있어요)
    elif any(kw in text for kw in ["집 있", "아파트 있", "부동산 있"]):
        profile["asset_level"] = "high"

    # 주거 형태
    if any(kw in text for kw in ["자취", "혼자 살", "1인 가구", "원룸", "월세"]):
        profile["household"] = "alone"
    elif any(kw in text for kw in ["부모님", "본가", "부모와 같이", "부모님이랑"]):
        profile["household"] = "parents"

    # 미취업 여부
    if any(kw in text for kw in ["백수", "실업", "무직", "취준", "구직", "취업 준비", "취업준비"]):
        profile["unemployed"] = True

    # 지역
    regions = ["서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "세종",
               "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"]
    for r in regions:
        if r in text:
            profile["region"] = r
            break

    return profile


# ── 서비스 자격 기준 파싱 ─────────────────────────────────────────

def parse_eligibility(trgter: str, summary: str) -> dict:
    """서비스 지원 대상·요약에서 자격 기준 추출"""
    text = trgter + " " + summary
    elig = {
        "max_age": None,          # 나이 상한 (만 X세 이하)
        "min_age": None,          # 나이 하한 (만 X세 이상)
        "max_income_pct": None,   # 중위소득 X% 이하
        "max_asset_eok": None,    # 재산 X억 이하
        "only_recipient": False,  # 기초생활수급자 전용
    }

    # 나이 상한: "만 XX세 이하" / "XX세 미만"
    m = re.search(r'만\s*(\d+)\s*세\s*(?:이하|미만)', text)
    if m:
        elig["max_age"] = int(m.group(1))

    # 나이 하한: "만 XX세 이상"
    m = re.search(r'만\s*(\d+)\s*세\s*이상', text)
    if m:
        elig["min_age"] = int(m.group(1))

    # 중위소득 기준
    m = re.search(r'중위소득\s*(\d+)\s*%', text)
    if m:
        elig["max_income_pct"] = int(m.group(1))

    # 재산 기준: "재산 X억 이하" / "재산기준 X억원 이하"
    m = re.search(r'재산\s*(?:기준\s*)?(\d+(?:\.\d+)?)\s*억\s*(?:원\s*)?(?:이하|미만)', text)
    if m:
        elig["max_asset_eok"] = float(m.group(1))

    # 수급자 전용
    if any(kw in text for kw in ["기초생활수급자만", "수급자에 한", "수급자 및 차상위"]):
        elig["only_recipient"] = True

    return elig


def check_eligibility(profile: dict, elig: dict) -> tuple:
    """(통과 여부, 제외 이유) 반환. 정보 부족하면 통과로 처리."""
    age = profile.get("age")
    asset_eok = profile.get("asset_eok")
    asset_level = profile.get("asset_level")

    # 나이 상한 초과 (1세 여유 둠 — 생일 기준 애매함 방지)
    if age and elig["max_age"] and age > elig["max_age"] + 1:
        return False, f"나이 제한 초과 ({elig['max_age']}세 이하)"

    # 나이 하한 미달
    if age and elig["min_age"] and age < elig["min_age"] - 1:
        return False, f"나이 기준 미달 ({elig['min_age']}세 이상)"

    # 자산 초과 (금액이 명시된 경우에만)
    if asset_eok is not None and elig["max_asset_eok"] is not None:
        if asset_eok > elig["max_asset_eok"]:
            return False, f"자산 기준 초과 ({elig['max_asset_eok']}억 이하)"

    # 수급자 전용인데 자산이 있는 경우
    if elig["only_recipient"] and asset_level in ("mid", "high", "very_high"):
        return False, "기초생활수급자 전용"

    return True, ""


# ── 프로필 → 분석 카드 생성 ──────────────────────────────────────

def build_profile_analysis(user_input: str, profile: dict, predicted_cats: list) -> list:
    """사용자 프로필에서 로드맵 분석 카드 데이터 생성"""
    cards = []

    # 나이
    if profile.get("age"):
        cards.append({"icon": "👤", "label": "나이", "value": f"{profile['age']}세"})

    # 주거
    household_map = {"alone": "1인 독립 거주", "parents": "부모님과 동거", "family": "가족과 거주"}
    if profile.get("household"):
        cards.append({"icon": "🏠", "label": "거주", "value": household_map[profile["household"]]})

    # 소득
    if profile.get("monthly_income"):
        cards.append({"icon": "💰", "label": "월소득", "value": f"월 {profile['monthly_income']}만원"})
    elif profile.get("unemployed"):
        cards.append({"icon": "💰", "label": "소득", "value": "현재 무소득"})

    # 자산
    asset_label_map = {
        "none":      "자산 없음",
        "low":       "자산 소액",
        "mid":       f"{profile['asset_eok']}억원대" if profile.get('asset_eok') else "중간 수준",
        "high":      f"{profile['asset_eok']}억원대" if profile.get('asset_eok') else "일정 자산 보유",
        "very_high": f"{profile['asset_eok']}억원 이상",
    }
    if profile.get("asset_level"):
        cards.append({"icon": "💎", "label": "자산", "value": asset_label_map.get(profile["asset_level"], "")})

    # 상황 요약 (카테고리 기반)
    situations = [CAT_SITUATION[c] for c in predicted_cats if c in CAT_SITUATION]
    if situations:
        cards.append({"icon": "📋", "label": "상황", "value": " · ".join(situations[:3])})

    # 지역
    if profile.get("region"):
        cards.append({"icon": "📍", "label": "지역", "value": profile["region"]})

    # 카드가 너무 적으면 기본값으로 채움
    if len(cards) < 3:
        if not any(c["label"] == "나이" for c in cards):
            cards.insert(0, {"icon": "👤", "label": "나이", "value": "정보 없음"})
        if not any(c["label"] in ("소득", "월소득") for c in cards):
            cards.append({"icon": "💰", "label": "추정 소득", "value": "확인 필요"})

    return cards[:5]


# ── 유틸 함수 ────────────────────────────────────────────────────

REGIONS = ["서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "세종",
           "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"]


def get_service_region(name: str, org: str) -> str:
    """서비스 이름·소관기관에서 대상 지역 추출. 없으면 '전국'."""
    text = name + " " + org
    for r in REGIONS:
        if r in text:
            return r
    return "전국"


def fetch_services(ctpv_nm: str = "", life_codes: str = "", trgter_codes: str = "") -> list:
    """API 파라미터를 활용해 타겟 서비스 조회"""
    services = []
    pages = PAGES if not ctpv_nm else 5  # 지역 지정 시 페이지 줄여도 충분
    for page in range(1, pages + 1):
        try:
            params = {"serviceKey": API_KEY, "pageNo": page, "numOfRows": 50}
            if ctpv_nm:    params["ctpvNm"]           = ctpv_nm
            if life_codes: params["lifeArray"]         = life_codes
            if trgter_codes: params["trgterIndvdlArray"] = trgter_codes
            resp = requests.get(API_URL, params=params, timeout=10)
            root = ET.fromstring(resp.content)
            for item in root.findall(".//servList"):
                name    = (item.findtext("servNm")      or "").strip()
                summary = (item.findtext("servDgst")    or "").strip()
                trgter  = (item.findtext("trgter")      or "").strip()
                url     = (item.findtext("servDtlLink") or "").strip()
                ctpv    = (item.findtext("ctpvNm")      or "").strip()
                if not url:
                    url = "https://www.bokjiro.go.kr"
                if name:
                    region = "전국"
                    for r in REGIONS:
                        if r in ctpv:
                            region = r
                            break
                    if region == "전국":
                        region = get_service_region(name, ctpv)
                    services.append({
                        "name": name, "summary": summary,
                        "trgter": trgter, "url": url,
                        "region": region,
                    })
        except Exception as e:
            print(f"페이지 {page} 수집 오류: {e}")
    return services


def get_services(profile: dict = None, predicted_cats: list = None) -> list:
    """프로필/카테고리 기반으로 API 파라미터 구성 후 캐시 조회"""
    global _cache, _cache_time

    # API 파라미터 결정
    ctpv_nm     = ""
    life_codes  = ""
    trgter_codes = ""

    if profile:
        region = profile.get("region", "")
        ctpv_nm = REGION_TO_CTPV.get(region, "")

        age = profile.get("age")
        if age:
            if age <= 18:   life_codes = "003"
            elif age <= 34: life_codes = "004"
            elif age <= 64: life_codes = "005"
            else:           life_codes = "006"

    if predicted_cats:
        codes = [TRGTER_CODES[c] for c in predicted_cats if c in TRGTER_CODES]
        if codes:
            trgter_codes = ",".join(sorted(set(codes)))
        if not life_codes:
            for c in predicted_cats:
                if c in LIFE_CODES:
                    life_codes = LIFE_CODES[c]
                    break

    cache_key = f"{ctpv_nm}|{life_codes}|{trgter_codes}"
    now = time.time()
    if cache_key not in _cache or (now - _cache_time.get(cache_key, 0)) > CACHE_TTL:
        fetched = fetch_services(ctpv_nm, life_codes, trgter_codes)
        # 지역 지정 없는 일반 쿼리도 전국 캐시로 보완
        if cache_key != "||" and not fetched:
            fetched = get_services()  # fallback to general
        if fetched:
            _cache[cache_key]      = fetched
            _cache_time[cache_key] = now
            print(f"서비스 캐시 [{cache_key}]: {len(fetched)}개")
    return _cache.get(cache_key, [])


def detect_service_categories(name: str, summary: str) -> list:
    text = (name + " " + summary).lower()
    return [cat for cat, kws in CATEGORY_KEYWORDS.items() if any(kw in text for kw in kws)]


# 주요 복지 정책 금액 사전 (API 요약문에 금액이 없을 때 보완)
KNOWN_AMOUNTS = {
    "구직촉진수당":           "월 50만원",
    "국민취업지원제도":       "월 50만원",
    "청년내일저축계좌":       "3년 최대 1,440만원",
    "청년도약계좌":           "5년 최대 5,000만원",
    "청년월세":               "월 20만원",
    "주거급여":               "월 최대 32만원",
    "내일배움카드":           "최대 500만원",
    "국민내일배움카드":       "최대 500만원",
    "취업성공패키지":         "최대 250만원",
    "청년내일채움공제":       "2년 최대 1,200만원",
    "청년구직활동지원금":     "월 50만원",
    "청년마음건강":           "최대 64만원",
    "행복주택":               "시세 60~80%",
}


def extract_amount(summary: str, name: str = "") -> str:
    # 서비스 이름에서 알려진 금액 먼저 확인
    for key, amt in KNOWN_AMOUNTS.items():
        if key in name:
            return amt
    patterns = [
        r"최대\s*[\d,]+\s*만?원",
        r"월\s*[\d,]+\s*만?원",
        r"연간\s*[\d,]+\s*만?원",
        r"[\d,]+\s*만원",
    ]
    for pat in patterns:
        m = re.search(pat, summary)
        if m:
            return m.group().strip()
    return "확인 필요"


def parse_amount_to_annual(amt_str: str) -> int:
    """금액 문자열을 연간 만원 단위 정수로 변환. 파싱 불가 시 0 반환."""
    if not amt_str or amt_str in ("확인 필요", "정보 없음", ""):
        return 0
    cleaned = amt_str.replace(",", "")
    nums = re.findall(r'\d+', cleaned)
    if not nums:
        return 0
    amount = int(nums[0])
    # 3년 최대 1440만원 → 1440/3 = 480
    year_m = re.search(r'(\d+)년', cleaned)
    if year_m:
        years = int(year_m.group(1))
        if years > 0:
            return amount // years
    # 월 50만원 → 50 * 12 = 600
    if '월' in amt_str:
        return amount * 12
    return amount


def format_annual_amount(total_man: int) -> str:
    """만원 단위 정수를 사람이 읽기 쉬운 문자열로 포맷."""
    if total_man <= 0:
        return "복지로에서 확인 필요"
    if total_man >= 10000:
        eok = total_man // 10000
        rem = total_man % 10000
        return f"연간 최대 {eok}억 {rem:,}만원" if rem else f"연간 최대 {eok}억원"
    return f"연간 최대 {total_man:,}만원"


def find_earliest_deadline(services: list) -> str:
    """서비스 목록에서 오늘 이후 가장 빠른 마감일 반환. 없으면 '상시'."""
    import datetime
    today = datetime.date.today()
    dates = []
    for svc in services:
        dl = svc.get("deadline", "상시")
        if not dl or dl in ("상시", "정보 없음", "확인 필요"):
            continue
        m = re.match(r'(\d{4})-(\d{2})-(\d{2})', dl)
        if m:
            try:
                d = datetime.date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
                if d >= today:
                    dates.append(d)
            except ValueError:
                pass
    if not dates:
        return "상시"
    earliest = min(dates)
    return f"{earliest.month}월 {earliest.day}일까지"


def extract_deadline(summary: str) -> str:
    import datetime, calendar as cal_mod
    cur_year = datetime.date.today().year

    # YYYY.MM.DD / YYYY-MM-DD / YYYY/MM/DD → ISO
    m = re.search(r"(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})", summary)
    if m:
        return f"{m.group(1)}-{m.group(2).zfill(2)}-{m.group(3).zfill(2)}"

    # MM월 DD일까지 → 올해 ISO
    m = re.search(r"(\d{1,2})월\s*(\d{1,2})일까지", summary)
    if m:
        return f"{cur_year}-{m.group(1).zfill(2)}-{m.group(2).zfill(2)}"

    # MM월 말까지 → 해당 월 말일
    m = re.search(r"(\d{1,2})월\s*말까지", summary)
    if m:
        mon = int(m.group(1))
        last = cal_mod.monthrange(cur_year, mon)[1]
        return f"{cur_year}-{str(mon).zfill(2)}-{last}"

    return "상시"


def generate_reason(user_input: str, svc: dict, predicted_cats: list) -> str:
    svc_cats = detect_service_categories(svc["name"], svc["summary"])
    matched  = [c for c in predicted_cats if c in svc_cats]

    if matched:
        reason_parts = [CAT_REASON_TMPL[c] for c in matched[:2] if c in CAT_REASON_TMPL]
        base = "으로, ".join(reason_parts) + ("입니다" if reason_parts else "")
    else:
        base = "입력하신 상황과 연관된 복지 서비스입니다"

    amt = extract_amount(svc["summary"], svc.get("name", ""))
    if amt != "확인 필요":
        return f"{base}. {amt} 지원받을 수 있습니다."

    sentences = re.split(r"[.。]", svc["summary"])
    core = next((s.strip() for s in sentences if len(s.strip()) > 10), "")
    if core:
        return f"{base}. {core}"

    return base + "."


def build_parse_string(user_input: str, predicted_cats: list, count: int) -> str:
    situations = [CAT_SITUATION[c] for c in predicted_cats if c in CAT_SITUATION]

    if not situations:
        return f"입력하신 상황을 분석했습니다. 적합한 복지 서비스 {count}개를 추천해 드립니다."

    if len(situations) == 1:
        summary = f"{situations[0]} 상황"
    elif len(situations) == 2:
        summary = f"{situations[0]}이시고 {situations[1]} 상황"
    else:
        summary = f"{', '.join(situations[:-1])} 등의 상황"

    return (
        f"{summary}으로 파악됩니다. "
        f"해당 상황에 맞는 복지 서비스 {count}개를 추천해 드립니다."
    )


# ── API ─────────────────────────────────────────────────────────

class PredictRequest(BaseModel):
    input: str


@app.post("/predict")
def predict(req: PredictRequest):
    user_input = req.input.strip()

    # 1. 카테고리 예측
    X     = vectorizer.transform([user_input])
    proba = classifier.predict_proba(X)[0]
    predicted_cats = [mlb.classes_[i] for i, p in enumerate(proba) if p >= 0.20]
    if not predicted_cats:
        predicted_cats = [mlb.classes_[int(np.argmax(proba))]]

    # 2. 사용자 프로필 추출
    profile = extract_user_profile(user_input)

    # 3. 서비스 목록 로드 (프로필+카테고리 기반 타겟 조회)
    services = get_services(profile, predicted_cats)
    if not services:
        return _error_response("복지 API 서비스를 불러오지 못했습니다.")

    # 4. 카테고리 겹침 스코어링
    scored: list[tuple] = []
    for svc in services:
        cats    = detect_service_categories(svc["name"], svc["summary"])
        overlap = len(set(predicted_cats) & set(cats))
        if overlap > 0:
            scored.append((svc, overlap))

    scored.sort(key=lambda x: -x[1])
    candidates = [s for s, _ in scored[:80]] or services[:80]

    # 5a. 지역 필터링 — 사용자 지역이 있으면 다른 지역 서비스 제외
    user_region = profile.get("region")
    if user_region:
        region_matched = [s for s in candidates if s.get("region") in (user_region, "전국")]
        # 충분한 후보가 있을 때만 필터 적용 (너무 적으면 완화)
        if len(region_matched) >= 15:
            candidates = region_matched
            print(f"지역 필터({user_region}): {len(candidates)}개 남음")

    # 5b. 자격 기준 필터링 (프로필 정보가 있는 경우에만 적용)
    has_profile = any([
        profile["age"], profile["asset_eok"] is not None,
        profile["asset_level"] in ("high", "very_high"),
    ])
    if has_profile:
        filtered = []
        skipped  = 0
        for svc in candidates:
            elig = parse_eligibility(svc.get("trgter", ""), svc["summary"])
            eligible, reason = check_eligibility(profile, elig)
            if eligible:
                filtered.append(svc)
            else:
                skipped += 1
        candidates = filtered if len(filtered) >= 20 else candidates
        if skipped:
            print(f"자격 필터: {skipped}개 제외, {len(candidates)}개 남음")

    # 6. TF-IDF 유사도로 최종 랭킹
    doc_texts = [f"{s['name']} {s['summary']}" for s in candidates]
    rank_vec  = TfidfVectorizer(analyzer="char_wb", ngram_range=(2, 4), sublinear_tf=True)
    try:
        doc_matrix = rank_vec.fit_transform(doc_texts)
        query_vec  = rank_vec.transform([user_input])
        sims       = cosine_similarity(query_vec, doc_matrix).flatten()

        cat_scores = np.array([
            len(set(predicted_cats) & set(detect_service_categories(s["name"], s["summary"])))
            for s in candidates
        ], dtype=float)
        max_cat  = cat_scores.max() or 1.0
        combined = 0.7 * sims + 0.3 * (cat_scores / max_cat)

        top_idx  = combined.argsort()[::-1][:10]
        top_svcs = [candidates[i] for i in top_idx]
    except Exception:
        top_svcs = candidates[:10]

    # 7. 응답 구성
    result_services = []
    for svc in top_svcs:
        result_services.append({
            "name":     svc["name"],
            "amt":      extract_amount(svc["summary"], svc.get("name", "")),
            "period":   "확인 필요",
            "deadline": extract_deadline(svc["summary"]),
            "url":      svc["url"],
            "reason":   generate_reason(user_input, svc, predicted_cats),
        })

    total_annual = sum(parse_amount_to_annual(s["amt"]) for s in result_services)
    earliest_dl  = find_earliest_deadline(result_services)

    return {
        "parse":    build_parse_string(user_input, predicted_cats, len(result_services)),
        "count":    len(result_services),
        "amount":   format_annual_amount(total_annual),
        "deadline": earliest_dl,
        "services": result_services,
    }


class RoadmapRequest(BaseModel):
    job: str
    period: str
    input: str = ""


_EMPTY_PROFILE = {
    "age": None, "monthly_income": None, "asset_eok": None,
    "asset_level": None, "household": None, "unemployed": False, "region": None,
}


@app.post("/roadmap")
def roadmap(req: RoadmapRequest):
    user_cats = []
    profile   = dict(_EMPTY_PROFILE)  # 기본값으로 초기화 (KeyError 방지)
    welfare   = []

    if req.input.strip():
        X     = vectorizer.transform([req.input.strip()])
        proba = classifier.predict_proba(X)[0]
        user_cats = [mlb.classes_[i] for i, p in enumerate(proba) if p >= 0.20]
        if not user_cats:
            user_cats = [mlb.classes_[int(np.argmax(proba))]]
        profile = extract_user_profile(req.input.strip())

        # 복지 혜택 카드: 상위 3개 실 추천
        services = get_services(profile, user_cats)
        if services:
            scored = []
            for svc in services:
                cats    = detect_service_categories(svc["name"], svc["summary"])
                overlap = len(set(user_cats) & set(cats))
                if overlap > 0:
                    scored.append((svc, overlap))
            scored.sort(key=lambda x: -x[1])
            candidates = [s for s, _ in scored[:30]] or services[:30]

            # 지역 필터링
            user_region = profile.get("region")
            if user_region:
                region_ok = [s for s in candidates if s.get("region") in (user_region, "전국")]
                if len(region_ok) >= 5:
                    candidates = region_ok

            # 자격 필터링
            if profile.get("age") or profile.get("asset_eok") is not None:
                candidates = [
                    s for s in candidates
                    if check_eligibility(profile, parse_eligibility(s.get("trgter", ""), s["summary"]))[0]
                ] or candidates

            for svc in candidates[:3]:
                dl = extract_deadline(svc["summary"])
                welfare.append({
                    "name":     svc["name"],
                    "amt":      extract_amount(svc["summary"], svc.get("name", "")),
                    "deadline": dl,
                    "url":      svc["url"],
                })

    roadmap_data = build_roadmap(req.job, req.period, user_cats)
    roadmap_data["analysis"] = build_profile_analysis(req.input, profile, user_cats)
    roadmap_data["welfare"]  = welfare

    return roadmap_data


def _error_response(msg: str) -> dict:
    return {"parse": msg, "count": 0, "amount": "0원", "deadline": "-", "services": []}


@app.get("/health")
def health():
    return {"status": "ok", "cached_services": len(_cache)}


if __name__ == "__main__":
    print("서비스 목록 초기 로딩 중...")
    get_services()  # 전국 기본 캐시
    uvicorn.run(app, host="127.0.0.1", port=8000)

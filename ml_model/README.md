# 복지 서비스 추천 ML 모델

Gemini API 없이 직접 학습한 모델로 복지 서비스를 추천합니다.

## 구조

```
사용자 입력
    ↓
Spring Boot (DiagnosisService)
    ↓ POST /predict
LocalModelService → FastAPI (localhost:8000)
    ↓
[학습된 카테고리 분류 모델]  ← 직접 학습
    ↓
카테고리 예측 (청년 / 주거 / 취업 등 15개)
    ↓
실제 복지 API 호출 → 카테고리 필터링 → TF-IDF 유사도 랭킹
    ↓
DiagnosisResult JSON 반환
```

## 학습 방식

- **학습 데이터**: `categories.py`에 직접 작성한 합성 데이터 (~180개)
- **모델**: TF-IDF (character n-gram) + OneVsRest 로지스틱 회귀 (multi-label)
- **카테고리**: 청년, 출산임신, 노인, 장애인, 아동보육, 청소년, 신혼부부, 한부모, 주거, 취업일자리, 의료건강, 보훈, 저소득, 다자녀, 자립 (15개)

## 실행 방법 (순서대로)

### 1. Python 환경 설정 (최초 1회)

```bash
cd ml_model
pip install -r requirements.txt
```

### 2. 모델 학습 (최초 1회)

```bash
python train.py
```

`model.pkl` 파일이 생성됩니다.

### 3. 모델 서버 실행

```bash
python server.py
```

`http://localhost:8000` 에서 서버가 시작됩니다.  
Spring Boot 실행 **전에** 먼저 켜두어야 합니다.

### 4. Spring Boot 실행 (별도 터미널)

```bash
./mvnw spring-boot:run
```

## 파일 설명

| 파일 | 설명 |
|------|------|
| `categories.py` | 카테고리 키워드 정의 + 합성 학습 데이터 |
| `train.py` | 모델 학습 스크립트 → `model.pkl` 생성 |
| `server.py` | FastAPI 서버 (포트 8000) |
| `model.pkl` | 학습된 모델 (train.py 실행 후 생성) |
| `requirements.txt` | Python 패키지 목록 |

## API

### POST /predict

**요청**
```json
{ "input": "취업 준비 중인 청년인데 혼자 살아요" }
```

**응답** (DiagnosisResult 형식)
```json
{
  "parse": "입력하신 상황을 분석한 결과 [청년, 주거, 취업일자리] 관련 지원 대상으로 파악되었습니다.",
  "count": 5,
  "amount": "복지로에서 금액 확인 필요",
  "deadline": "상시",
  "services": [
    {
      "name": "청년월세 지원사업",
      "amt": "월 20만원",
      "period": "확인 필요",
      "deadline": "상시",
      "url": "https://www.bokjiro.go.kr",
      "reason": "청년 1인 가구의 주거비 부담을 완화합니다."
    }
  ]
}
```

### GET /health

서버 상태 및 캐시된 서비스 수 확인

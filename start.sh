#!/bin/bash
set -e

echo "=== Python ML 서버 시작 ==="
cd /app/ml_model

# model.pkl 없으면 학습
if [ ! -f model.pkl ]; then
  echo "model.pkl 없음 - 학습 시작..."
  python3 train.py
fi

python3 server.py &
ML_PID=$!
echo "ML 서버 PID: $ML_PID"

# ML 서버 준비 대기 (최대 30초)
for i in $(seq 1 30); do
  if python3 -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health')" 2>/dev/null; then
    echo "ML 서버 준비 완료"
    break
  fi
  echo "ML 서버 대기 중... ${i}s"
  sleep 1
done

echo "=== Spring Boot 시작 ==="
cd /app
exec java -jar app.jar --server.port=${PORT:-8080} --spring.profiles.active=railway

#!/bin/bash
set -e

echo "=== Python ML 서버 시작 (백그라운드) ==="
cd /app/ml_model

if [ ! -f model.pkl ]; then
  echo "model.pkl 없음 - 학습 시작..."
  python3 train.py
fi

python3 server.py &
echo "ML 서버 백그라운드 시작됨"

echo "=== Spring Boot 시작 ==="
cd /app
exec java -jar app.jar --server.port=${PORT:-8080} --spring.profiles.active=railway

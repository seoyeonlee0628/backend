#!/bin/bash
set -e

# Railway MySQL URL 파싱 (MYSQLHOST 등이 없을 경우 MYSQL_URL에서 추출)
if [ -n "$MYSQL_URL" ] && [ -z "$MYSQLHOST" ]; then
  echo "=== MYSQL_URL 파싱 중 ==="
  eval $(python3 -c "
from urllib.parse import urlparse
u = urlparse('$MYSQL_URL')
print(f'export MYSQLHOST={u.hostname}')
print(f'export MYSQLPORT={u.port or 3306}')
print(f'export MYSQLDATABASE={u.path.lstrip(\"/\")}')
print(f'export MYSQLUSER={u.username}')
print(f'export MYSQLPASSWORD={u.password}')
")
  echo "DB Host: $MYSQLHOST:$MYSQLPORT/$MYSQLDATABASE"
fi

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

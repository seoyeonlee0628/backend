FROM eclipse-temurin:17-jdk-jammy

# Python 설치
RUN apt-get update && apt-get install -y \
    python3.11 python3-pip python3.11-venv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Python 의존성 설치
COPY ml_model/requirements.txt ml_model/requirements.txt
RUN pip3 install --no-cache-dir -r ml_model/requirements.txt

# Python 소스 복사 (model.pkl 포함)
COPY ml_model/ ml_model/

# Maven wrapper 없으면 직접 다운로드
COPY pom.xml .
COPY src/ src/

# Spring Boot JAR 빌드 (테스트 스킵)
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/* \
    && mvn package -DskipTests -q \
    && mv target/welfare-check-*.jar app.jar

# 시작 스크립트
COPY start.sh start.sh
RUN chmod +x start.sh

EXPOSE 8080

CMD ["./start.sh"]

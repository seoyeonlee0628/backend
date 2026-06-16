"""
카테고리 분류 모델 학습 스크립트
실행: python train.py
결과: model.pkl 생성
"""
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.multiclass import OneVsRestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import MultiLabelBinarizer
from categories import TRAINING_DATA, CATEGORY_KEYWORDS


def train():
    texts  = [item[0] for item in TRAINING_DATA]
    labels = [item[1] for item in TRAINING_DATA]

    all_categories = list(CATEGORY_KEYWORDS.keys())

    # 한국어 character n-gram: 형태소 분석 없이도 효과적
    vectorizer = TfidfVectorizer(
        analyzer="char_wb",
        ngram_range=(2, 4),
        max_features=10000,
        sublinear_tf=True,
    )

    mlb = MultiLabelBinarizer(classes=all_categories)

    X = vectorizer.fit_transform(texts)
    y = mlb.fit_transform(labels)

    classifier = OneVsRestClassifier(
        LogisticRegression(max_iter=1000, C=1.5, solver="lbfgs")
    )
    classifier.fit(X, y)

    joblib.dump(
        {"vectorizer": vectorizer, "classifier": classifier, "mlb": mlb},
        "model.pkl",
    )

    print(f"학습 완료: {len(texts)}개 샘플, {len(all_categories)}개 카테고리")
    print(f"카테고리: {all_categories}")
    print("model.pkl 저장 완료")


if __name__ == "__main__":
    train()

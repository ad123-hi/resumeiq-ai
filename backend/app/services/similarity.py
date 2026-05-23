from sklearn.feature_extraction.text import TfidfVectorizer

from sklearn.metrics.pairwise import cosine_similarity

def calculate_similarity(resume, jd):

    documents = [resume, jd]

    vectorizer = TfidfVectorizer()

    matrix = vectorizer.fit_transform(documents)

    similarity_score = cosine_similarity(
        matrix[0:1],
        matrix[1:2]
    )

    return round(
        float(similarity_score[0][0]) * 100,
        2
    )
import sys
import json
import PyPDF2
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''
        for page in reader.pages:
            text += page.extract_text()
    return text

def calculate_similarity(text1, text2):
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([text1, text2])
    return cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]

def process_resume(resume_path, job_description):
    resume_text = extract_text_from_pdf(resume_path)
    similarity_score = calculate_similarity(resume_text, job_description)
    
    # This is a simplified version. In a real-world scenario, you'd want to do more
    # sophisticated parsing and matching.
    return {
        'similarity_score': similarity_score,
        'suggestions': [
            'Add more relevant keywords from the job description',
            'Highlight your most relevant experiences',
            'Tailor your skills section to match the job requirements'
        ]
    }

if __name__ == '__main__':
    resume_path = sys.argv[1]
    job_description = sys.argv[2]
    
    result = process_resume(resume_path, job_description)
    print(json.dumps(result))


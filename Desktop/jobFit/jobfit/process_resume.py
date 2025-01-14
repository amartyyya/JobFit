import sys
import PyPDF2

def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''
        for page in reader.pages:
            text += page.extract_text()
    return text

def main():
    resume_path = sys.argv[1]  # Path of the uploaded resume
    resume_text = extract_text_from_pdf(resume_path)
    print(resume_text)

if __name__ == '__main__':
    main()


"""Streamlit Cloud 진입점 — src/app.py를 실행합니다."""
import sys
import os

# src/ 디렉토리를 모듈 경로에 추가
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from app import main

if __name__ == "__main__":
    main()

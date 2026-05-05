http://localhost:8000/health
http://localhost:8000/docs

Docker로 실행
```
docker-compose up --build
```

로컬 직접 실행
```
uvicorn app.main:app --reload --port 8000
```

테스트 실행
```
pytest tests/ -v
```
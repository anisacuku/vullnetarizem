backend/
├── __init__.py
├── main.py              # FastAPI application entry point
├── database.py          # Data access layer using CSV files
├── models.py            # Pydantic models for API validation
├── requirements.txt     # Python dependencies
├── data/                # CSV data storage
│   ├── volunteers.csv
│   ├── organizations.csv
│   ├── opportunities.csv
│   └── matches.csv
├── ml/                  # Machine learning components
│   ├── __init__.py
│   ├── text_processor.py
│   └── matching_algorithm.py
├── routers/             # API route handlers
│   ├── __init__.py
│   ├── auth.py
│   ├── volunteers.py
│   ├── organizations.py
│   ├── opportunities.py
│   └── matches.py
└── services/            # Business logic services
    └── __init__.py
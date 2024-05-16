FROM python:3.10-bookworm

RUN pip install poetry==1.7.1

WORKDIR /backend

COPY pyproject.toml poetry.lock ./
COPY coding_assistant ./coding_assistant

RUN touch README.md
RUN poetry config virtualenvs.create false

RUN poetry install --no-dev --no-root

CMD ["poetry", "run", "uvicorn", "coding_assistant.main:app", "--host", "0.0.0.0", "--port", "8000"]
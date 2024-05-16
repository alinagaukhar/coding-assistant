# Coding Assistant BE

The backend part is written with FastAPI and uses PostgreSQL as database.

## Contents

- [Requirements](#requirements)
  - [python](#install-python)
  - [poetry](#install-poetry)
- [Install and Run](#install-and-run)
  - [Set env variables](#set-env-variables)
  - [Run locally (dev)](#run-locally-dev)
- [How to use](#how-to-use)
  - [1. Swagger docs](#1-swagger-docs)
  - [2. UAIssistant-FE](#2-uaissistant-fe)
- [DB Access](#db-access)

## Requirements

- Python (~3.10)
- Poetry
- Docker

### Install Python

For Linux users: `sudo apt install python3.10`

For MacOS users: `brew install python@3.10`

Otherwise, please, go to the official [Python website](https://www.python.org/downloads/), download and install Python `python3.10`.

### Install Poetry

Install poetry by following instructions from the official [poetry website](https://python-poetry.org/docs/).

If you would like to build your own project with poetry, you can follow the instructions from the offical [poetry website](https://python-poetry.org/docs/basic-usage/).

## Install and Run

### Set env variables

1. Create `.env` file and copy the content of `.env.local.example` to `.env`: `cp .env.local.example .env`. You can use your DB env variables.
2. Set your Azure OpenAI API Key and endpoint in the `.env` file:

   ```plaintext
   AZURE_OPENAI_API_KEY=your_api_key
   AZURE_OPENAI_ENDPOINT=your_endpoint
   AZURE_OPENAI_API_VERSION=your_api_version
   ```

### Run locally (dev)

1. Create postgres db in docker:

```
make initdb
```

2. Install poetry dependencies:

```
make install
```

3. Start the BE:

```
make run
```

- if you would like to restart the db

```
make startdb
```

- if you would like to stop the db

```
make stopdb
```

- if you would like to clean the db

```
make cleandb
```

## How to use

### 1. Swagger docs

Open [Swagger documentation](http://0.0.0.0:8000/docs#/) and perform the requests.

### 2. Coding assistant FE

Start [coding-assistant-FE](https://github.com/alinagaukhar/coding-assistant/tree/main/coding-assistant-FE) and play around with the APIs via intuitive UI.

## DB Access

Access the DB with DataGrip or DBveaver. Use the details from `.env` file.

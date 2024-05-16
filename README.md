# GPT-Based Coding Assistant

Coding Assistant is a tool powered by Azure OpenAI's ChatGPT designed to help users with coding challenges.

## Contents

- [How to Run](#how-to-run)
  - [Using Docker Compose](#using-docker-compose)
  - [Running Locally](#running-locally)
- [How to Use](#how-to-use)

## How to Run

### Using Docker Compose

#### Installations

You need to install Docker to run this project. Here are some options:

- [Docker](https://docs.docker.com/engine/install/)
- [Rancher Desktop](https://rancherdesktop.io/) (a good option for macOS)
- [Podman](https://podman.io/)

`docker-compose` is also required. Verify its installation with `docker-compose --version`. If not installed, follow these guides: [Linux](https://docs.docker.com/compose/install/linux/) and [macOS](https://www.ionos.com/digitalguide/server/configuration/docker-compose-on-mac/).

#### Running with Docker Compose

1. Create a `.env` file by copying the contents of `.env.docker.example`:

   ```bash
   cp .env.docker.example .env
   ```

   Customize your DB environment variables as needed.

2. Set your Azure OpenAI API Key and endpoint in the `.env` file:

   ```plaintext
   AZURE_OPENAI_API_KEY=your_api_key
   AZURE_OPENAI_ENDPOINT=your_endpoint
   AZURE_OPENAI_API_VERSION=your_api_version
   ```

3. Run Docker Compose:

   ```bash
   docker-compose up
   ```

   This initializes a PostgreSQL database, backend service, and frontend. The backend will be accessible at [http://0.0.0.0:8000/](http://0.0.0.0:8000/) and the frontend at [http://localhost:3000/](http://localhost:3000/).

4. To stop and remove the created containers, use:

   ```bash
   docker-compose down
   ```

### Running Locally

Follow the instructions in the `coding-assistant-BE` and `coding-assistant-FE` README files to run the backend and frontend servers respectively. If everything is set up correctly, you should have a similar result to using Docker Compose.

## How to Use

![Assistant UI](media/assistant.png)

You can ask the assistant about coding challenges using the web interface. You will receive answers with code snippets and comments. The assistant is designed to answer programming-related questions only.

Features:

- Multiple chat threads which are independent of each other.
- Ability to delete and rename chats.
- All data is persisted.

## Contributing

If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

## License

MIT License

## Contact

For any questions or feedback, please contact:

Gaukhar Alina - [gaukhar112200@gmail.com](mailto:gaukhar112200@gmail.com)

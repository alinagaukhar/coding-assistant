from coding_assistant.assistant import AssistantModule
from coding_assistant.connections import (
    ConfigModule,
    DbModule,
    AzureOpenAiModule,
)
from coding_assistant.llms import LlmModule
from injector import Injector
from fastapi import FastAPI
from fastapi_injector import (
    InjectorMiddleware,
    RequestScopeOptions,
    attach_injector,
)
from coding_assistant.routes import assistant
from fastapi.middleware.cors import CORSMiddleware

injector = Injector(
    [
        AssistantModule(),
        # connections
        ConfigModule(),
        DbModule(),
        AzureOpenAiModule(),
        LlmModule()
    ]
)
app = FastAPI(root_path="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(InjectorMiddleware, injector=injector)
app.include_router(assistant.router)
attach_injector(app, injector, options=RequestScopeOptions(enable_cleanup=True))

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)

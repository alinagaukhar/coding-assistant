from injector import Module, provider
from openai import AzureOpenAI
from .azureopenaillm import AzureOpenAILLM
from .llm import LLM

class LlmModule(Module):
    @provider
    def provide_llm(
        self,
        azure_openai_client: AzureOpenAI,
    ) -> LLM:
        return AzureOpenAILLM(client=azure_openai_client)
        

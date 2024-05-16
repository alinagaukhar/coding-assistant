from environs import Env
from injector import Module, provider
from openai import AzureOpenAI
from pydantic import  SecretStr
from pydantic.dataclasses import dataclass

@dataclass
class AzureOpenAiConfig:
    api_key: SecretStr
    azure_endpoint: SecretStr
    api_version: SecretStr


class AzureOpenAiModule(Module):
    @provider
    def provide_openai_config(self, env: Env) -> AzureOpenAiConfig:
        return AzureOpenAiConfig(
            api_key=env.str("AZURE_OPENAI_API_KEY"),
            azure_endpoint=env.str("AZURE_OPENAI_ENDPOINT"),
            api_version=env.str("AZURE_OPENAI_API_VERSION"),
        )

    @provider
    def provide_llm(self, conf: AzureOpenAiConfig) -> AzureOpenAI:
        azure_endpoint = conf.azure_endpoint.get_secret_value()
        api_key = conf.api_key.get_secret_value()
        api_version = conf.api_version.get_secret_value()
        return AzureOpenAI(azure_endpoint=azure_endpoint, api_key=api_key, api_version=api_version)

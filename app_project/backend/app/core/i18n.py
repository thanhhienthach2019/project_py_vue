import json
from functools import lru_cache
from pathlib import Path

SUPPORTED_LOCALES = ['en-US', 'vi-VN', 'zh-CN']
BASE_PATH = Path(__file__).parent.parent / 'locales'


@lru_cache()
def load_messages(locale: str) -> dict:
    path = BASE_PATH / f'{locale}.json'
    if not path.exists():
        path = BASE_PATH / 'en-US.json'
    return json.loads(path.read_text(encoding='utf-8'))


def resolve_locale(accept_language: str = '', query_lang: str = '') -> str:
    lang = (accept_language or '').split(',')[0].strip()
    if lang not in SUPPORTED_LOCALES:
        lang = query_lang.strip()
    return lang if lang in SUPPORTED_LOCALES else 'en-US'


def translate_by_locale(locale: str, key: str, **kwargs) -> str:
    messages = load_messages(locale)
    template = messages.get(key, key)
    try:
        return template.format(**kwargs)
    except KeyError:
        return template  


from fastapi import Request


async def get_locale_from_request(request: Request) -> str:
    accept_language = request.headers.get('Accept-Language', '')
    query_lang = request.query_params.get('lang', '')
    return resolve_locale(accept_language, query_lang)


async def translate(request: Request, key: str, **kwargs) -> str:
    locale = await get_locale_from_request(request)
    return translate_by_locale(locale, key, **kwargs)

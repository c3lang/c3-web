import os
import requests

def on_config(config):
    try:
        response = requests.get("https://api.github.com/repos/c3lang/c3c/releases/latest", timeout=2)
        if response.status_code == 200:
            config['extra']['latest_version'] = response.json()["tag_name"]
            print(f"Latest C3 version found: {config['extra']['latest_version']}")
            return config
    except Exception as e:
        print(f"Could not fetch latest version: {e}")
    
    config['extra']['latest_version'] = config['extra'].get('latest_version', '0.7.11')
    return config

def on_page_markdown(markdown, page, config, files):
    if 'latest_version' in config['extra']:
        return markdown.replace("{{ latest_version }}", config['extra']['latest_version'])
    return markdown

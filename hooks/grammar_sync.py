import re
import requests

GRAMMAR_Y_URL = "https://raw.githubusercontent.com/c3lang/c3c/master/resources/grammar/grammar.y"


def build_display_grammar(grammar_y_text: str) -> str:
    # Yacc files are divided into sections by '%%'
    parts = grammar_y_text.split("%%")
    if len(parts) < 2:
        return grammar_y_text

    # Section 0: Headers and Tokens. Strip the %{ ... %} prologue and internal bison settings.
    header = re.sub(r"%\{.*?%\}", "", parts[0], flags=re.DOTALL)
    header_lines = [
        line for line in header.splitlines()
        if line.strip() and not line.strip().startswith(("%locations", "%pure-parser", "%lex-param", "%parse-param"))
    ]

    # Section 1: The grammar rules
    rules = parts[1].strip()

    return "\n".join(header_lines) + "\n\n%%\n\n" + rules + "\n"

def on_page_markdown(markdown, page, config, files):
    if page.file.src_path != "implementation-details/grammar.md":
        return markdown

    try:
        response = requests.get(GRAMMAR_Y_URL, timeout=5)
        if response.status_code == 200:
            display_grammar = build_display_grammar(response.text)
            yacc_section = "\n\n## Yacc grammar\n\n```c\n" + display_grammar + "```\n"
            return markdown + yacc_section
    except Exception as e:
        print(f"WARNING: Failed to fetch grammar from GitHub: {e}")

    # Fallback if download fails
    fallback_section = (
        "\n\n## Yacc grammar\n\n"
        "You can view the grammar file directly on GitHub: "
        f"[grammar.y]({GRAMMAR_Y_URL})\n"
    )
    return markdown + fallback_section

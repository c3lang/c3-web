# C3 Documentation Site (MkDocs)
<img src="https://c3-lang.org/logo.svg" align="right" height="120" />

This documentation site for the C3 Programming Language is built using [MkDocs](https://www.mkdocs.org/) and the [Material theme](https://squidfunk.github.io/mkdocs-material/).

<h3 align="center"><a href="https://c3-lang.org">[Go to the website]</a></h3>

## Editing

Modify the files in the `docs/` folder.


## Search

Search is provided by the [Material for MkDocs search plugin](https://squidfunk.github.io/mkdocs-material/setup/setting-up-site-search/).

You can tune search relevance per page via frontmatter:

```yaml
---
# Rank this page higher in results (use low values, e.g. 1.5–2.0)
search:
  boost: 2

# Or remove a page from the index entirely
search:
  exclude: true
---
```

To exclude a specific section, add `{ data-search-exclude }` after the heading (requires `attr_list`, which is already enabled):

```markdown
## This section is indexed

## This section is not { data-search-exclude }
```


## Setup

### 1. Using `uv`
```bash
uv run mkdocs serve
```


### 2. Manual Setup (pip)
If you prefer using standard `pip`:

```bash
# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies from pyproject.toml
pip install .

# Run server
mkdocs serve
```


### 3. Build for Deployment
To generate the static HTML files:

```bash
uv run mkdocs build
# or
mkdocs build
```
The output will be in the `site/` folder.


* **Local access:** Open `site/index.html` with Firefox.
* **Server deployment:** Upload the contents of the `site/` folder to your webserver's root directory.

## Project Structure

- `docs/`: Markdown source files.
- `docs/assets/css/extra.css`: Landing page styles and MkDocs Material overrides.
- `theme/`: Material theme overrides (templates and partials).
- `hooks/`: MkDocs hook scripts (`c3_lexer.py`, `clean_html.py`).
- `mkdocs.yml`: Configuration file.
- `pyproject.toml`: Project configuration and dependencies.
- `site/`: Generated static files (created after build).

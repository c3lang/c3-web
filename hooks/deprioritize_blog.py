def on_page_markdown(markdown, page, config, files):
    # Check if the page is in the blog directory
    if page.url.startswith("blog/"):
        # We only set the boost if it's not already defined.
        # This allows individual posts to have their own boost or be excluded.
        if "search" not in page.meta:
            page.meta["search"] = {"boost": 0.1}
        elif isinstance(page.meta["search"], dict):
            if "boost" not in page.meta["search"]:
                page.meta["search"]["boost"] = 0.1

    return markdown

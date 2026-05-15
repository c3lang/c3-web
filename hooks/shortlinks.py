import os

def on_post_build(config, **kwargs):
    site_dir = config['site_dir']
    redirects = {
        'standard-library': {'target': 'standard-library/docs.html',  'title': 'C3 Standard Library Documentation'},
        'stdlib':           {'target': 'standard-library/docs.html',  'title': 'C3 Standard Library Documentation'},
        'reference':        {'target': 'standard-library/docs.html',  'title': 'C3 Standard Library Documentation'},
        'refcard':          {'target': 'standard-library/docs.html',  'title': 'C3 Standard Library Documentation'},
        'lib':              {'target': 'standard-library/docs.html',  'title': 'C3 Standard Library Documentation'},
        'docs':             {'target': 'language-overview/examples/', 'title': 'C3 Documentation Examples'},
        'compare':          {'target': 'faq/compare-languages/',      'title': 'C3 Comparison with other languages'}
    }

    template = """
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>{title}</title>
    <meta name="description" content="{description}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{url}">
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{description}">
    <meta property="og:image" content="{image}">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="{url}">
    <meta property="twitter:title" content="{title}">
    <meta property="twitter:description" content="{description}">
    <meta property="twitter:image" content="{image}">

    <link rel="canonical" href="{target}">
    <script>var anchor=window.location.hash.substr(1);location.href="{target}"+(anchor?"#"+anchor:"")</script>
    <meta http-equiv="refresh" content="0; url={target}">
</head>
<body>
You're being redirected to <a href="{target}">{title}</a>.
</body>
</html>
"""

    site_url = config.get('site_url', '').rstrip('/')
    site_description = config.get('site_description', '')
    site_name = config.get('site_name', 'C3 Programming Language')
    logo_path = config.get('theme', {}).get('logo', 'assets/logo.png')

    image_url = f"{site_url}/{logo_path}" if site_url else logo_path

    for source, data in redirects.items():
        target = data['target']
        title = data['title']

        path = os.path.join(site_dir, source)
        os.makedirs(path, exist_ok=True)
        rel_target = '../' + target
        abs_url = f"{site_url}/{source}" if site_url else f"/{source}"

        with open(os.path.join(path, 'index.html'), 'w') as f:
            f.write(template.format(
                title=title,
                target=rel_target,
                url=abs_url,
                description=site_description,
                image=image_url
            ).strip())

    print(f"Generated shortlink redirects for: {', '.join(redirects.keys())}")

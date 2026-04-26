from bs4 import BeautifulSoup

def on_post_page(output, **kwargs):
    # This parses the HTML and re-indents everything perfectly.
    # Not really needed but I like to see well indented html
    soup = BeautifulSoup(output, 'html.parser')
    return soup.prettify()

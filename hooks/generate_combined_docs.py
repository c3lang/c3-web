import yaml
import os
import re
import shutil

def parse_nav(nav, base_path='docs', prefix=''):
	files = []

	if isinstance(nav, list):
		for i, item in enumerate(nav):
			if isinstance(item, dict):
				for key, val in item.items():
					current_num = f"{prefix}{i+1}"
					if isinstance(val, list):
						files.extend(parse_nav(val, base_path, current_num + '_'))
					else:
						files.extend(parse_nav({key: val}, base_path, current_num))
			else:
				current_num = f"{prefix}{i+1}"
				files.extend(parse_nav(item, base_path, current_num))
	elif isinstance(nav, dict):
		for key, value in nav.items():
			current_num = prefix.rstrip('_')
			if isinstance(value, str):
				if not value.startswith('blog/') and value != 'index.md' and not value.endswith('.html'):
					files.append({'num': current_num, 'title': key, 'path': os.path.join(base_path, value)})
			else:
				files.extend(parse_nav(value, base_path, prefix))
	return files

def demote_headings(content, level):
	if level <= 0:
		return content
	for i in range(5, 0, -1):
		pattern = r'^' + ('#' * i) + r' '
		replacement = ('#' * (i + level)) + ' '
		content = re.sub(pattern, replacement, content, flags=re.MULTILINE)
	return content

def slugify(text):
	# MkDocs/toc style slugify: lower, remove non-alphanumeric, spaces to dashes
	text = text.lower()
	text = re.sub(r'[^a-z0-9_\- ]', '', text)
	text = text.replace(' ', '-')
	return text

def process_file_content(path, base_num):
	if not os.path.exists(path):
		return "", []

	with open(path, 'r', encoding='utf-8') as f:
		content = f.read()

	# Strip frontmatter
	if content.startswith('---'):
		parts = content.split('---', 2)
		if len(parts) >= 3:
			content = parts[2]

	lines = content.split('\n')
	new_lines = []
	subheadings = []
	sub_idx = 1
	in_code_block = False

	for line in lines:
		if line.strip().startswith('```'):
			in_code_block = not in_code_block
			new_lines.append(line)
			continue

		if not in_code_block and line.startswith('## '):
			title = line[3:].strip()
			num = f"{base_num}_{sub_idx}"
			# Clean header text: num Title
			full_header_text = f"{num} {title}"
			anchor = slugify(full_header_text)

			subheadings.append({'num': num, 'title': title, 'anchor': anchor})
			new_lines.append(f"## {num} {title}")
			sub_idx += 1
		else:
			new_lines.append(line)

	return '\n'.join(new_lines), subheadings

# Global to store content between phases
GENERATED_MARKDOWN = ""

def on_config(config):
	global GENERATED_MARKDOWN
	nav = config.get('nav', [])
	docs_nav = None
	for item in nav:
		if isinstance(item, dict) and 'Docs' in item:
			docs_nav = item['Docs']
			break

	if not docs_nav:
		return config

	files = parse_nav(docs_nav)
	toc_entries = []
	processed_files = []
	for f_info in files:
		content, subheadings = process_file_content(f_info['path'], f_info['num'])

		# Main file anchor
		f_full_text = f"{f_info['num']} {f_info['title']}"
		f_anchor = slugify(f_full_text)

		toc_entries.append({'num': f_info['num'], 'title': f_info['title'], 'anchor': f_anchor, 'level': 1})
		for sub in subheadings:
			toc_entries.append({'num': sub['num'], 'title': sub['title'], 'anchor': sub['anchor'], 'level': 2})

		processed_files.append({
			'num': f_info['num'],
			'title': f_info['title'],
			'content': content
		})

	# Build the full markdown string
	lines = ["# C3 Programming Language - Combined Documentation\n\n"]
	lines.append("## Table of Contents\n")
	for entry in toc_entries:
		indent = "  " if entry['level'] == 2 else ""
		lines.append(f"{indent}- {entry['num']} [{entry['title']}](#{entry['anchor']})\n")
	lines.append("\n---\n\n")

	for pf in processed_files:
		lines.append(f"# {pf['num']} {pf['title']}\n\n")
		content = demote_headings(pf['content'], 1)
		lines.append(content)
		lines.append("\n\n---\n\n")


	GENERATED_MARKDOWN = "".join(lines)

	return config

def on_post_build(config):
	# Write to site/all.md
	dest = os.path.join(config['site_dir'], 'all.md')
	with open(dest, 'w', encoding='utf-8') as f:
		f.write(GENERATED_MARKDOWN)
	print(f"Generated {dest}")

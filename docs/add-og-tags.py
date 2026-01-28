#!/usr/bin/env python3
"""Add OG meta tags to all HTML files after mkdocs build."""

import os
from pathlib import Path

OG_TAGS = '''
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://avb7.github.io/lintent/">
    <meta property="og:title" content="lintent - Lint + Intent">
    <meta property="og:description" content="Make slop illegal. A semantic lint runner for AI agents.">
    <meta property="og:image" content="https://avb7.github.io/lintent/assets/lintent-og.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="lintent - Lint + Intent">
    <meta name="twitter:description" content="Make slop illegal. A semantic lint runner for AI agents.">
    <meta name="twitter:image" content="https://avb7.github.io/lintent/assets/lintent-og.png">
'''

def add_og_tags():
    site_dir = Path(__file__).parent / "site"
    
    for html_file in site_dir.rglob("*.html"):
        content = html_file.read_text()
        
        # Skip if OG tags already present
        if 'og:image' in content:
            continue
            
        # Add OG tags before </head>
        if '</head>' in content:
            content = content.replace('</head>', f'{OG_TAGS}</head>')
            html_file.write_text(content)
            print(f"Added OG tags to {html_file}")

if __name__ == "__main__":
    add_og_tags()

"""Render only the deterministic graphic layer using the user's exact font files.

Receives the existing SVG layout on stdin, emits transparent PNG on stdout.
No photographs are read, patched, or retouched by this helper.
"""
from io import BytesIO
from pathlib import Path
import sys
import xml.etree.ElementTree as ET
from PIL import Image, ImageDraw, ImageFont

BASE = Path(__file__).resolve().parent.parent / 'source-assets' / 'fonts'
FONTS = {
    'Cenzo Flare Bold': BASE / 'CenzoFlare-Bold' / 'CenzoFlare-Bold.ttf',
    'Helvetica Now Text Regular': BASE / 'HelveticaNowText-Regular' / 'HelveticaNowText-Regular.ttf',
}

root = ET.fromstring(sys.stdin.buffer.read())
canvas = Image.new('RGBA', (2048, 2048), (0, 0, 0, 0))
draw = ImageDraw.Draw(canvas)
for element in root:
    tag = element.tag.split('}')[-1]
    a = element.attrib
    if tag == 'rect':
        x, y, w, h = (float(a[k]) for k in ['x', 'y', 'width', 'height'])
        draw.rectangle([x, y, x+w-1, y+h-1], fill=a['fill'])
    elif tag == 'text':
        font = ImageFont.truetype(str(FONTS[a['font-family']]), round(float(a['font-size'])))
        y = float(a['y'])
        spacing = float(a.get('letter-spacing', 0))
        for line in element:
            x = float(line.attrib['x'])
            y += float(line.attrib['dy'])
            content = line.text or ''
            if not spacing:
                draw.text((x, y), content, font=font, fill=a['fill'], anchor='ls')
            else:
                for i, character in enumerate(content):
                    # Prefix length retains the font's pair kerning while adding tracking.
                    offset = draw.textlength(content[:i], font=font) + i * spacing
                    draw.text((x+offset, y), character, font=font, fill=a['fill'], anchor='ls')

buffer = BytesIO()
canvas.save(buffer, format='PNG')
sys.stdout.buffer.write(buffer.getvalue())

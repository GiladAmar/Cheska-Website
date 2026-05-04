#!/usr/bin/env python3
# Compose a 1200x630 Open Graph card from the existing logo + portrait.
# Output: assets/img/og-card.jpg

from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "img"
OUT = IMG / "og-card.jpg"

W, H = 1200, 630

CREAM = (254, 253, 248)
INK = (42, 42, 42)
INK_SOFT = (74, 74, 74)
RUST = (166, 64, 25)
SAGE = (93, 111, 83)

card = Image.new("RGB", (W, H), CREAM)

# Sage left rail to anchor the composition.
rail = Image.new("RGB", (16, H), SAGE)
card.paste(rail, (0, 0))

# Portrait on the right (~480x480), keeping a generous margin.
portrait = Image.open(IMG / "fran-portrait-framed.png").convert("RGBA")
portrait = portrait.resize((480, 480), Image.LANCZOS)
card.paste(portrait, (W - 480 - 60, (H - 480) // 2), portrait)

# Logo on the left, scaled to ~360px square so the wordmark + script are legible.
logo = Image.open(IMG / "logo.png").convert("RGBA")
logo = logo.resize((360, 360), Image.LANCZOS)
card.paste(logo, (90, (H - 360) // 2 - 40), logo)

# Tagline + practice meta beneath the logo, in a serif italic.
serif_italic = ImageFont.truetype("/System/Library/Fonts/Supplemental/Baskerville.ttc", 28, index=2)  # italic
serif = ImageFont.truetype("/System/Library/Fonts/Supplemental/Baskerville.ttc", 20, index=0)         # roman

draw = ImageDraw.Draw(card)
tagline = "Counselling Psychologist · Camps Bay"
sub = "Psychotherapy for adults · in-person or online"

tx, ty = 90, (H - 360) // 2 + 360 - 30  # just under the logo block
draw.text((tx, ty), tagline, font=serif_italic, fill=RUST)
draw.text((tx, ty + 44), sub, font=serif, fill=INK_SOFT)

card.save(OUT, "JPEG", quality=88, optimize=True, progressive=True)
print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")

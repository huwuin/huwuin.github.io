"""Combine browser screenshots for visual review; no artwork generation."""
from pathlib import Path
from PIL import Image, ImageDraw

directory = Path(__file__).resolve().parent / "screenshots"
for resolution in ("1920x1080", "1280x720"):
    for start, end in ((1, 8), (9, 16)):
        sheet = Image.new("RGB", (1920, 588), "#e6e5de")
        draw = ImageDraw.Draw(sheet)
        for offset, slide in enumerate(range(start, end + 1)):
            source = directory / f"{resolution}-{slide:02}.png"
            image = Image.open(source).convert("RGB")
            image.thumbnail((480, 270))
            x, y = (offset % 4) * 480, (offset // 4) * 294
            draw.text((x + 8, y + 5), f"{resolution} / {slide:02}", fill="#15211f")
            sheet.paste(image, (x, y + 24))
        sheet.save(directory / f"contact-{resolution}-{start:02}-{end:02}.png")

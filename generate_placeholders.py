"""
Генератор плейсхолдеров для Oksana Moroz Studio.
Создаёт PNG-файлы с подписями для каждого места на сайте.
Использует только Pillow — pip install Pillow
"""

from PIL import Image, ImageDraw, ImageFont
import os

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "assets", "images")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ── Цвета в стиле сайта ──────────────────────
BG_COLOR      = (34, 34, 38)       # тёмный фон (#222226)
BORDER_COLOR  = (183, 155, 105)    # золото (#B79B69)
TEXT_COLOR     = (255, 255, 255)    # белый текст
SUB_COLOR      = (183, 155, 105)   # золотой подтекст
DIMS_COLOR     = (120, 120, 130)   # серый для размеров

# ── Список плейсхолдеров ─────────────────────
# (filename, width, height, main_label, sub_label)
placeholders = [
    # Фоны (широкие)
    ("hero-bg.jpg",              1920, 1080, "HERO — Фон",              "Главный экран сайта\n1920 × 1080"),
    ("cta-bg.jpg",               1920, 1080, "CTA — Фон",              "Секция «Записаться»\n1920 × 1080"),

    # About (портрет)
    ("about-studio.jpg",          800, 1000, "О СТУДИИ",               "Фото студии / работы колориста\n800 × 1000"),

    # Mastery — техники (портрет для панели)
    ("technique-balayage.jpg",    800, 1000, "БАЛАЯЖ",                 "Фото результата балаяжа\n800 × 1000"),
    ("technique-airtouch.jpg",    800, 1000, "AIRTOUCH",               "Фото результата airtouch\n800 × 1000"),
    ("technique-total-blonde.jpg",800, 1000, "TOTAL BLONDE",           "Фото результата total blonde\n800 × 1000"),
    ("technique-intelligent-blonde.jpg", 800, 1000, "ИНТЕЛЛ. БЛОНД",  "Фото интеллигентного блонда\n800 × 1000"),
    ("technique-brazilian-blonde.jpg",   800, 1000, "БРАЗ. БЛОНД",    "Фото бразильского блонда\n800 × 1000"),
    ("technique-grey-coverage.jpg",      800, 1000, "ШИТЬЁ СЕДИНЫ",   "Фото шитья седины\n800 × 1000"),
    ("technique-highlights.jpg",         800, 1000, "МЕЛИРОВАНИЕ",    "Фото мелирования\n800 × 1000"),

    # Care — уход (ландшафт для карточек)
    ("care-k18.jpg",              800,  600, "K18",                    "Фото продукта / процедуры K18\n800 × 600"),
    ("care-tokio-inkarami.jpg",   800,  600, "TOKIO INKARAMI",        "Фото продукта Tokio Inkarami\n800 × 600"),
    ("care-jbeverly-hills.jpg",   800,  600, "J BEVERLY HILLS",      "Фото продукта J Beverly Hills\n800 × 600"),
]


def get_font(size: int):
    """Попробовать системные шрифты, иначе — дефолтный."""
    candidates = [
        "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/calibri.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def draw_placeholder(filename, w, h, main_label, sub_label):
    img = Image.new("RGB", (w, h), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Рамка-бордер
    border = 4
    draw.rectangle(
        [border, border, w - border - 1, h - border - 1],
        outline=BORDER_COLOR,
        width=2,
    )

    # Крестик по диагонали (направляющие)
    draw.line([(border, border), (w - border, h - border)], fill=(60, 60, 65), width=1)
    draw.line([(w - border, border), (border, h - border)], fill=(60, 60, 65), width=1)

    # Центральный текст
    font_main = get_font(max(28, min(w, h) // 12))
    font_sub  = get_font(max(18, min(w, h) // 22))
    font_dims = get_font(max(14, min(w, h) // 30))

    # Главная надпись
    bbox = draw.textbbox((0, 0), main_label, font=font_main)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((w - tw) / 2, h / 2 - th - 30), main_label, fill=TEXT_COLOR, font=font_main)

    # Подпись
    for i, line in enumerate(sub_label.split("\n")):
        bbox = draw.textbbox((0, 0), line, font=font_sub)
        lw = bbox[2] - bbox[0]
        draw.text(((w - lw) / 2, h / 2 + 10 + i * 30), line, fill=SUB_COLOR, font=font_sub)

    # Имя файла снизу
    fname_text = f"[ {filename} ]"
    bbox = draw.textbbox((0, 0), fname_text, font=font_dims)
    fw = bbox[2] - bbox[0]
    draw.text(((w - fw) / 2, h - 40), fname_text, fill=DIMS_COLOR, font=font_dims)

    out_path = os.path.join(OUTPUT_DIR, filename)
    img.save(out_path, quality=85)
    print(f"  ✓ {filename:45s}  {w}×{h}")


if __name__ == "__main__":
    print(f"Генерация плейсхолдеров в {OUTPUT_DIR}\n")
    for fname, w, h, label, sub in placeholders:
        draw_placeholder(fname, w, h, label, sub)
    print(f"\nГотово! Создано {len(placeholders)} файлов.")

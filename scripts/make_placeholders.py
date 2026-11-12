"""Generates clearly-labelled placeholder photos, favicon and OG image.
Replace public/images/foto-*.jpg with the couple's real photos."""
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

IVORY = (248, 243, 234)
GOLD = (182, 154, 100)
PLUM = (114, 86, 111)
corner = Image.open("public/images/flower-corner.png")
deco = Image.open("public/images/floral-decoration.png")


def paper(w, h, tint=IVORY):
    rng = np.random.default_rng(7)
    base = np.ones((h, w, 3), np.float32) * np.array(tint, np.float32)
    n = rng.normal(0, 2.2, (h, w, 1)).astype(np.float32)
    base += n
    return Image.fromarray(np.clip(base, 0, 255).astype(np.uint8)).convert("RGBA")


def font(path, size, wght=None):
    f = ImageFont.truetype(path, size)
    if wght:
        try:
            f.set_variation_by_axes([wght])
        except Exception:
            pass
    return f


CG = "scripts/fonts/cg.ttf"
GV = "scripts/fonts/gv.ttf"


def centered(d, w, y, text, f, fill):
    b = d.textbbox((0, 0), text, font=f)
    d.text(((w - (b[2] - b[0])) / 2, y), text, font=f, fill=fill)


def placeholder(name, w, h, label, flip=False):
    im = paper(w, h, (237, 228, 241))
    c = corner.copy()
    c.thumbnail((int(w * 0.8), int(h * 0.6)))
    if flip:
        c = c.transpose(Image.ROTATE_180)
        im.alpha_composite(c, (w - c.width, h - c.height))
    else:
        im.alpha_composite(c, (0, 0))
    d = ImageDraw.Draw(im)
    d.rectangle([w * 0.04, h * 0.03, w * 0.96, h * 0.97], outline=GOLD, width=3)
    s = int(w * 0.06)
    centered(d, w, h * 0.5 - s * 1.6, "Ganti dengan foto", font(CG, s, 500), PLUM)
    centered(d, w, h * 0.5 - s * 0.2, label, font(CG, int(s * 1.1), 700), GOLD)
    centered(d, w, h * 0.5 + s * 1.2, "public/images/" + label, font(CG, int(s * 0.7), 500), (138, 118, 101))
    im.convert("RGB").save(f"public/images/{name}", quality=84, optimize=True)


placeholder("foto-utama.jpg", 1000, 1250, "foto-utama.jpg")
placeholder("foto-galeri-1.jpg", 1000, 1250, "foto-galeri-1.jpg", flip=True)
placeholder("foto-galeri-2.jpg", 1200, 900, "foto-galeri-2.jpg")
placeholder("foto-galeri-3.jpg", 1000, 1250, "foto-galeri-3.jpg", flip=True)

# favicon
S = 256
fav = Image.new("RGBA", (S, S), (0, 0, 0, 0))
d = ImageDraw.Draw(fav)
d.ellipse([4, 4, S - 4, S - 4], fill=IVORY + (255,), outline=GOLD + (255,), width=6)
c = corner.copy(); c.thumbnail((200, 200))
mask = Image.new("L", (S, S), 0)
ImageDraw.Draw(mask).ellipse([10, 10, S - 10, S - 10], fill=255)
layer = Image.new("RGBA", (S, S), (0, 0, 0, 0))
layer.alpha_composite(c, (24, 20))
layer.putalpha(Image.fromarray(np.minimum(np.asarray(layer)[..., 3], np.asarray(mask))))
fav.alpha_composite(layer)
fav.save("public/favicon.png", optimize=True)

# OG image 1200x630
W, H = 1200, 630
og = paper(W, H)
c = corner.copy(); c.thumbnail((560, 560)); og.alpha_composite(c, (0, 0))
c2 = corner.transpose(Image.ROTATE_180).copy(); c2.thumbnail((560, 560)); og.alpha_composite(c2, (W - c2.width, H - c2.height))
d = ImageDraw.Draw(og)
d.rectangle([24, 24, W - 24, H - 24], outline=GOLD, width=2)
centered(d, W, 150, "THE WEDDING OF", font(CG, 34, 600), (138, 118, 101))
centered(d, W, 215, "Rizal & Silvi", font(GV, 120), PLUM)
centered(d, W, 390, "Rabu, 6 Januari 2027", font(CG, 46, 600), GOLD)
og.convert("RGB").save("public/images/og-image.jpg", quality=86, optimize=True)
print("done")

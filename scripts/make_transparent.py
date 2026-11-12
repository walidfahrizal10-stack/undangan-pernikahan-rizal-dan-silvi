"""
Background removal -> true RGBA PNG (alpha channel).
Illustrations were painted on a plain white background. The background is detected
by flood-fill from the image border (so white petals INSIDE flowers stay opaque),
edges are feathered and de-contaminated (no white halo).

Usage: python3 scripts/make_transparent.py
Requires: pillow numpy scipy
"""
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

SRC = "source-art"
OUT = "public/images"

JOBS = {
    # name: (max_size, threshold)
    "peacock": (820, 244),
    "flower-corner": (900, 244),
    "floral-decoration": (900, 244),
    "gunungan": (640, 244),
    "watercolor-joglo": (820, 240),
}


def remove_bg(img: Image.Image, thr: int) -> Image.Image:
    a = np.asarray(img.convert("RGB")).astype(np.float32)
    m = a.min(axis=2)
    cand = m >= thr
    lab, n = ndi.label(cand)
    border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    border = border[border != 0]
    bg = np.isin(lab, border)
    # enclosed pure-white gaps (between petals / feathers) -> also transparent
    sat = a.max(axis=2) - a.min(axis=2)
    pure = (m >= 251) & (sat < 7)
    lab2, n2 = ndi.label(pure)
    if n2:
        areas = ndi.sum(pure, lab2, index=np.arange(1, n2 + 1))
        big = np.where(areas >= 90)[0] + 1
        bg = bg | np.isin(lab2, big)
        bg = ndi.binary_dilation(bg, iterations=1) & (m >= thr - 6) | bg
    # distance from background -> feather band
    dist = ndi.distance_transform_edt(~bg)
    soft = np.clip((252.0 - m) / (252.0 - 205.0), 0, 1)
    alpha = np.where(bg, 0.0, 1.0)
    band = (~bg) & (dist <= 5)
    alpha = np.where(band, np.maximum(soft, 0.0), alpha)
    alpha = np.where(band & (dist <= 1.5), alpha * 0.85, alpha)
    alpha = ndi.gaussian_filter(alpha, 0.6)
    alpha = np.where(bg & (dist == 0), alpha, alpha)
    alpha = np.clip(alpha, 0, 1)
    # de-contaminate edge colours (remove white that bled in)
    safe = np.maximum(alpha, 0.05)[..., None]
    rgb = (a - 255.0 * (1 - safe)) / safe
    edge = (alpha < 0.98)[..., None]
    rgb = np.where(edge, rgb, a)
    rgb = np.clip(rgb, 0, 255)
    out = np.dstack([rgb, alpha * 255.0]).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def trim(img: Image.Image, pad: int = 6) -> Image.Image:
    alpha = np.asarray(img)[..., 3]
    ys, xs = np.where(alpha > 8)
    box = (max(xs.min() - pad, 0), max(ys.min() - pad, 0),
           min(xs.max() + pad, img.width), min(ys.max() + pad, img.height))
    return img.crop(box)


def batik(img: Image.Image) -> Image.Image:
    """Line-art: darkness -> alpha, ink colour = antique soft brown/gold."""
    g = np.asarray(img.convert("L")).astype(np.float32)
    bgval = np.percentile(g, 92)
    alpha = np.clip((bgval - g) / max(bgval - np.percentile(g, 2), 1), 0, 1)
    alpha = np.clip(alpha * 1.3, 0, 1)
    h, w = g.shape
    rgb = np.zeros((h, w, 3), np.float32)
    rgb[..., 0], rgb[..., 1], rgb[..., 2] = 138, 118, 101  # #8A7665
    out = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


if __name__ == "__main__":
    for name, (mx, thr) in JOBS.items():
        im = Image.open(f"{SRC}/{name}.png")
        out = trim(remove_bg(im, thr))
        out.thumbnail((mx, mx), Image.LANCZOS)
        out.save(f"{OUT}/{name}.png", optimize=True)
        print(name, out.size, out.mode)
    im = Image.open(f"{SRC}/batik-pattern.png")
    out = batik(im)
    out = out.resize((520, 520), Image.LANCZOS)
    arr = np.asarray(out).copy()
    arr[..., 3] = (arr[..., 3] // 8) * 8  # fewer alpha levels -> smaller file
    out = Image.fromarray(arr, "RGBA")
    out.save(f"{OUT}/batik-pattern.png", optimize=True)
    print("batik-pattern", out.size, out.mode)

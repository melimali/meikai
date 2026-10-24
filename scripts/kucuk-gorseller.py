"""Galeri ve ürün görsellerinin küçük kopyalarını üretir (hızlı yükleme için).

Kullanım:  python3 scripts/kucuk-gorseller.py
images/ altındaki her ürün/studio/proje .webp dosyası için:
  images/s/AD.webp  -> 840px genişlik (kartlar ve galeri)
  images/t/AD.webp  -> 240px genişlik (ürün küçük resimleri, sepet)
Yeni fotoğraf ekledikten sonra bir kez çalıştırman yeterli; olanları atlar.
Küçük kopya yoksa sayfa otomatik olarak büyük görsele düşer.
"""
import glob, os
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'images')
SIZES = {'s': 840, 't': 240}
SKIP = ('koleksiyon-',)  # logolar zaten küçük

for src in sorted(glob.glob(os.path.join(ROOT, '*.webp'))):
    name = os.path.basename(src)
    if name.startswith(SKIP):
        continue
    for folder, width in SIZES.items():
        if folder == 't' and (name.startswith('studio-') or name.startswith('project-')):
            continue
        out = os.path.join(ROOT, folder, name)
        if os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(src):
            continue
        os.makedirs(os.path.dirname(out), exist_ok=True)
        im = Image.open(src)
        if im.width > width:
            im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
        im.save(out, 'WEBP', quality=80, method=6)
        print(out)

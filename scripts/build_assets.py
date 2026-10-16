"""Resolve source photos during deployment so the published app has no remote image dependencies."""
import concurrent.futures
import io
import pathlib
import urllib.request
from PIL import Image, ImageOps

photos = {
    'kungpao.jpg': 'https://cdn3.didevelop.com/public/product_images/5815/533_e8c2d091e79463193e4d50938d2c1f62.jpg',
    'tomato.jpg': 'https://cook.zhouhao.cn/images/%E8%A5%BF%E7%BA%A2%E6%9F%BF%E7%82%92%E9%B8%A1%E8%9B%8B%E7%9B%96%E9%A5%AD.jpeg',
    'salad.jpg': 'https://www.gfo-sc.jp/files/20210818/31bcc47851a9fef839ca01d3e55051d5a81c924b.jpg',
    'noodles.jpg': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    'pepper.jpg': 'https://tb-static.uber.com/prod/image-proc/processed_images/e4e8733db1abcfc557a60575be4e6fd3/f47cec1eac1d3b43eccf2318d065819a.jpeg',
    'minibowls.jpg': 'https://tb-static.uber.com/prod/image-proc/processed_images/148b36fc57cd08bdddab621d36f6a7e7/70aa2a4db7f990373ca9c376323e3dea.jpeg',
    'braised.jpg': 'https://yehheardithere.com/wp-content/uploads/2021/11/b633ae76-f2b4-47d2-bb3b-b7acbd863eb8.jpg?w=1024',
}

def fetch_photo(item):
    name, url = item
    request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(request, timeout=45) as response:
        image = Image.open(io.BytesIO(response.read()))
        image = ImageOps.exif_transpose(image).convert('RGB')
        image.thumbnail((850, 850))
        image.save(pathlib.Path('dist/assets') / name, 'JPEG', quality=82, optimize=True)
    print(f'Validated and packaged: {name}', flush=True)

with concurrent.futures.ThreadPoolExecutor(max_workers=7) as executor:
    list(executor.map(fetch_photo, photos.items()))

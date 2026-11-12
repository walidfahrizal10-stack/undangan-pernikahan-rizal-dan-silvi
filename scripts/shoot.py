import sys, time
from playwright.sync_api import sync_playwright
W,H,tag,q = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3], (sys.argv[4] if len(sys.argv)>4 else '')
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width':W,'height':H}, device_scale_factor=1)
    errs=[]
    pg.on('console', lambda m: errs.append(m.text) if m.type in ('error','warning') else None)
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('http://localhost:4173/'+q, wait_until='networkidle')
    time.sleep(4.5)
    pg.screenshot(path=f'raw/shots/{tag}-open.jpg', quality=70, type='jpeg')
    pg.click('text=BUKA UNDANGAN')
    time.sleep(2.5)
    total = pg.evaluate('document.documentElement.scrollHeight')
    sw = pg.evaluate('document.documentElement.scrollWidth')
    print('height',total,'scrollWidth',sw,'vw',W)
    y=0;i=0
    while y<total:
        pg.evaluate(f'window.scrollTo(0,{y})'); time.sleep(1.6)
        pg.screenshot(path=f'raw/shots/{tag}-{i:02d}.jpg', quality=65, type='jpeg')
        y+=H; i+=1
    print('errors',errs[:8])
    b.close()

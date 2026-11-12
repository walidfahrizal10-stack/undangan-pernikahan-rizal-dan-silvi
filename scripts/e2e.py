from playwright.sync_api import sync_playwright
import time
with sync_playwright() as p:
    b=p.chromium.launch(); ctx=b.new_context(viewport={'width':390,'height':844}, permissions=['clipboard-read','clipboard-write'])
    pg=ctx.new_page(); errs=[]
    pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
    pg.on('pageerror', lambda e: errs.append('PAGEERR '+str(e)))
    posts=[]
    pg.on('request', lambda r: posts.append((r.method,r.url,r.post_data)) if r.method=='POST' else None)
    pg.goto('http://localhost:4173/?to=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E%20Budi', wait_until='networkidle'); time.sleep(3.5)
    print('guest:', pg.inner_text('.op-guest-name'), '| imgs in guest:', pg.locator('.op-guest-name img').count())
    pg.click('text=BUKA UNDANGAN'); time.sleep(2.5)
    print('opening gone:', pg.locator('.opening').count()==0, 'scrollY', pg.evaluate('scrollY'))
    # gift copy
    pg.locator('.bank-copy').first.scroll_into_view_if_needed(); pg.locator('.bank-copy').first.click(); time.sleep(.6)
    print('toast:', pg.inner_text('.toast'), '| clipboard:', pg.evaluate('navigator.clipboard.readText()'))
    # lightbox
    pg.locator('.gallery-btn').nth(0).scroll_into_view_if_needed(); pg.locator('.gallery-btn').nth(0).click(); time.sleep(.7)
    print('lb caption:', pg.inner_text('.lb-figure figcaption'))
    pg.keyboard.press('ArrowRight'); time.sleep(.8); print('after next:', pg.inner_text('.lb-figure figcaption'))
    pg.screenshot(path='raw/shots/lb.jpg', quality=60, type='jpeg')
    pg.keyboard.press('Escape'); time.sleep(.6); print('lb closed:', pg.locator('.lightbox').count()==0)
    # RSVP validation
    pg.locator('#rsvp .form-submit').scroll_into_view_if_needed(); pg.fill('#rsvp-nama',''); pg.click('#rsvp .form-submit'); time.sleep(.3)
    print('errors:', pg.locator('#rsvp .field-error').all_inner_texts())
    pg.fill('#rsvp-nama','Budi'); pg.check('#rsvp input[value="Hadir"]', force=True); pg.fill('#rsvp-ucapan','Selamat!'); pg.click('#rsvp .form-submit'); time.sleep(1.2)
    print('posts:', [(m,u,d) for m,u,d in posts]); print('msg:', pg.locator('#rsvp .form-msg').all_inner_texts())
    # music button no crash
    pg.click('.music-player'); time.sleep(.5); print('music label:', pg.get_attribute('.music-player','aria-label'))
    print('console errors:', errs)
    b.close()

# -*- coding: utf-8 -*-
"""Génère les pages RU / ZH d'EPS à partir du gabarit EN (en-tête, pied de page, scripts) et des contenus de content.py,
puis relie toutes les versions (hreflang + sélecteur de langue)."""
import re, os, sys, html, json, glob
from urllib.parse import quote
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from content import P, GROUPS
ROOT = '/home/claude/eps-preview'
ORIGIN = 'https://www.elite-prestige-services.fr'
HL = {'ru': 'ru', 'zh': 'zh-Hans'}
LOCALE = {'ru': 'ru_RU', 'zh': 'zh_CN'}
LABEL = {'ru': 'RU', 'zh': '中文'}
WA = {'ru': 'Здравствуйте! Хотел(а) бы получить предложение на трансфер с шофёром: ',
      'zh': '您好，我想预订专车接送服务：'}
T = {
 'ru': {'Elite Prestige Services': 'Elite Prestige Services', 'Private chauffeur · French Riviera': 'Частный шофёр · Лазурный Берег',
  'Services': 'Услуги', 'Vehicles': 'Автомобили', 'Business': 'Бизнес', 'Events': 'События', 'Book': 'Заказать',
  'Admin access': 'Вход для администратора', 'Driver access': 'Вход для водителя',
  'Private chauffeur service based in Cannes. Airport, hotel, port and event transfers across the French Riviera.': 'Частный шофёр из Канн. Трансферы из аэропорта, отелей, портов и на мероприятия по всему Лазурному Берегу.',
  'Official partner:': 'Официальный партнёр:', ', France travel guide': ', путеводитель по Франции',
  'Destinations': 'Направления', 'Cannes': 'Канны', 'Nice': 'Ницца', 'Monaco': 'Монако', 'Saint-Tropez': 'Сен-Тропе',
  'All destinations': 'Все направления', 'French Riviera travel guide': 'Путеводитель по Лазурному Берегу', 'Transfers': 'Трансферы',
  'Nice Airport → Cannes': 'Аэропорт Ниццы → Канны', 'Nice → Monaco': 'Ницца → Монако', 'Nice Airport → Saint-Tropez': 'Аэропорт Ниццы → Сен-Тропе',
  'Cannes-Mandelieu Airport': 'Аэропорт Канны-Манделье', 'Contact': 'Контакты', 'Admin area': 'Администратор', 'Driver area': 'Водители',
  '© Elite Prestige Services · Website by': '© Elite Prestige Services · Сайт:', 'About us': 'О нас', 'Legal notice': 'Правовая информация',
  'Terms of sale': 'Условия продажи', 'Terms of use': 'Условия использования', 'Privacy': 'Конфиденциальность', 'Book →': 'Заказать →',
  'Planning a journey?': 'Планируете поездку?', 'Send your request in two minutes: you receive a fixed-price quote before confirming.': 'Отправьте запрос за две минуты: вы получите предложение с фиксированной ценой до подтверждения.',
  'Book a chauffeur': 'Заказать шофёра', 'Message us on WhatsApp': 'Написать в WhatsApp', 'Write on WhatsApp': 'Написать в WhatsApp',
  'Open menu': 'Открыть меню', 'Home': 'Главная', 'Frequently asked questions': 'Частые вопросы',
 },
 'zh': {'Elite Prestige Services': 'Elite Prestige Services', 'Private chauffeur · French Riviera': '专车司机 · 蔚蓝海岸',
  'Services': '服务', 'Vehicles': '车型', 'Business': '商务', 'Events': '活动', 'Book': '预订',
  'Admin access': '管理员登录', 'Driver access': '司机登录',
  'Private chauffeur service based in Cannes. Airport, hotel, port and event transfers across the French Riviera.': '总部位于戛纳的专车司机服务。提供蔚蓝海岸全境的机场、酒店、港口及活动接送。',
  'Official partner:': '官方合作伙伴：', ', France travel guide': '，法国旅行指南',
  'Destinations': '目的地', 'Cannes': '戛纳', 'Nice': '尼斯', 'Monaco': '摩纳哥', 'Saint-Tropez': '圣特罗佩',
  'All destinations': '全部目的地', 'French Riviera travel guide': '蔚蓝海岸旅行指南', 'Transfers': '接送',
  'Nice Airport → Cannes': '尼斯机场 → 戛纳', 'Nice → Monaco': '尼斯 → 摩纳哥', 'Nice Airport → Saint-Tropez': '尼斯机场 → 圣特罗佩',
  'Cannes-Mandelieu Airport': '戛纳—芒德略机场', 'Contact': '联系我们', 'Admin area': '管理员', 'Driver area': '司机',
  '© Elite Prestige Services · Website by': '© Elite Prestige Services · 网站制作：', 'About us': '关于我们', 'Legal notice': '法律声明',
  'Terms of sale': '销售条款', 'Terms of use': '使用条款', 'Privacy': '隐私政策', 'Book →': '预订 →',
  'Planning a journey?': '计划出行？', 'Send your request in two minutes: you receive a fixed-price quote before confirming.': '两分钟提交需求：确认前您会收到固定价格的报价。',
  'Book a chauffeur': '预订专车', 'Message us on WhatsApp': 'WhatsApp 留言', 'Write on WhatsApp': 'WhatsApp 留言',
  'Open menu': '打开菜单', 'Home': '首页', 'Frequently asked questions': '常见问题',
 },
}
esc = lambda s: html.escape(s, quote=True)

def page_url(lang, key):
    return P[lang][key]['slug']

def all_group(key):
    g = dict(GROUPS[key])
    for lang in ('ru', 'zh'):
        g[HL[lang]] = page_url(lang, key)
    return g

def hreflang_links(g):
    order = ['fr', 'en', 'it', 'es', 'ru', 'zh-Hans', 'x-default']
    return ''.join(f'<link rel="alternate" hreflang="{l}" href="{ORIGIN}{g[l]}">' for l in order if l in g)

def set_hreflang(s, g):
    s = re.sub(r'<link rel="alternate" hreflang="[^"]+" href="[^"]*">', '', s)
    return s.replace('<link rel="preconnect" href="https://fonts.googleapis.com">', hreflang_links(g) + '<link rel="preconnect" href="https://fonts.googleapis.com">', 1)

def toggle_html(g, cur):
    items = [('fr', 'FR'), ('en', 'EN'), ('it', 'IT'), ('es', 'ES'), ('ru', 'RU'), ('zh-Hans', '中文')]
    out = []
    for hl, lab in items:
        if hl not in g: continue
        lang_attr = 'zh-Hans' if hl == 'zh-Hans' else hl
        cur_attr = ' aria-current="page"' if hl == cur else ''
        out.append(f'<a href="{g[hl]}" lang="{lang_attr}"{cur_attr} hreflang="{hl}">{lab}</a>')
    return ''.join(out)

def set_toggles(s, g, cur):
    return re.sub(r'(<nav class="lang-toggle[^"]*"[^>]*>).*?(</nav>)', lambda m: m.group(1) + toggle_html(g, cur) + m.group(2), s, flags=re.S)

def translate_chrome(s, lang):
    # textes hors <main> : remplacement des nœuds texte exacts
    i = s.index('<main'); j = s.index('</main>') + 7
    def tr(part):
        def rep(m):
            raw = m.group(1); t = html.unescape(raw).strip()
            if t in T[lang]:
                return '>' + raw.replace(raw.strip(), esc(T[lang][t])) + '<'
            return m.group(0)
        part = re.sub(r'>([^<>]+)<', rep, part)
        part = re.sub(r'aria-label="Open menu"', 'aria-label="%s"' % T[lang]['Open menu'], part)
        return part
    head_end = s.index('</head>')
    return s[:head_end] + tr(s[head_end:])

WA_SVG = ''

def main_html(lang, d):
    secs = ''.join(f'<section><h2>{h}</h2>{body}</section>' for h, body in d['sections'])
    faq = ''.join(f'<h3>{esc(q)}</h3><p>{esc(a)}</p>' for q, a in d['faq'])
    home = T[lang]['Home']
    crumbs = f'<nav class="crumbs" aria-label="{esc(home)}"><a href="{P[lang]["home"]["slug"]}">{esc(home)}</a><span aria-hidden="true"> › </span><span aria-current="page">{esc(d["h1"])}</span></nav>' if d['group'] != 'home' else ''
    others = ' · '.join(f'<a href="{P[lang][k]["slug"]}">{esc(P[lang][k]["h1"])}</a>' for k in P[lang] if k != d['group'] and k != 'home')
    if d['group'] == 'home':
        book = {'ru': 'Заказать шофёра', 'zh': '预订专车'}[lang]
        hero = ('<section class="hero"><picture><source media="(max-width:1100px)" srcset="/assets/v2/hero-1100.webp">'
                '<img class="hero-img" src="/assets/v2/hero.webp" alt="" width="1872" height="1056" fetchpriority="high"></picture>'
                '<div class="hero-body"><img class="hero-logo" src="/assets/v2/logo-eps-256.webp?v=20261120logo" alt="Elite Prestige Services" width="120" height="120">'
                f'<h1>Elite Prestige Services<span>{esc(d["h1"])}</span></h1><div class="hero-actions">'
                f'<a class="btn btn-gold" href="/?lang=en#reservation">{esc(book)}</a>'
                f'<a class="btn btn-line" href="https://wa.me/33745495321" target="_blank" rel="noopener">{WA_SVG}WhatsApp</a></div></div></section>')
        return (f'<main class="page">{hero}<div class="wrap page-body"><p class="eyebrow">{esc(d["eyebrow"])}</p>'
                f'<p class="intro">{esc(d["intro"])}</p><a class="cta" href="/?lang=en#reservation">{esc(d["cta"])}</a>{secs}'
                f'<section><h2>{T[lang]["Frequently asked questions"]}</h2>{faq}</section><div class="related">{others}</div></div>')
    return (f'<main class="page"><div class="wrap page-body">{crumbs}<p class="eyebrow">{esc(d["eyebrow"])}</p><h1>{esc(d["h1"])}</h1>'
            f'<p class="intro">{esc(d["intro"])}</p><a class="cta" href="/?lang=en#reservation">{esc(d["cta"])}</a>{secs}'
            f'<section><h2>{T[lang]["Frequently asked questions"]}</h2>{faq}</section><div class="related">{others}</div></div>')

def build(lang, key, tpl):
    d = P[lang][key]; g = all_group(key)
    s = tpl
    s = s.replace('<html lang="en"', f'<html lang="{HL[lang]}"', 1)
    s = re.sub(r'<title>[^<]*</title>', f'<title>{esc(d["title"])}</title>', s, count=1)
    s = re.sub(r'<meta name="description" content="[^"]*"', f'<meta name="description" content="{esc(d["desc"])}"', s, count=1)
    s = re.sub(r'<meta property="og:title" content="[^"]*"', f'<meta property="og:title" content="{esc(d["title"])}"', s, count=1)
    s = re.sub(r'<meta property="og:description" content="[^"]*"', f'<meta property="og:description" content="{esc(d["desc"])}"', s, count=1)
    s = re.sub(r'<meta property="og:locale" content="[^"]*"', f'<meta property="og:locale" content="{LOCALE[lang]}"', s, count=1)
    url = ORIGIN + d['slug']
    s = re.sub(r'<link rel="canonical" href="[^"]*"', f'<link rel="canonical" href="{url}"', s, count=1)
    s = re.sub(r'<meta property="og:url" content="[^"]*"', f'<meta property="og:url" content="{url}"', s, count=1)
    s = re.sub(r'<script type="application/ld\+json" data-eps="(ariane|faq)">.*?</script>', '', s, flags=re.S)
    s = set_hreflang(s, g)
    s = set_toggles(s, g, HL[lang])
    i = s.index('<main'); k = s.index('<section class="page-cta wrap"')
    s = s[:i] + main_html(lang, d) + s[k:]
    wa = 'https://wa.me/33745495321?text=' + quote(WA[lang] + d['h1'])
    s = re.sub(r'(href=")https://wa\.me/33745495321[^"]*', lambda m: m.group(1) + wa, s)
    s = translate_chrome(s, lang)
    return s

if __name__ == '__main__':
    tpl = open(f'{ROOT}/en/private-chauffeur-monaco/index.html', encoding='utf-8').read()
    WA_SVG = re.search(r'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10[^"]*"/></svg>', tpl).group(0)
    for lang in ('ru', 'zh'):
        for key in P[lang]:
            out = build(lang, key, tpl)
            path = ROOT + P[lang][key]['slug'] + 'index.html'
            os.makedirs(os.path.dirname(path), exist_ok=True)
            open(path, 'w', encoding='utf-8').write(out)
            print('écrit', path)
    # pages existantes : hreflang ru/zh + sélecteur de langue
    for key in GROUPS:
        g = all_group(key)
        for hl in ('fr', 'en', 'it', 'es'):
            if hl not in g or key == 'home': continue
            f = ROOT + g[hl] + 'index.html'
            s = open(f, encoding='utf-8').read()
            s = set_hreflang(s, g); s = set_toggles(s, g, hl)
            open(f, 'w', encoding='utf-8').write(s); print('relié', f)

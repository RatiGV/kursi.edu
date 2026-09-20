<?php
$courses = [];
$coursesDir = __DIR__ . '/courses';
if (is_dir($coursesDir)) {
    foreach (scandir($coursesDir) as $entry) {
        if ($entry === '.' || $entry === '..') {
            continue;
        }
        $infoPath = $coursesDir . '/' . $entry . '/info.xml';
        if (!is_file($infoPath)) {
            continue;
        }
        $xml = simplexml_load_file($infoPath);
        if ($xml === false) {
            continue;
        }
        $courses[] = [
            'name' => (string) $xml->name,
            'link' => (string) $xml->link,
        ];
    }
}
sort($courses);
$siteUrl = 'https://kursi.edu.ge';
$pageTitle = 'Smart Academy | ონლაინ და ფიზიკური კურსები';
$metaDesc = 'Smart Academy-ის პროფესიული კურსების კატალოგი: HR, მარკეტინგი, დიზაინი და IT მიმართულებები. აირჩიე კურსი და დარეგისტრირდი პრაქტიკოს ლექტორებთან.';
$ogImage = 'https://smartacademy.ge/assets/client/assets/images/coverfbacademy.png?v=2';
$itemListElements = [];
foreach ($courses as $i => $course) {
    $itemListElements[] = [
        '@type' => 'ListItem',
        'position' => $i + 1,
        'url' => $course['link'],
        'name' => $course['name'],
    ];
}
$schemaGraph = [
    '@context' => 'https://schema.org',
    '@graph' => [
        [
            '@type' => 'Organization',
            '@id' => $siteUrl . '/#organization',
            'name' => 'Smart Academy',
            'url' => 'https://smartacademy.ge',
            'logo' => 'https://smartacademy.ge/assets/client/assets/images/logo-bl.svg',
            'sameAs' => ['https://smartacademy.ge'],
        ],
        [
            '@type' => 'WebSite',
            '@id' => $siteUrl . '/#website',
            'name' => 'Smart Academy | კურსები',
            'url' => $siteUrl . '/',
            'publisher' => ['@id' => $siteUrl . '/#organization'],
            'inLanguage' => 'ka',
        ],
        [
            '@type' => 'ItemList',
            '@id' => $siteUrl . '/#courses',
            'name' => 'Smart Academy კურსები',
            'itemListElement' => $itemListElements,
        ],
    ],
];
?><!DOCTYPE html>
<html lang="ka">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?php echo htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8'); ?></title>
<meta name="description" content="<?php echo htmlspecialchars($metaDesc, ENT_QUOTES, 'UTF-8'); ?>">
<link rel="canonical" href="<?php echo $siteUrl; ?>/">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Smart Academy">
<meta property="og:locale" content="ka_GE">
<meta property="og:title" content="<?php echo htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8'); ?>">
<meta property="og:description" content="<?php echo htmlspecialchars($metaDesc, ENT_QUOTES, 'UTF-8'); ?>">
<meta property="og:url" content="<?php echo $siteUrl; ?>/">
<meta property="og:image" content="<?php echo $ogImage; ?>">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<?php echo htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8'); ?>">
<meta name="twitter:description" content="<?php echo htmlspecialchars($metaDesc, ENT_QUOTES, 'UTF-8'); ?>">
<meta name="twitter:image" content="<?php echo $ogImage; ?>">
<script type="application/ld+json"><?php echo json_encode($schemaGraph, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); ?></script>
<link rel="icon" type="image/png" href="assets/images/favicon-16x16.png">
<link rel="preload" as="font" type="font/woff2" href="assets/fonts/firago-800.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="assets/fonts/neuecaps.woff2" crossorigin>
<style>
@font-face{font-display:swap;font-family:FiraGO;font-style:normal;font-weight:400;src:url('assets/fonts/firago-400.woff2') format('woff2')}
@font-face{font-display:swap;font-family:FiraGO;font-style:normal;font-weight:600;src:url('assets/fonts/firago-600.woff2') format('woff2')}
@font-face{font-display:swap;font-family:FiraGO;font-style:normal;font-weight:700;src:url('assets/fonts/firago-700.woff2') format('woff2')}
@font-face{font-display:swap;font-family:FiraGO;font-style:normal;font-weight:800;src:url('assets/fonts/firago-800.woff2') format('woff2')}
@font-face{font-display:swap;font-family:NeueCaps;src:url('assets/fonts/neuecaps.woff2') format('woff2');font-weight:400;font-style:normal}
:root{--bg1:#0b1220;--bg2:#1b1240;--bg3:#3a1d5c;--glass:rgba(255,255,255,0.08);--glass-border:rgba(255,255,255,0.18);--glass-hi:rgba(255,255,255,0.35);--ink:#f5f6fb;--muted:rgba(245,246,251,0.68);--accent:#7c5cff;--accent2:#33d1c9}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:"FiraGO",sans-serif;color:var(--ink);min-height:100vh;background:radial-gradient(1200px 800px at 10% -10%,var(--bg3),transparent),radial-gradient(1000px 700px at 110% 10%,#0e3b52,transparent),linear-gradient(160deg,var(--bg1),var(--bg2) 60%,var(--bg1));overflow-x:hidden;position:relative}
body::before{content:"";position:fixed;inset:0;background:radial-gradient(600px 400px at 20% 30%,rgba(124,92,255,0.25),transparent 60%),radial-gradient(700px 500px at 85% 75%,rgba(51,209,201,0.18),transparent 60%);pointer-events:none;z-index:0}
.orb{position:fixed;border-radius:50%;filter:blur(60px);opacity:0.55;pointer-events:none;z-index:0;animation:float 18s ease-in-out infinite}
.orb1{width:420px;height:420px;background:radial-gradient(circle,#7c5cff,transparent 70%);top:-120px;left:-100px}
.orb2{width:360px;height:360px;background:radial-gradient(circle,#33d1c9,transparent 70%);bottom:-140px;right:-80px;animation-delay:3s}
.orb3{width:280px;height:280px;background:radial-gradient(circle,#ff6ec7,transparent 70%);top:40%;left:60%;animation-delay:6s}
@keyframes float{0%,100%{transform:translateY(0) translateX(0)}50%{transform:translateY(-30px) translateX(20px)}}
.wrap{position:relative;z-index:1;max-width:1180px;margin:0 auto;padding:0 24px 80px}
header.top{display:flex;align-items:center;justify-content:space-between;padding:28px 0;position:sticky;top:0;z-index:20}
.brand{display:flex;align-items:center;gap:12px}
.brand img{height:30px;width:auto;display:block;filter:drop-shadow(0 2px 12px rgba(0,0,0,0.35))}
.brand span{font-weight:700;font-size:18px;letter-spacing:-0.02em}
nav.pill{display:flex;gap:6px;padding:6px;border-radius:999px;background:var(--glass);border:1px solid var(--glass-border);backdrop-filter:blur(20px) saturate(180%);-webkit-backdrop-filter:blur(20px) saturate(180%)}
nav.pill a{padding:10px 18px;border-radius:999px;color:var(--ink);text-decoration:none;font-size:14px;font-weight:600;opacity:0.85;transition:background 0.25s,opacity 0.25s}
nav.pill a:hover{background:rgba(255,255,255,0.12);opacity:1}
.hero{padding:60px 0 40px;text-align:center}
.eyebrow{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:999px;background:var(--glass);border:1px solid var(--glass-border);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);font-size:13px;font-weight:600;color:var(--muted);margin-bottom:24px}
.eyebrow i{width:7px;height:7px;border-radius:50%;background:var(--accent2);box-shadow:0 0 10px var(--accent2)}
h1{font-family:"NeueCaps","FiraGO",sans-serif;font-stretch:68%;font-weight:900;font-size:clamp(36px,6vw,64px);line-height:1.05;letter-spacing:-0.03em;background:linear-gradient(180deg,#fff,rgba(255,255,255,0.75));-webkit-background-clip:text;background-clip:text;color:transparent;margin-bottom:20px}
.hero p{max-width:620px;margin:0 auto;color:var(--muted);font-size:18px;line-height:1.6}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;margin-top:56px}
.card{position:relative;border-radius:28px;padding:28px;background:linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.05));border:1px solid var(--glass-border);backdrop-filter:blur(24px) saturate(180%);-webkit-backdrop-filter:blur(24px) saturate(180%);box-shadow:0 8px 32px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.25);overflow:hidden;text-decoration:none;color:var(--ink);display:flex;flex-direction:column;gap:18px;min-height:190px;transition:transform 0.35s cubic-bezier(0.2,0.8,0.2,1),box-shadow 0.35s,border-color 0.35s;opacity:0;transform:translateY(24px);animation:rise 0.7s cubic-bezier(0.2,0.8,0.2,1) forwards}
.card::before{content:"";position:absolute;top:-60%;left:-20%;width:60%;height:220%;background:linear-gradient(120deg,rgba(255,255,255,0.35),transparent 60%);transform:rotate(20deg);opacity:0.5;pointer-events:none;transition:opacity 0.35s}
.card:hover{transform:translateY(-6px) scale(1.015);box-shadow:0 20px 50px rgba(124,92,255,0.28),inset 0 1px 0 rgba(255,255,255,0.35);border-color:var(--glass-hi)}
.card:hover::before{opacity:0.85}
.card .num{font-family:"FiraGO",sans-serif;font-size:13px;font-weight:700;color:var(--accent2);letter-spacing:0.06em}
.card h3{font-family:"FiraGO",sans-serif;font-size:22px;font-weight:700;line-height:1.3;letter-spacing:-0.01em}
.card .meta{display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:14px;border-top:1px solid rgba(255,255,255,0.12)}
.card .domain{font-size:13px;color:var(--muted);font-weight:600}
.card .go{width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,0.12);border:1px solid var(--glass-border);display:flex;align-items:center;justify-content:center;transition:background 0.3s,transform 0.3s}
.card:hover .go{background:var(--accent);transform:rotate(45deg)}
.card .go svg{width:16px;height:16px;stroke:#fff}
.empty{grid-column:1/-1;text-align:center;padding:60px 24px;color:var(--muted);border-radius:24px;background:var(--glass);border:1px solid var(--glass-border);backdrop-filter:blur(20px)}
footer{text-align:center;padding:50px 0 10px;color:var(--muted);font-size:13px}
@keyframes rise{to{opacity:1;transform:translateY(0)}}
@media(max-width:640px){nav.pill{display:none}.hero{padding:40px 0 20px}}
</style>
</head>
<body>
<div class="orb orb1"></div>
<div class="orb orb2"></div>
<div class="orb orb3"></div>
<div class="wrap">
<header class="top">
<div class="brand">
<img src="assets/images/logo-wt.svg" alt="Smart Academy" width="125" height="30">
</div>
<nav class="pill">
<a href="https://smartacademy.ge" target="_blank" rel="noopener">smartacademy.ge</a>
</nav>
</header>
<section class="hero">
<div class="eyebrow"><i></i>Smart Academy - საწავლო კურსები</div>
<h1>აირჩიე შენი<br>შემდეგი კურსი</h1>
<p>პრაქტიკული, ინდუსტრიაზე მორგებული პროფესიული კურსები, რომლებიც გეხმარებათ ახალი უნარების დაუფლებაში და კარიერულ წინსვლაში.</p>
</section>
<div class="grid">
<?php if (empty($courses)): ?>
<div class="empty">კურსები ჯერ არ არის დამატებული.</div>
<?php else: ?>
<?php foreach ($courses as $i => $course): ?>
<a class="card" style="animation-delay:<?php echo $i * 0.06; ?>s" href="<?php echo htmlspecialchars($course['link'], ENT_QUOTES, 'UTF-8'); ?>" target="_blank" rel="noopener">
<div class="num">კურსი <?php echo str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT); ?></div>
<h3><?php echo htmlspecialchars($course['name'], ENT_QUOTES, 'UTF-8'); ?></h3>
<div class="meta">
<span class="domain"><?php echo htmlspecialchars(parse_url($course['link'], PHP_URL_HOST), ENT_QUOTES, 'UTF-8'); ?></span>
<span class="go"><svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="19" x2="19" y2="5"></line><polyline points="9 5 19 5 19 15"></polyline></svg></span>
</div>
</a>
<?php endforeach; ?>
<?php endif; ?>
</div>
<footer>&copy; <?php echo date('Y'); ?> Smart Academy. ყველა უფლება დაცულია.</footer>
</div>
</body>
</html>

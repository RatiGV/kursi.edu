<?php
header('Content-Type: application/xml; charset=UTF-8');
$baseUrl = 'https://kursi.edu.ge';
$today = date('Y-m-d');
$urls = [];
$urls[] = ['loc' => $baseUrl . '/', 'lastmod' => $today, 'priority' => '1.0'];
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
        $link = (string) $xml->link;
        if ($link === '') {
            continue;
        }
        $urls[] = ['loc' => $link, 'lastmod' => date('Y-m-d', filemtime($infoPath)), 'priority' => '0.8'];
    }
}
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<?php foreach ($urls as $u): ?>
<url>
<loc><?php echo htmlspecialchars($u['loc'], ENT_QUOTES, 'UTF-8'); ?></loc>
<lastmod><?php echo $u['lastmod']; ?></lastmod>
<priority><?php echo $u['priority']; ?></priority>
</url>
<?php endforeach; ?>
</urlset>

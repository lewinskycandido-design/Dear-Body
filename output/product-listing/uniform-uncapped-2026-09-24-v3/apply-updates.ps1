$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$revisionRoot = $PSScriptRoot
$listingRoot = Split-Path $revisionRoot -Parent
$projectRoot = Split-Path (Split-Path $listingRoot -Parent) -Parent
$uploadRoot = Join-Path $projectRoot 'output/website/upload-ready/shopify-gallery-order-2026-09-24'
$manifestPath = Join-Path $revisionRoot 'manifest.json'
$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
if ($manifest.images.Count -ne 14) { throw 'Expected 14 corrected images.' }
$backupRoot = Join-Path $revisionRoot 'originals'
New-Item -ItemType Directory -Path $backupRoot -Force | Out-Null
$metadataBackup = Join-Path $backupRoot 'metadata'
New-Item -ItemType Directory -Path $metadataBackup -Force | Out-Null
$metadataPaths = @(
  (Join-Path $listingRoot 'SHOPIFY_GALLERY_ORDER_2026-09-24.json'),
  (Join-Path $listingRoot 'ALL_SCENTS_FINAL_2026-09-24.sha256'),
  (Join-Path $listingRoot 'FULL_GALLERY_REVIEW_2026-09-24.json'),
  (Join-Path $listingRoot 'GALLERY_REVIEW_2026-09-24.html'),
  (Join-Path $uploadRoot 'gallery-order.json'),
  (Join-Path $uploadRoot 'gallery-order.csv')
)
foreach ($metadataPath in $metadataPaths) {
  $backup = Join-Path $metadataBackup (Split-Path $metadataPath -Leaf)
  if (!(Test-Path -LiteralPath $backup)) { Copy-Item -LiteralPath $metadataPath -Destination $backup }
}
foreach ($item in $manifest.images) {
  $correctedPath = Join-Path $revisionRoot $item.correctedFile
  $sourcePath = Join-Path $listingRoot $item.source
  $uploadPath = Join-Path (Join-Path $uploadRoot $item.slug) $item.uploadFile
  if (!(Test-Path -LiteralPath $sourcePath) -or !(Test-Path -LiteralPath $uploadPath)) { throw ('Missing destination for ' + $item.slug) }
  $correctedImage = [System.Drawing.Image]::FromFile($correctedPath)
  try {
    if ($correctedImage.Width -ne 1254 -or $correctedImage.Height -ne 1254) { throw ('Unexpected dimensions: ' + $item.slug) }
  } finally { $correctedImage.Dispose() }
}
$bySlug = @{}
$bySource = @{}
foreach ($item in $manifest.images) {
  $correctedPath = Join-Path $revisionRoot $item.correctedFile
  $sourcePath = Join-Path $listingRoot $item.source
  $uploadPath = Join-Path (Join-Path $uploadRoot $item.slug) $item.uploadFile
  $backup = Join-Path $backupRoot ($item.slug + '.png')
  if (!(Test-Path -LiteralPath $backup)) { Copy-Item -LiteralPath $sourcePath -Destination $backup }
  $originalHash = (Get-FileHash -LiteralPath $backup -Algorithm SHA256).Hash.ToLowerInvariant()
  $correctedHash = (Get-FileHash -LiteralPath $correctedPath -Algorithm SHA256).Hash.ToLowerInvariant()
  Copy-Item -LiteralPath $correctedPath -Destination $sourcePath -Force
  Copy-Item -LiteralPath $correctedPath -Destination $uploadPath -Force
  foreach ($destination in @($sourcePath, $uploadPath)) {
    if ((Get-FileHash -LiteralPath $destination -Algorithm SHA256).Hash.ToLowerInvariant() -ne $correctedHash) { throw ('Copy verification failed: ' + $destination) }
  }
  $item | Add-Member -NotePropertyName sha256 -NotePropertyValue $correctedHash -Force
  $item | Add-Member -NotePropertyName originalSha256 -NotePropertyValue $originalHash -Force
  $item | Add-Member -NotePropertyName backupFile -NotePropertyValue ('originals/' + $item.slug + '.png') -Force
  $bySlug[$item.slug] = $item
  $bySource[$item.source] = $item
}
foreach ($orderPath in @((Join-Path $listingRoot 'SHOPIFY_GALLERY_ORDER_2026-09-24.json'), (Join-Path $uploadRoot 'gallery-order.json'))) {
  $order = Get-Content -LiteralPath $orderPath -Raw | ConvertFrom-Json
  foreach ($scent in $order.scents) {
    $item = $bySlug[$scent.scent]
    $frame = $scent.images | Where-Object { $_.source_frame -eq 3 }
    $frame.sha256 = $item.sha256
    $frame.source = Join-Path $listingRoot $item.source
    $frame.path = Join-Path (Join-Path $uploadRoot $item.slug) $item.uploadFile
  }
  $order | Add-Member -NotePropertyName uncapped_revision -NotePropertyValue '2026-09-24-v3: uniform product setup based on Sunset Cocktail; original scent backgrounds retained; native 1254 x 1254 PNG' -Force
  $order | ConvertTo-Json -Depth 30 | Set-Content -LiteralPath $orderPath -Encoding utf8
}
$csvPath = Join-Path $uploadRoot 'gallery-order.csv'
$rows = Import-Csv -LiteralPath $csvPath
foreach ($row in $rows) {
  if ($row.'Source frame' -eq '3') {
    $item = $manifest.images | Where-Object { $_.name -eq $row.Scent }
    if (!$item) { throw ('CSV scent not found: ' + $row.Scent) }
    $row.SHA256 = $item.sha256
    $row.File = Join-Path (Join-Path $uploadRoot $item.slug) $item.uploadFile
  }
}
$rows | Export-Csv -LiteralPath $csvPath -NoTypeInformation -Encoding utf8
$checksumPath = Join-Path $listingRoot 'ALL_SCENTS_FINAL_2026-09-24.sha256'
$checksumLines = Get-Content -LiteralPath $checksumPath
$checksumLines = foreach ($line in $checksumLines) {
  if ($line -match '^([a-fA-F0-9]{64})  (.+)$' -and $bySource.ContainsKey($Matches[2])) {
    $bySource[$Matches[2]].sha256 + '  ' + $Matches[2]
  } else { $line }
}
$checksumLines | Set-Content -LiteralPath $checksumPath -Encoding utf8
$reviewPath = Join-Path $listingRoot 'FULL_GALLERY_REVIEW_2026-09-24.json'
$review = Get-Content -LiteralPath $reviewPath -Raw | ConvertFrom-Json
foreach ($scent in $review.scents) {
  $item = $bySlug[$scent.scent]
  $frame = $scent.frames | Where-Object { $_.frame -eq 3 }
  $frame.sha256 = $item.sha256
  $frame.file = Join-Path $listingRoot $item.source
  $frame.revised = $true
  $frame.reason = 'Standardized product setup using the approved Sunset Cocktail template: upright glass bottle and centered atomizer, bottle in its short base at left, tall canister at right, cap lying at lower left. Individual scent background, label and colors retained. Native 1254 x 1254 PNG.'
  $frame | Add-Member -NotePropertyName dimensions -NotePropertyValue @(1254,1254) -Force
  if ($scent.changed -notcontains 3) { $scent.changed = @($scent.changed + 3 | Sort-Object) }
}
$review | Add-Member -NotePropertyName uncapped_revision -NotePropertyValue 'uniform-uncapped-2026-09-24-v3/manifest.json' -Force
$review.changed_count = @($review.scents | ForEach-Object { $_.frames | Where-Object { $_.revised } }).Count
$review.preserved_count = $review.frame_count - $review.changed_count
$review | ConvertTo-Json -Depth 30 | Set-Content -LiteralPath $reviewPath -Encoding utf8
$galleryPath = Join-Path $listingRoot 'GALLERY_REVIEW_2026-09-24.html'
$gallery = Get-Content -LiteralPath $galleryPath -Raw
$gallery = $gallery.Replace('uncapped-corrections-2026-09-24-v2/', 'uniform-uncapped-2026-09-24-v3/')
$gallery = [regex]::Replace($gallery, '<p class="intro">(?:All 168 images|The 14 uncapped).*?</p>', '<p class="intro">The 14 uncapped packaging-reveal images now use the approved shared product arrangement with individual scent backgrounds and colors. These corrected PNGs are 1254 × 1254 pixels. <a href="uniform-uncapped-2026-09-24-v3/review.html">Review all 14 corrected images</a>. Other frames retain their existing assets and review notes.</p>')
$gallery = [regex]::Replace($gallery, '<article class="card" data-source-frame="3".*?</article>', {
  param($match)
  $card = $match.Value
  foreach ($item in $manifest.images) {
    if ($card.Contains($item.source)) {
      $card = $card.Replace('data-revised="false"', 'data-revised="true"')
      $card = $card.Replace('width="2048" height="2048"', 'width="1254" height="1254"')
      $card = [regex]::Replace($card, [regex]::Escape($item.source) + '(?:\?revision=[a-f0-9]+)*', $item.source + '?revision=' + $item.sha256.Substring(0,12))
      $card = [regex]::Replace($card, '<span class="badge[^"]*">.*?</span>', '<span class="badge revised">Uniform setup</span>')
      $card = [regex]::Replace($card, '<details>.*?</details>', '<details><summary>Review notes</summary><p>Shared product arrangement based on the Sunset Cocktail template. Upright bottle and centered spray, with individual scent label, packaging colors and background retained.</p><a href="uniform-uncapped-2026-09-24-v3/review.html">View corrected collection</a></details>')
      break
    }
  }
  $card
})
$gallery = [regex]::Replace($gallery, '<footer>.*?</footer>', '<footer>The latest uncapped-bottle revision contains 14 native 1254 × 1254 PNGs generated with ImageGen. Previous versions and exact prompts are saved in the revision folder. Other gallery frames retain their existing resolution and review history.</footer>')
Set-Content -LiteralPath $galleryPath -Value $gallery -Encoding utf8
$manifest.status = 'complete: 14 canonical gallery images and 14 local upload copies updated and hash-verified'
$manifest | ConvertTo-Json -Depth 30 | Set-Content -LiteralPath $manifestPath -Encoding utf8
$tile = 360
$caption = 38
$sheet = New-Object System.Drawing.Bitmap(1440,1592)
$graphics = [System.Drawing.Graphics]::FromImage($sheet)
$graphics.Clear([System.Drawing.Color]::FromArgb(248,239,224))
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$font = New-Object System.Drawing.Font('Arial', 13, [System.Drawing.FontStyle]::Bold)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(42,25,30))
for ($index = 0; $index -lt $manifest.images.Count; $index++) {
  $item = $manifest.images[$index]
  $x = ($index % 4) * $tile
  $y = [math]::Floor($index / 4) * ($tile + $caption)
  $picture = [System.Drawing.Image]::FromFile((Join-Path $revisionRoot $item.correctedFile))
  try { $graphics.DrawImage($picture, [int]$x, [int]$y, $tile, $tile) } finally { $picture.Dispose() }
  $graphics.DrawString($item.name, $font, $brush, [single]($x + 10), [single]($y + $tile + 9))
}
$sheet.Save((Join-Path $revisionRoot 'collection-preview.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$brush.Dispose()
$font.Dispose()
$graphics.Dispose()
$sheet.Dispose()
Write-Output 'Updated and verified 14 gallery originals, 14 upload copies, manifests and collection preview.'


$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$packRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$outputRoot = [System.IO.Path]::GetFullPath((Join-Path $packRoot '../..'))
$flowZip = Join-Path ([System.IO.Directory]::GetParent($packRoot).FullName) 'Dear-Body-Flow-All-16-Scripts.zip'
function Update-Entries([string]$SourceRoot, [string]$ZipPath, [bool]$AddTextFiles) {
    $resolvedRoot = (Resolve-Path -LiteralPath $SourceRoot).Path
    $resolvedZip = (Resolve-Path -LiteralPath $ZipPath).Path
    $archive = [System.IO.Compression.ZipFile]::Open($resolvedZip, [System.IO.Compression.ZipArchiveMode]::Update)
    $updated = 0
    try {
        if ($AddTextFiles) {
            $names = @(Get-ChildItem -LiteralPath $resolvedRoot -File -Recurse | Where-Object {
                ($_.Extension -in '.json','.csv','.md','.html','.txt','.srt' -or $_.FullName -match '\\overlays\\[^\\]+\.png$') -and
                $_.FullName -notmatch '\\working\\' -and $_.FullName -notmatch '\\keyframes\\'
            } | ForEach-Object { $_.FullName.Substring($resolvedRoot.Length + 1).Replace('\','/') })
        } else {
            $names = @($archive.Entries | Where-Object { $_.FullName -match '\.(json|csv|md|html|txt|srt)$' } | ForEach-Object { $_.FullName })
        }
        foreach ($name in $names) {
            $source = [System.IO.Path]::GetFullPath((Join-Path $resolvedRoot $name))
            if (-not $source.StartsWith($resolvedRoot + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) { throw 'Archive path outside source root.' }
            if (-not (Test-Path -LiteralPath $source -PathType Leaf)) { throw "Missing archive source: $name" }
            $entry = $archive.GetEntry($name)
            if ($null -ne $entry) { $entry.Delete() }
            [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $source, $name, [System.IO.Compression.CompressionLevel]::Fastest)
            $updated++
        }
    } finally { $archive.Dispose() }
    [pscustomobject]@{Archive=$resolvedZip;UpdatedTextFiles=$updated}
}
$results = @()
$results += Update-Entries $packRoot $flowZip $true
$campaignRoot = Join-Path $outputRoot 'facebook-campaign/bold-faceless-2026-09-25-v02'
$results += Update-Entries $campaignRoot (Join-Path $campaignRoot 'Dear-Body-Facebook-Campaign-12-Assets-and-Scripts.zip') $false
$personalityRoot = Join-Path $outputRoot 'facebook-campaign/personality-discovery-2026-09-25-v01'
$results += Update-Entries $personalityRoot (Join-Path $personalityRoot 'Dear-Body-6-Personality-Discovery-Ads.zip') $false
$check = [System.IO.Compression.ZipFile]::OpenRead($flowZip)
try {
    foreach ($name in @('brand-introduction-script.html','brand-introduction-script.md','brand-introduction-script.json','brand-introduction-voiceover.txt','brand-introduction-voiceover.srt','brand-introduction-on-screen.srt')) {
        if ($null -eq $check.GetEntry($name)) { throw "Missing brand introduction file: $name" }
    }
    $reader = [System.IO.StreamReader]::new($check.GetEntry('script-manifest.json').Open())
    try { $scripts = $reader.ReadToEnd() | ConvertFrom-Json } finally { $reader.Dispose() }
    if ($scripts.Count -ne 16) { throw 'Expected the 16 original scripts plus a separate introduction edit.' }
    foreach ($script in $scripts) {
        if ($script.fullVoiceover -notmatch 'magnetic cap' -or $script.fullVoiceover -notmatch 'i-display') { throw "Missing feature copy in packed script $($script.id)" }
    }
    $frameCount = @($check.Entries | Where-Object { $_.FullName -match '/frames/.*\.png$' }).Count
    $overlayCount = @($check.Entries | Where-Object { $_.FullName -match '/overlays/.*\.png$' }).Count
    if ($frameCount -ne 101 -or $overlayCount -ne 100) { throw 'Original frame/overlay set incomplete.' }
    $report = [pscustomobject]@{Archives=$results;FlowEntries=$check.Entries.Count;OriginalScripts=$scripts.Count;BonusBrandIntroduction=$true;Frames=$frameCount;Overlays=$overlayCount}
    $report | ConvertTo-Json -Depth 4
} finally { $check.Dispose() }

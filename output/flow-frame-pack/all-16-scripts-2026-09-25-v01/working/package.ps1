$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$packRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$zipPath = Join-Path ([System.IO.Directory]::GetParent($packRoot).FullName) 'Dear-Body-Flow-All-16-Scripts.zip'
if (Test-Path -LiteralPath $zipPath) { throw 'Archive already exists; choose a versioned output instead of replacing it.' }
$archive = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)
$count = 0
try {
    $packFiles = Get-ChildItem -LiteralPath $packRoot -File -Recurse | Where-Object {
        $_.FullName -notmatch '\\working\\' -and $_.FullName -notmatch '\\keyframes\\'
    }
    foreach ($packFile in $packFiles) {
        $relativePath = $packFile.FullName.Substring($packRoot.Length + 1).Replace('\','/')
        [void][System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $packFile.FullName, $relativePath, [System.IO.Compression.CompressionLevel]::Fastest)
        $count++
    }
} finally {
    $archive.Dispose()
}
$checkArchive = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
try {
    $frameCount = @($checkArchive.Entries | Where-Object { $_.FullName -match '/frames/.*\.png$' }).Count
    $overlayCount = @($checkArchive.Entries | Where-Object { $_.FullName -match '/overlays/.*\.png$' }).Count
    $scriptCount = @($checkArchive.Entries | Where-Object { $_.FullName -match '/script\.txt$' }).Count
    if ($frameCount -ne 101 -or $overlayCount -ne 100 -or $scriptCount -ne 16) { throw 'Archive contents incomplete.' }
    [pscustomobject]@{Archive=$zipPath;Entries=$count;Frames=$frameCount;Overlays=$overlayCount;Scripts=$scriptCount;Bytes=(Get-Item -LiteralPath $zipPath).Length} | ConvertTo-Json
} finally {
    $checkArchive.Dispose()
}


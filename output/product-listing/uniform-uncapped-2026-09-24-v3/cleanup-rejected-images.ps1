param([ValidateSet('Plan','Workspace','Cache','Verify')][string]$Mode='Plan')
$ErrorActionPreference='Stop'
$workspaceRoot=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../../..')).TrimEnd('\')
$listingRoot=Join-Path $workspaceRoot 'output/product-listing'
$currentRoot=Join-Path $listingRoot 'uniform-uncapped-2026-09-24-v3'
$priorRoot=Join-Path $listingRoot 'uncapped-corrections-2026-09-24-v2'
$cacheRoot='C:\Users\lhemy\.codex\generated_images'
$taskCache=Join-Path $cacheRoot '01a0d3e5-424c-7db0-b59a-8f3231494528'
$planPath=Join-Path $currentRoot 'rejected-image-cleanup-plan.json'
$receiptPath=Join-Path $currentRoot 'rejected-image-cleanup.json'
$current=Get-Content -LiteralPath (Join-Path $currentRoot 'manifest.json') -Raw | ConvertFrom-Json
$approved=New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::OrdinalIgnoreCase)
$protectedPaths=New-Object 'System.Collections.Generic.HashSet[string]' ([StringComparer]::OrdinalIgnoreCase)
$gallery=Get-Content -LiteralPath (Join-Path $listingRoot 'SHOPIFY_GALLERY_ORDER_2026-09-24.json') -Raw | ConvertFrom-Json
foreach($scent in $gallery.scents){
 foreach($frame in $scent.images){
  $canonical=Join-Path $listingRoot $frame.source_relative
  $actual=(Get-FileHash -LiteralPath $canonical -Algorithm SHA256).Hash.ToLowerInvariant()
  [void]$approved.Add($actual)
  [void]$protectedPaths.Add([IO.Path]::GetFullPath($canonical))
 }
}
foreach($item in $current.images){
 foreach($path in @((Join-Path $currentRoot $item.correctedFile),$item.generatedPath)){
  [void]$protectedPaths.Add([IO.Path]::GetFullPath($path))
 }
 [void]$approved.Add($item.sha256)
}
function Is-Within([string]$Path,[string]$Root){
 $full=[IO.Path]::GetFullPath($Path)
 return $full.StartsWith($Root.TrimEnd('\')+'\',[StringComparison]::OrdinalIgnoreCase)
}
if($Mode -eq 'Plan'){
 $candidates=@{}
 $hashReasons=@{}
 $lengths=New-Object 'System.Collections.Generic.HashSet[long]'
 function Add-Candidate([string]$Path,[string]$Reason,[string]$ExpectedHash=''){
  if(!$Path -or !(Test-Path -LiteralPath $Path -PathType Leaf)){return}
  $full=[IO.Path]::GetFullPath($Path)
  if(!(Is-Within $full $workspaceRoot) -and !(Is-Within $full $cacheRoot)){return}
  if($protectedPaths.Contains($full)){return}
  if([IO.Path]::GetExtension($full).ToLowerInvariant() -notin @('.png','.jpg','.jpeg','.webp')){return}
  $hash=(Get-FileHash -LiteralPath $full -Algorithm SHA256).Hash.ToLowerInvariant()
  if($ExpectedHash -and $hash -ne $ExpectedHash){return}
  if($approved.Contains($hash)){return}
  $file=Get-Item -LiteralPath $full
  $hashReasons[$hash]=$Reason
  [void]$lengths.Add($file.Length)
  $candidates[$full]=[pscustomobject]@{path=$full;sha256=$hash;bytes=$file.Length;reason=$Reason;external=(Is-Within $full $cacheRoot)}
 }
 $prior=Get-Content -LiteralPath (Join-Path $priorRoot 'manifest.json') -Raw | ConvertFrom-Json
 foreach($item in $prior.images){
  Add-Candidate (Join-Path $priorRoot $item.backupFile) 'Earlier uncapped gallery image replaced after the user reported deformed bottles and requested the full collection.'
  Add-Candidate (Join-Path $priorRoot $item.correctedFile) 'Earlier bottle revision replaced by the user-requested uniform product setup.'
  Add-Candidate $item.generatedPath 'Native ImageGen copy of the earlier bottle revision replaced by the uniform product setup.'
 }
 foreach($item in $current.images){
  Add-Candidate (Join-Path $currentRoot $item.backupFile) 'Backup of the earlier product setup replaced by the final uniform template.'
  Add-Candidate $item.previousGeneratedPath 'Earlier generated product setup superseded by the user-selected template.'
  Add-Candidate $item.previousCandidatePath 'Spray-head candidate rejected during consistency review and replaced by the final refinement.'
  Add-Candidate $item.supersededGeneratedPath 'Shared-background candidate rejected when the user required individual scent backgrounds.'
 }
 foreach($file in (Get-ChildItem -LiteralPath (Join-Path $currentRoot 'superseded') -File)){
  Add-Candidate $file.FullName 'Rejected shared-background or spray-head draft, explicitly tracked as superseded.'
 }
 foreach($file in (Get-ChildItem -LiteralPath (Join-Path $priorRoot 'references') -File)){
  Add-Candidate $file.FullName 'Derived input copy of the replaced uncapped artwork; original raw product photographs are excluded.'
 }
 Add-Candidate (Join-Path $priorRoot 'collection-preview.png') 'Outdated contact sheet showing earlier product versions replaced by the final collection.'
 Add-Candidate (Join-Path $taskCache 'exec-4b6d2df4-c71d-4f65-94fc-000fce3597ac.png') 'First Mistened Narcissus candidate retained a slanted bottle and was replaced after user feedback.'
 $legacyExisting=0
 foreach($log in (Get-ChildItem -LiteralPath $listingRoot -File -Filter '*REJECTED*DELETED*.json')){
  $data=Get-Content -LiteralPath $log.FullName -Raw | ConvertFrom-Json
  $records=@($data.files)+@($data.deleted | Where-Object {$_ -isnot [int] -and $_ -isnot [long]})
  foreach($record in $records){
   $sourcePath=if($record.path){$record.path}else{$record.file}
   if(!$sourcePath){continue}
   $local=$null
   if($sourcePath -match '/Dear Body/(.+)$'){$local=Join-Path $workspaceRoot $Matches[1]}
   elseif($sourcePath -match '/\.codex/generated_images/(.+)$'){$local=Join-Path $cacheRoot $Matches[1]}
   if(!$local -or !(Test-Path -LiteralPath $local -PathType Leaf)){continue}
   $legacyExisting++
   $hash=if($record.sha256){$record.sha256}else{$record.hash}
   Add-Candidate $local ('Previously documented rejection in '+$log.Name+': '+$record.reason) $hash
  }
 }
 $relativePaths=& rg --files -g '*.png' -g '*.jpg' -g '*.jpeg' -g '*.webp' -g '!node_modules' -g '!vendor' -g '!.git' $workspaceRoot
 foreach($relativePath in $relativePaths){
  $file=Get-Item -LiteralPath $relativePath
  if(!$lengths.Contains($file.Length) -or $protectedPaths.Contains($file.FullName) -or $candidates.ContainsKey($file.FullName)){continue}
  $hash=(Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
  if($hashReasons.ContainsKey($hash)){Add-Candidate $file.FullName ('Exact duplicate of rejected artwork: '+$hashReasons[$hash]) $hash}
 }
 $files=@($candidates.Values | Sort-Object path)
 $plan=[pscustomobject]@{date='2026-09-25';scope='Confirmed rejected and replaced uncapped artwork, failed drafts, derived input copies and exact duplicates; approved image hashes excluded.';approvedGalleryImages=168;legacyExistingPaths=$legacyExisting;workspaceCount=@($files | Where-Object {!$_.external}).Count;cacheCount=@($files | Where-Object {$_.external}).Count;bytes=($files | Measure-Object bytes -Sum).Sum;files=$files}
 $plan | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $planPath -Encoding utf8
 $plan | Select-Object workspaceCount,cacheCount,bytes,legacyExistingPaths,approvedGalleryImages | ConvertTo-Json
 exit
}
$plan=Get-Content -LiteralPath $planPath -Raw | ConvertFrom-Json
$receipt=if(Test-Path -LiteralPath $receiptPath){Get-Content -LiteralPath $receiptPath -Raw | ConvertFrom-Json}else{[pscustomobject]@{date='2026-09-25';deleted=@();approvedGalleryImagesVerified=0;remaining=0}}
if($Mode -in @('Workspace','Cache')){
 $targets=@($plan.files | Where-Object { if($Mode -eq 'Workspace'){!$_.external}else{$_.external} })
 foreach($item in $targets){
  $full=[IO.Path]::GetFullPath($item.path)
  $root=if($Mode -eq 'Workspace'){$workspaceRoot}else{$cacheRoot}
  if(!(Is-Within $full $root)){throw ('Path outside intended cleanup root: '+$full)}
  if($protectedPaths.Contains($full) -or $approved.Contains($item.sha256)){throw ('Protected final image: '+$full)}
  if(!(Test-Path -LiteralPath $full -PathType Leaf)){continue}
  $hash=(Get-FileHash -LiteralPath $full -Algorithm SHA256).Hash.ToLowerInvariant()
  if($hash -ne $item.sha256){throw ('File changed after cleanup plan: '+$full)}
  Remove-Item -LiteralPath $full -Force
  $receipt.deleted=@($receipt.deleted)+$item
  $receipt | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $receiptPath -Encoding utf8
 }
}
$remaining=@($plan.files | Where-Object {Test-Path -LiteralPath $_.path -PathType Leaf})
foreach($item in $current.images){
 $final=Join-Path $currentRoot $item.correctedFile
 if((Get-FileHash -LiteralPath $final -Algorithm SHA256).Hash.ToLowerInvariant() -ne $item.sha256){throw ('Final checksum changed: '+$final)}
}
$receipt.approvedGalleryImagesVerified=168
$receipt.remaining=$remaining.Count
$receipt | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $receiptPath -Encoding utf8
[pscustomobject]@{deleted=$receipt.deleted.Count;remaining=$remaining.Count;approvedGalleryImagesVerified=168;finalCollectionImagesVerified=14} | ConvertTo-Json


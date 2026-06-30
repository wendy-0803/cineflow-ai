$ErrorActionPreference = "Stop"

$previewPath = Join-Path $PSScriptRoot "preview\index.html"

if (-not (Test-Path -LiteralPath $previewPath)) {
  throw "Preview file not found: $previewPath"
}

Start-Process -FilePath $previewPath

Write-Host "Opened CineFlow AI static MVP preview:"
Write-Host $previewPath

$ErrorActionPreference = "Stop"

$node = "C:\Users\zxw\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$nextEntrypoint = Join-Path $PSScriptRoot "node_modules\next\dist\bin\next"
$logDir = Join-Path $PSScriptRoot ".next-runtime"
$stdoutLog = Join-Path $logDir "next.stdout.log"
$stderrLog = Join-Path $logDir "next.stderr.log"
$pidFile = Join-Path $logDir "next.pid"

if (-not (Test-Path -LiteralPath $node)) {
  throw "Bundled Node not found: $node"
}

if (-not (Test-Path -LiteralPath $nextEntrypoint)) {
  throw "Next.js entrypoint not found. Run .\\start-next.ps1 once first."
}

New-Item -ItemType Directory -Force -Path $logDir | Out-Null

if (Test-Path -LiteralPath $pidFile) {
  $existingPid = Get-Content -LiteralPath $pidFile -ErrorAction SilentlyContinue
  if ($existingPid) {
    $existingProcess = Get-Process -Id $existingPid -ErrorAction SilentlyContinue
    if ($existingProcess) {
      Write-Host "Next.js is already running with PID $existingPid"
      exit 0
    }
  }
}

Remove-Item -LiteralPath $stdoutLog,$stderrLog -Force -ErrorAction SilentlyContinue

$process = Start-Process `
  -FilePath $node `
  -ArgumentList @($nextEntrypoint, "dev", "--hostname", "127.0.0.1", "--port", "3000") `
  -WorkingDirectory $PSScriptRoot `
  -RedirectStandardOutput $stdoutLog `
  -RedirectStandardError $stderrLog `
  -PassThru

$process.Id | Set-Content -LiteralPath $pidFile

Write-Host "Started Next.js in background on http://127.0.0.1:3000"
Write-Host "PID: $($process.Id)"
Write-Host "Logs:"
Write-Host $stdoutLog
Write-Host $stderrLog

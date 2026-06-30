$ErrorActionPreference = "Stop"

$pidFile = Join-Path $PSScriptRoot ".next-runtime\next.pid"

if (-not (Test-Path -LiteralPath $pidFile)) {
  Write-Host "No PID file found. Next.js may already be stopped."
  exit 0
}

$pid = Get-Content -LiteralPath $pidFile -ErrorAction SilentlyContinue
if (-not $pid) {
  Remove-Item -LiteralPath $pidFile -Force -ErrorAction SilentlyContinue
  Write-Host "PID file was empty and has been cleared."
  exit 0
}

$process = Get-Process -Id $pid -ErrorAction SilentlyContinue
if ($process) {
  Stop-Process -Id $pid -Force
  Write-Host "Stopped Next.js process $pid"
} else {
  Write-Host "Process $pid was not running."
}

Remove-Item -LiteralPath $pidFile -Force -ErrorAction SilentlyContinue

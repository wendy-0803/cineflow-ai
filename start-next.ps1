$ErrorActionPreference = "Stop"

$node = "C:\Users\zxw\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$pnpm = "C:\Users\zxw\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd"

if (-not (Test-Path -LiteralPath $node)) {
  throw "Bundled Node not found: $node"
}
if (-not (Test-Path -LiteralPath $pnpm)) {
  throw "Bundled pnpm not found: $pnpm"
}

Push-Location $PSScriptRoot
try {
  if (-not (Test-Path -LiteralPath "node_modules")) {
    Write-Host "Installing dependencies. This can take several minutes on a slow network..."
    Write-Host "Step 1/2: trying npmmirror registry"
    & $pnpm install `
      --registry=https://registry.npmmirror.com `
      --fetch-timeout=300000 `
      --fetch-retries=5 `
      --network-concurrency=2
    if ($LASTEXITCODE -ne 0) {
      Write-Host "npmmirror failed. Step 2/2: trying official npm registry"
      & $pnpm install `
        --registry=https://registry.npmjs.org `
        --fetch-timeout=300000 `
        --fetch-retries=5 `
        --network-concurrency=2
    }
  }

  $env:PATH = "C:\Users\zxw\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;$env:PATH"
  Write-Host "Approving dependency build scripts"
  & $pnpm approve-builds --all
  if ($LASTEXITCODE -ne 0) {
    Write-Host "approve-builds returned a non-zero code, but we will still try to start Next."
  }

  Write-Host "Starting Next.js dev server"
  & $node $PSScriptRoot\node_modules\next\dist\bin\next dev --hostname 127.0.0.1 --port 3000
}
finally {
  Pop-Location
}

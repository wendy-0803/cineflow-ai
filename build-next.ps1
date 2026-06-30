$ErrorActionPreference = "Stop"

$node = "C:\Users\zxw\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

if (-not (Test-Path -LiteralPath $node)) {
  throw "Bundled Node not found: $node"
}

$env:PATH = "C:\Users\zxw\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;$env:PATH"
Push-Location $PSScriptRoot
try {
  & $node $PSScriptRoot\node_modules\next\dist\bin\next build
}
finally {
  Pop-Location
}

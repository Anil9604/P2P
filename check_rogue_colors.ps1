Get-ChildItem -Path d:\p2p\src -Filter *.js -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    # Matches "colors.sometheme" where it's NOT preceded by "theme."
    # We use a negative lookbehind-like approach in PowerShell if possible, or just string manipulation
    $lines = Get-Content $_.FullName
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match "(?<!theme\.)\bcolors\.(background|primary|secondary|accent|success|error|card|surface|primaryText|secondaryText|textMuted|divider|border|inputBg|headerBg|hint)\b") {
            Write-Host "Potential issue in: $($_.FullName) at line $($i + 1): $($lines[$i].Trim())"
        }
    }
}

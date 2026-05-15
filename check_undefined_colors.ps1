Get-ChildItem -Path d:\p2p\src -Filter *.js -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    # Matches "colors.something"
    $matches = [regex]::Matches($content, "\bcolors\.\w+")
    if ($matches.Count -gt 0) {
        # Check if "colors" is defined in this file
        # 1. theme.colors (handled by "theme." prefix)
        # 2. const { colors } = ...
        # 3. const colors = ...
        # 4. colors => (arrow function param)
        # 5. function(..., colors, ...)
        if ($content -notmatch "theme\.colors" -and $content -notmatch "const\s+\{\s*colors\s*\}\s*=" -and $content -notmatch "const\s+colors\s*=" -and $content -notmatch "colors\s*=>" -and $content -notmatch "function\s+.*\(\s*colors\s*\)" -and $content -notmatch "static\s+getStyles\(\s*colors\s*\)") {
             Write-Host "Suspect file: $($_.FullName)"
        }
    }
}

Get-ChildItem -Path d:\p2p\src -Filter *.js -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match "\bcolors\.") {
        if ($content -notmatch "theme\.colors" -and $content -notmatch "const\s+\{\s*colors\s*\}\s*=" -and $content -notmatch "const\s+colors\s*=" -and $content -notmatch "colors\s*=>") {
            Write-Host "Potential issue in: $($_.FullName)"
        }
    }
}

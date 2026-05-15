Get-ChildItem -Path d:\p2p\src -Filter *.js -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName
    for ($i = 0; $i -lt $content.Count; $i++) {
        $line = $content[$i]
        # Match "colors." but NOT "theme.colors."
        if ($line -match "(?<!theme\.)\bcolors\.[a-zA-Z]+") {
            Write-Host "$($_.FullName):$($i+1): $($line.Trim())"
        }
    }
}

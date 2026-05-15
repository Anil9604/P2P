Get-ChildItem -Path d:\p2p\src -Filter *.js -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName
    for ($i = 0; $i -lt $content.Count; $i++) {
        if ($content[$i] -match "\bcolors\.[a-zA-Z]+" -and $content[$i] -notmatch "theme\.colors") {
            Write-Host "$($_.FullName):$($i+1): $($content[$i].Trim())"
        }
    }
}

$files = Get-ChildItem -Path d:\p2p\src -Filter *.js -Recurse
foreach ($file in $files) {
    if ($file.Name -match "node_modules") { continue }
    $content = Get-Content $file.FullName
    for ($i = 0; $i -lt $content.Count; $i++) {
        $line = $content[$i]
        # Match standalone "colors." (lowercase) but NOT "theme.colors."
        if ($line -match "(?<!theme\.)\bcolors\.[a-zA-Z]+") {
            $msg = "[MATCH] " + $file.FullName + ":" + ($i+1) + ": " + $line.Trim()
            Write-Host $msg
        }
    }
}

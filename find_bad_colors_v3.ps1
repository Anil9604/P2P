$files = Get-ChildItem -Path d:\p2p\src -Filter *.js -Recurse
foreach ($file in $files) {
    if ($file.FullName -match "node_modules") { continue }
    $content = Get-Content $file.FullName
    for ($i = 0; $i -lt $content.Count; $i++) {
        $line = $content[$i]
        # Case-sensitive match for "colors." but NOT "theme.colors."
        if ($line -cmatch "(?<!theme\.)\bcolors\.") {
            $msg = "[MATCH] " + $file.FullName + ":" + ($i+1) + ": " + $line.Trim()
            Write-Host $msg
        }
    }
}

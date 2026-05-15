Get-ChildItem -Path d:\p2p\src -Filter *.js -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    # Simple regex to find duplicate parameters in function( { ... } )
    # This is a bit complex for a regex, so maybe just check the common pattern I used.
    if ($content -match "(\w+)\s*=\s*[^,]+,\s*\1\s*=\s*[^,]+") {
        Write-Host "Potential duplicate parameter in: $($_.FullName)"
    }
}

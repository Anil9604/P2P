$files = @(
    "d:\p2p\src\screens\HomeScreen.js",
    "d:\p2p\src\screens\TrackingScreen.js",
    "d:\p2p\src\screens\ParcelActivityScreen.js",
    "d:\p2p\src\screens\ManageTripsScreen.js",
    "d:\p2p\src\screens\MyParcelsScreen.js",
    "d:\p2p\src\screens\DeliverScreen.js",
    "d:\p2p\src\components\InfoRow.js",
    "d:\p2p\src\components\StatusBadge.js"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Cleaning up artifacts in $file"
        $content = Get-Content $file -Raw
        
        # Cleanup regex artifacts
        $content = $content.Replace("'#6366F1'Text", "'#1A1A1A'")
        $content = $content.Replace("'#64748B'Secondary", "'#64748B'")
        $content = $content.Replace("'#64748B'Text", "'#64748B'")
        $content = $content.Replace("'#1A1A1A'Text", "'#1A1A1A'")
        
        Set-Content $file $content -NoNewline
    }
}

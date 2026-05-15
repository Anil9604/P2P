$files = @("d:\p2p\src\screens\SettingsScreen.js", "d:\p2p\src\screens\ProfileScreen.js")

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Reverting colors in $file"
        $content = Get-Content $file -Raw
        
        $content = $content -replace 'colors\.background', "'#F8FAFC'"
        $content = $content -replace 'colors\.surface', "'#FFFFFF'"
        $content = $content -replace 'colors\.primary', "'#6366F1'"
        $content = $content -replace 'colors\.textSecondary', "'#64748B'"
        $content = $content -replace 'colors\.textMuted', "'#94A3B8'"
        $content = $content -replace 'colors\.text', "'#1A1A1A'"
        $content = $content -replace 'colors\.divider', "'#E2E8F0'"
        $content = $content -replace 'colors\.error', "'#EF4444'"
        $content = $content -replace 'colors\.success', "'#10B981'"
        $content = $content -replace '\s+colors=\{colors\}', ""
        $content = $content -replace ',\s*colors\b', ""

        Set-Content $file $content -NoNewline
    } else {
        Write-Warning "File not found: $file"
    }
}

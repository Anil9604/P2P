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
        Write-Host "Reverting colors and theme logic in $file"
        $content = Get-Content $file -Raw
        
        # Hooks and Vars
        $content = $content.Replace('const { theme: { colors }, isDark } = useTheme();', 'const isDark = false;')
        $content = $content.Replace('const { colors, isDark } = useTheme();', 'const isDark = false;')
        $content = $content.Replace('const { theme: { colors } } = useTheme();', '')
        $content = $content.Replace('const styles = getStyles(colors);', 'const styles = getStyles();')
        $content = $content.Replace('const styles = useMemo(() => getStyles(colors), [colors]);', 'const styles = getStyles();')
        
        # Function Signature
        $content = $content.Replace('const getStyles = colors =>', 'const getStyles = () =>')
        $content = $content.Replace('const getStyles = (colors) =>', 'const getStyles = () =>')
        $content = $content.Replace('getStyles = colors =>', 'getStyles = () =>')
        $content = $content.Replace('getStyles = (colors) =>', 'getStyles = () =>')

        # Colors
        $content = $content -replace 'colors\.background', "'#F8FAFC'"
        $content = $content -replace 'colors\.surface', "'#FFFFFF'"
        $content = $content -replace 'colors\.primary', "'#6366F1'"
        $content = $content -replace 'colors\.textSecondary', "'#64748B'"
        $content = $content -replace 'colors\.secondaryText', "'#64748B'"
        $content = $content -replace 'colors\.textMuted', "'#94A3B8'"
        $content = $content -replace 'colors\.text', "'#1A1A1A'"
        $content = $content -replace 'colors\.primaryText', "'#1A1A1A'"
        $content = $content -replace 'colors\.divider', "'#E2E8F0'"
        $content = $content -replace 'colors\.border', "'#E2E8F0'"
        $content = $content -replace 'colors\.error', "'#EF4444'"
        $content = $content -replace 'colors\.success', "'#10B981'"
        $content = $content -replace 'colors\.on_primary', "'#FFFFFF'"
        $content = $content -replace 'colors\.accent', "'#F59E0B'"
        $content = $content -replace 'colors\.card', "'#FFFFFF'"
        $content = $content -replace 'colors\.headerBg', "'#FFFFFF'"
        $content = $content -replace 'colors\.inputBg', "'#F8FAFC'"
        $content = $content -replace 'colors\.hint', "'#94A3B8'"

        # Props
        $content = $content -replace '\s+colors=\{colors\}', ""
        $content = $content -replace ',\s*colors\b', ""

        # Imports
        $content = $content -replace 'import \{ useTheme \} from "\.\./context/ThemeContext";', ""
        $content = $content -replace 'import \{ useTheme \} from ''\.\./context/ThemeContext'';', ""
        $content = $content -replace 'import \{ useTheme \} from "\.\./\.\./context/ThemeContext";', ""
        
        # variant
        $content = $content -replace 'variant=\{isDark \? "dark" : "light"\}', 'variant="light"'
        $content = $content.Replace('variant={isDark ? "dark" : "light"}', 'variant="light"')

        Set-Content $file $content -NoNewline
    } else {
        Write-Warning "File not found: $file"
    }
}


$filepath = 'd:\p2p\src\screens\PostRouteScreen.js'
$c = Get-Content $filepath -Raw -Encoding UTF8

# Define the new inlined footer
$newFooter = @"

                    {/* INLINED FOOTER (Previously Sticky) */}
                    <View style={styles.footerInlined}>
                        <View style={styles.earningsEstimation}>
                            <Text style={styles.earningsEstLabel}>Est. Earnings for this Trip</Text>
                            <Text style={styles.earningsEstValue}>₹450 - ₹1,200</Text>
                        </View>

                        <TouchableOpacity style={[styles.submitBtn, loading && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={loading} activeOpacity={0.8}>
                            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitText}>{isEditMode ? 'Update Trip' : 'Publish Trip'}</Text>}
                        </TouchableOpacity>
                    </View>
"@

# Check if footer already exists in ScrollView (to avoid duplicate)
if ($c -like "*INLINED FOOTER*") {
    Write-Host "Footer already inlined."
} else {
    # Insert before </ScrollView>
    $c = $c -replace '(</ScrollView>)', ($newFooter + "`n                $1")
    Set-Content $filepath $c -Encoding UTF8
    Write-Host "Refactor successful."
}

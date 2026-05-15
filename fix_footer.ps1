
$filepath = 'd:\p2p\src\screens\PostRouteScreen.js'
$c = Get-Content $filepath -Raw -Encoding UTF8

# Define the footer to remove
$footerRegex = '(?s)\s+?\{\/\* STICKY FOOTER \*\/\}\s+?<View style=\{styles\.footer\}>.*?<\/TouchableOpacity>\s+?<\/View>'
$c = $c -replace $footerRegex, ""

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

# Insert inside ScrollView
$c = $c -replace '(?s)(<\/View>\s*<\/ScrollView>)', ($newFooter + '$1')

Set-Content $filepath $c -Encoding UTF8
Write-Host "Refactor successful."

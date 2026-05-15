
import os

filepath = r'd:\p2p\src\screens\PostRouteScreen.js'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix missing </ScrollView>
# We want it after the second to last </View> (which is the footerInlined's end)
if '</ScrollView>' not in content:
    idx = content.find('</KeyboardAvoidingView>')
    if idx != -1:
        # Find the text before </KeyboardAvoidingView>
        prefix = content[:idx]
        suffix = content[idx:]
        # Insert before </KeyboardAvoidingView> but after some indentation
        content = prefix.rstrip() + '\n                </ScrollView>\n            ' + suffix

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fix successful")

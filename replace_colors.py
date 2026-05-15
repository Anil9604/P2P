import re

with open(r'd:\p2p\src\screens\HomeScreen.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Constants
content = content.replace("const cBg = '#0A0A1A';", "const cBg = '#F3F4F6';")
content = content.replace("const cCard = '#1A1A2E';", "const cCard = '#FFFFFF';")
content = content.replace("const cSurface = '#16213E';", "const cSurface = '#F9FAFB';")
content = content.replace("const cBorder = '#2D3748';", "const cBorder = '#E5E7EB';")
content = content.replace("const cText = '#FFFFFF';", "const cText = '#1F2937';")
content = content.replace("const cHint = '#A0AEC0';", "const cHint = '#6B7280';")

# 2. Header Gradient
content = content.replace("colors={['#1A1A2E', '#16213E']}", "colors={['#FFFFFF', '#FFFFFF']}")

# 3. Text & Icons in JSX
content = content.replace('<MaterialIcons name="notifications-active" size={22} color="#FFF" />', '<MaterialIcons name="notifications-active" size={22} color="#4B5563" />')
content = content.replace('<MaterialIcons name="account-balance-wallet" size={16} color="#FFF" />', '<MaterialIcons name="account-balance-wallet" size={16} color="#4B5563" />')
content = content.replace('<MaterialIcons name="account-balance-wallet" size={32} color="#FFF" />', '<MaterialIcons name="account-balance-wallet" size={32} color="#4361EE" />')

# 4. Styles replacements
parts = content.split('const styles = StyleSheet.create({')
if len(parts) == 2:
    code_part = parts[0]
    style_part = parts[1]
    
    styles_replacements = [
        ('#1A1A2E', '#FFFFFF'),
        ('#16213E', '#F9FAFB'),
        ('#2D3748', '#E5E7EB'),
        ("color: '#FFFFFF'", "color: '#1F2937'"),
        ("color: '#FFF'", "color: '#1F2937'"),
        ("color: '#A0AEC0'", "color: '#6B7280'"),
        ("color: '#718096'", "color: '#9CA3AF'"),
        ("rgba(255,255,255,0.6)", "rgba(0,0,0,0.5)"),
        ("rgba(255,255,255,0.4)", "rgba(0,0,0,0.2)"),
        ("rgba(255,255,255,0.06)", "rgba(0,0,0,0.04)"),
        ("rgba(255,255,255,0.08)", "rgba(0,0,0,0.05)"),
        ("rgba(255,255,255,0.1)", "rgba(0,0,0,0.08)"),
        ("rgba(255,255,255,0.15)", "rgba(0,0,0,0.05)"),
    ]

    for old, new in styles_replacements:
        style_part = style_part.replace(old, new)

    # Re-fix specific things inside style_part that shouldn't be dark
    style_part = style_part.replace('''actionCardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
    }''', '''actionCardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    }''')
    
    style_part = style_part.replace('''trackOrderBtnText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1F2937',
    }''', '''trackOrderBtnText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#4361EE',
    }''')

    style_part = style_part.replace('''walletIconBox: {
        width: 60,
        height: 60,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.05)',''', '''walletIconBox: {
        width: 60,
        height: 60,
        borderRadius: 16,
        backgroundColor: 'rgba(67, 97, 238, 0.1)',''')

    style_part = style_part.replace('''walletWithdrawBtn: {
        flex: 1,
        backgroundColor: '#1F2937',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },''', '''walletWithdrawBtn: {
        flex: 1,
        backgroundColor: '#4361EE',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },''')
    
    style_part = style_part.replace('''walletWithdrawBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1F2937',
    }''', '''walletWithdrawBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    }''')

    content = code_part + 'const styles = StyleSheet.create({' + style_part
    
with open(r'd:\p2p\src\screens\HomeScreen.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Color replacement successful.")

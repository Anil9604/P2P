import re
import os

filepath = r'd:\p2p\src\screens\HomeScreen.js'
with open(filepath, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update background color slightly to a cooler, more premium light grey/blue if possible, but keep it light.
# F3F4F6 is Tailwind gray-100. Let's use F4F7FC which is a very popular premium background color.
text = text.replace("const cBg = '#F3F4F6';", "const cBg = '#F4F7FC';")

# 2. Add shadows and remove borders for 3D appearance 

# Header
text = text.replace(
    "headerGradient: {",
    "headerGradient: {\n        elevation: 8,\n        shadowColor: '#000',\n        shadowOffset: { width: 0, height: 4 },\n        shadowOpacity: 0.05,\n        shadowRadius: 12,"
)

# Search Bar
text = text.replace(
    "backgroundColor: 'rgba(0,0,0,0.04)',\n        borderRadius: 12,\n        paddingHorizontal: 14,\n        gap: 10,\n        borderWidth: 1,\n        borderColor: 'rgba(0,0,0,0.08)',",
    "backgroundColor: '#FFFFFF',\n        borderRadius: 16,\n        paddingHorizontal: 14,\n        gap: 10,\n        elevation: 4,\n        shadowColor: '#000',\n        shadowOffset: { width: 0, height: 2 },\n        shadowOpacity: 0.05,\n        shadowRadius: 8,\n        borderWidth: 0,"
)

# Action Cards
text = text.replace(
    "actionCardWrap: {\n        flex: 1,\n        borderRadius: 16,\n        overflow: 'hidden',\n    },",
    "actionCardWrap: {\n        flex: 1,\n        borderRadius: 16,\n        overflow: 'hidden',\n        elevation: 6,\n        shadowColor: '#000',\n        shadowOffset: { width: 0, height: 4 },\n        shadowOpacity: 0.15,\n        shadowRadius: 8,\n        backgroundColor: '#FFF',\n    },"
)

# Map Container
text = text.replace(
    "mapContainer: {\n        height: 180,\n        borderRadius: 16,\n        overflow: 'hidden',\n        borderWidth: 1,\n        borderColor: '#E5E7EB',\n        backgroundColor: '#FFFFFF',\n    },",
    "mapContainer: {\n        height: 200,\n        borderRadius: 20,\n        overflow: 'hidden',\n        borderWidth: 4,\n        borderColor: '#FFFFFF',\n        backgroundColor: '#FFFFFF',\n        elevation: 8,\n        shadowColor: '#6366F1',\n        shadowOffset: { width: 0, height: 4 },\n        shadowOpacity: 0.15,\n        shadowRadius: 12,\n    },"
)

# Map Bottom Bar
text = text.replace(
    "mapBottomBar: {\n        position: 'absolute',\n        bottom: 12,\n        left: 12,\n        right: 12,\n        backgroundColor: '#F9FAFB',\n        borderRadius: 12,\n        paddingVertical: 12,\n        paddingHorizontal: 20,\n        flexDirection: 'row',\n        justifyContent: 'space-around',\n        alignItems: 'center',\n        borderWidth: 1,\n        borderColor: '#E5E7EB',\n    },",
    "mapBottomBar: {\n        position: 'absolute',\n        bottom: 12,\n        left: 16,\n        right: 16,\n        backgroundColor: '#FFFFFF',\n        borderRadius: 16,\n        paddingVertical: 12,\n        paddingHorizontal: 20,\n        flexDirection: 'row',\n        justifyContent: 'space-around',\n        alignItems: 'center',\n        elevation: 6,\n        shadowColor: '#000',\n        shadowOffset: { width: 0, height: 4 },\n        shadowOpacity: 0.1,\n        shadowRadius: 8,\n    },"
)

# Stat Pills
text = text.replace(
    "statPill: {\n        flex: 1,\n        backgroundColor: '#FFFFFF',\n        borderRadius: 12,\n        padding: 14,\n        borderWidth: 1,\n        borderColor: '#E5E7EB',\n    },",
    "statPill: {\n        flex: 1,\n        backgroundColor: '#FFFFFF',\n        borderRadius: 16,\n        padding: 16,\n        elevation: 4,\n        shadowColor: '#000',\n        shadowOffset: { width: 0, height: 2 },\n        shadowOpacity: 0.05,\n        shadowRadius: 8,\n        borderWidth: 0,\n    },"
)

# Parcel Cards
text = text.replace(
    "parcelCard: {\n        width: 300,\n        backgroundColor: '#FFFFFF',\n        borderRadius: 16,\n        padding: 16,\n        borderWidth: 1,\n        borderColor: '#E5E7EB',\n    },",
    "parcelCard: {\n        width: 300,\n        backgroundColor: '#FFFFFF',\n        borderRadius: 20,\n        padding: 20,\n        elevation: 6,\n        shadowColor: '#000',\n        shadowOffset: { width: 0, height: 6 },\n        shadowOpacity: 0.06,\n        shadowRadius: 12,\n        borderWidth: 0,\n        marginBottom: 10,\n        marginTop: 5,\n        marginLeft: 4,\n    },"
)
text = text.replace(
    "parcelScrollContainer: {\n        paddingHorizontal: 16,\n        gap: 14,\n        paddingBottom: 4,\n    },",
    "parcelScrollContainer: {\n        paddingHorizontal: 14,\n        gap: 14,\n        paddingBottom: 20,\n        paddingTop: 8,\n    },"
)

# Wallet Card
text = text.replace(
    "walletCard: {\n        backgroundColor: '#FFFFFF',\n        borderRadius: 16,\n        padding: 24,\n        borderWidth: 1,\n        borderColor: '#E5E7EB',\n        overflow: 'hidden',\n    },",
    "walletCard: {\n        backgroundColor: '#FFFFFF',\n        borderRadius: 24,\n        padding: 24,\n        elevation: 8,\n        shadowColor: '#4361EE',\n        shadowOffset: { width: 0, height: 8 },\n        shadowOpacity: 0.15,\n        shadowRadius: 16,\n        borderWidth: 0,\n    },"
)

# Traveler Row
text = text.replace(
    "travelerRow: {\n        flexDirection: 'row',\n        alignItems: 'center',\n        backgroundColor: '#FFFFFF',\n        borderRadius: 16,\n        padding: 14,\n        borderWidth: 1,\n        borderColor: '#E5E7EB',\n        marginBottom: 12,\n        gap: 14,\n    },",
    "travelerRow: {\n        flexDirection: 'row',\n        alignItems: 'center',\n        backgroundColor: '#FFFFFF',\n        borderRadius: 16,\n        padding: 16,\n        elevation: 4,\n        shadowColor: '#000',\n        shadowOffset: { width: 0, height: 3 },\n        shadowOpacity: 0.06,\n        shadowRadius: 8,\n        borderWidth: 0,\n        marginBottom: 14,\n        gap: 14,\n    },"
)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(text)

print("3D styles injected successfully.")

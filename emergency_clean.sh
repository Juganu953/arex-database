#!/bin/bash
echo "🚀 EMERGENCY CLEANUP - Removing large files..."

# 1. Remove ALL node_modules everywhere
echo "Removing node_modules..."
find ~ -type d -name "node_modules" -exec rm -rf {} + 2>/dev/null

# 2. Clear ALL caches
echo "Clearing caches..."
rm -rf ~/.cache/* 2>/dev/null
rm -rf ~/.npm/* 2>/dev/null
rm -rf ~/.config/google-chrome 2>/dev/null
rm -rf ~/.local/share/Trash/* 2>/dev/null

# 3. Remove large log files
echo "Removing logs..."
find ~ -type f -name "*.log" -size +1M -delete 2>/dev/null
find ~ -type f -name "*.gz" -delete 2>/dev/null
find ~ -type f -name "*.tar" -delete 2>/dev/null

# 4. Remove temporary files
echo "Clearing temp files..."
rm -rf /tmp/* 2>/dev/null
rm -rf ~/tmp 2>/dev/null

# 5. Remove the problematic directories
echo "Removing arex directories..."
rm -rf ~/arex-* 2>/dev/null

# 6. Show results
echo "📊 Current space usage:"
df -h ~

echo "✅ Cleanup complete!"

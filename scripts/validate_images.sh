#!/bin/bash

# Script to validate that all story images are under 1MB
STORIES_DIR="/home/botond/ballabotond.com/assets/images/stories"
MAX_SIZE_KB=1024  # 1MB in KB

echo "Checking story image sizes..."
echo "Maximum allowed size: ${MAX_SIZE_KB}KB (1MB)"
echo ""

# Function to get file size in KB
get_file_size_kb() {
    stat -c%s "$1" | awk '{print int($1/1024)}'
}

all_valid=true

for img in "$STORIES_DIR"/*.png; do
    if [ -f "$img" ]; then
        filename=$(basename "$img")
        size_kb=$(get_file_size_kb "$img")
        
        if [ $size_kb -le $MAX_SIZE_KB ]; then
            echo "✓ $filename: ${size_kb}KB"
        else
            echo "✗ $filename: ${size_kb}KB (OVER LIMIT)"
            all_valid=false
        fi
    fi
done

echo ""
if [ "$all_valid" = true ]; then
    echo "✅ All images are under 1MB!"
else
    echo "❌ Some images are over the 1MB limit and need compression."
    echo "Run ./compress_images.sh to fix them."
fi

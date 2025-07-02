#!/bin/bash

# Compress all story images to be under 1MB
STORIES_DIR="/home/botond/ballabotond.com/assets/images/stories"
MAX_SIZE_KB=1024  # 1MB in KB
BACKUP_DIR="/home/botond/ballabotond.com/assets/images/stories_backup"

echo "Compressing all story images to be under 1MB..."

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Function to get file size in KB
get_file_size_kb() {
    stat -c%s "$1" | awk '{print int($1/1024)}'
}

# Process all PNG files in stories directory
for img in "$STORIES_DIR"/*.png; do
    if [ -f "$img" ]; then
        filename=$(basename "$img")
        current_size_kb=$(get_file_size_kb "$img")
        
        echo "Processing $filename (${current_size_kb}KB)..."
        
        # Create backup if it doesn't exist
        if [ ! -f "$BACKUP_DIR/$filename" ]; then
            cp "$img" "$BACKUP_DIR/"
            echo "  📦 Backed up original"
        fi
        
        # If already under 1MB, skip
        if [ $current_size_kb -le $MAX_SIZE_KB ]; then
            echo "  ✅ Already under 1MB"
            continue
        fi
            
            temp_file="${img}.tmp"
            
            # Try progressive resizing with higher compression
            for max_width in 1200 1000 800 700 600 500 400; do
                for quality in 80 70 60 50 40; do
                    convert "$img" \
                        -resize "${max_width}x${max_width}>" \
                        -strip \
                        -interlace Plane \
                        -sampling-factor 4:2:0 \
                        -quality $quality \
                        "$temp_file" 2>/dev/null
                    
                    if [ $? -eq 0 ]; then
                        temp_size_kb=$(get_file_size_kb "$temp_file")
                        if [ $temp_size_kb -le $MAX_SIZE_KB ]; then
                            mv "$temp_file" "$img"
                            echo "  ✓ Compressed to ${temp_size_kb}KB (${max_width}px, quality: $quality)"
                            break 2
                        fi
                    fi
                done
            done
            
            # Clean up temp file
            [ -f "$temp_file" ] && rm "$temp_file"
            
            # Final check
            final_size_kb=$(get_file_size_kb "$img")
            if [ $final_size_kb -gt $MAX_SIZE_KB ]; then
                echo "  ⚠ Warning: $filename is still ${final_size_kb}KB"
            fi
        else
            echo "$filename is already under 1MB (${current_size_kb}KB)"
        fi
    fi
done

echo ""
echo "Compression complete!"
echo "Original images backed up to: $BACKUP_DIR"
echo ""
echo "All image sizes:"
ls -lh "$STORIES_DIR"/*.png | awk '{print $9, $5}' | sort

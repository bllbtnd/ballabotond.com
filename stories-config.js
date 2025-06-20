// Stories configuration
// Add new story filenames here in any order - they will be automatically sorted newest to oldest
// Format: yyyy-mm-dd-n.ext (where n is the image number for that day)

const STORY_FILENAMES_RAW = [
    '2025-06-20-1.svg',
    '2025-06-20-0.svg',
    '2025-06-19-0.svg'
    // Add new story filenames anywhere in this array
];

// Automatically sort stories from newest to oldest based on filename
const STORY_FILENAMES = STORY_FILENAMES_RAW.sort((a, b) => {
    // Extract date and image number from filename (yyyy-mm-dd-n)
    const parseFilename = (filename) => {
        const match = filename.match(/(\d{4})-(\d{2})-(\d{2})-(\d+)/);
        if (match) {
            const [, year, month, day, imageNum] = match;
            const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            return {
                date: date,
                imageNum: parseInt(imageNum),
                timestamp: date.getTime()
            };
        }
        return { date: new Date(0), imageNum: 0, timestamp: 0 };
    };
    
    const aInfo = parseFilename(a);
    const bInfo = parseFilename(b);
    
    // First sort by date (newest first)
    if (bInfo.timestamp !== aInfo.timestamp) {
        return bInfo.timestamp - aInfo.timestamp;
    }
    
    // If same date, sort by image number (highest first)
    return bInfo.imageNum - aInfo.imageNum;
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = STORY_FILENAMES;
}

// Make available globally for browser
window.STORY_FILENAMES = STORY_FILENAMES;

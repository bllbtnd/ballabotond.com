// Stories configuration
// Add new story filenames here in any order - they will be automatically sorted newest to oldest
// Format: yyyy-mm-dd-n.ext (where n is the image number for that day)

const STORY_FILENAMES_RAW = [
    '2024-03-23-0.png',
    '2024-04-13-0.png',
    '2024-03-01-0.png',
    '2025-06-18-0.png',
    '2025-06-14-0.png',
    '2023-05-24-0.png',
    '2023-06-22-0.png',
    '2023-10-14-0.png',
    '2024-03-29-0.png'
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

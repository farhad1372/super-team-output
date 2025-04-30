// BubbleMaps.io configuration
export const BubbleMapsConfig = {
    baseUrl: process.env.BASE_URL || 'https://bubblemaps.io',
    coinPath: '/coin/',
    screenshotTimeout: 10000, // Timeout for waiting for image load (ms)
    viewport: {
        width: 1280,
        height: 720,
    },
};

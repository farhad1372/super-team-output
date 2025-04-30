export class QuickChart {
    constructor(tokenData) {
        this.generate24hChart = () => {
            const high24h = this.tokenData.market_data.high_24h.usd;
            const low24h = this.tokenData.market_data.low_24h.usd;
            const currentPrice = this.tokenData.market_data.current_price.usd;
            const name = this.tokenData.name;
            const symbol = this.tokenData.symbol;
            // Simulate 24h price data (since we don't have full history)
            const points = Array.from({ length: 20 }, (_, i) => {
                const t = i / 19;
                return low24h + (high24h - low24h) * t + (Math.random() - 0.5) * (high24h - low24h) * 0.1;
            });
            points[points.length - 1] = currentPrice; // Ensure last point is current price
            const chartConfig = {
                type: 'line',
                data: {
                    labels: Array.from({ length: 20 }, (_, i) => `${Math.round((i / 19) * 24)}h`),
                    datasets: [{
                            label: 'Price (USD)',
                            data: points,
                            fill: false,
                            borderColor: '#007bff',
                        }],
                },
                options: {
                    title: { display: true, text: `${name} (${symbol.toUpperCase()}) 24h Price Chart` },
                    scales: {
                        x: { title: { display: true, text: 'Hours' } },
                        y: { title: { display: true, text: 'Price (USD)' } },
                    },
                },
            };
            return {
                chart_url: `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}`,
                caption: `📊 <b>${name} (${symbol.toUpperCase()}) 24h Price Chart</b>\n Changes in ${symbol.toUpperCase()} price over the last 24 hours`,
            };
        };
        this.tokenData = tokenData;
    }
}

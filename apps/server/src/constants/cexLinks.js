// CEX (Centralized Exchange) earn page links
// These are click-through links only - no APY aggregation for CEX platforms

export const CEFI_ASSETS = ['USDC', 'USDT', 'USDE', 'DAI'];

export const CEX_EXCHANGES = {
  binance: {
    name: 'Binance',
    earnUrl: (asset) => `https://www.binance.com/en/earn?asset=${encodeURIComponent(asset)}`,
  },
  okx: {
    name: 'OKX',
    earnUrl: () => 'https://www.okx.com/earn',
  },
  bybit: {
    name: 'Bybit',
    earnUrl: () => 'https://www.bybit.com/en/earn/',
  },
};

function cefiUrl(exchange, asset) {
  const a = String(asset).toUpperCase();
  const config = CEX_EXCHANGES[exchange];
  return config ? config.earnUrl(a) : null;
}

export function getCexLinks() {
  const rows = [];
  for (const asset of CEFI_ASSETS) {
    for (const [exchangeKey, config] of Object.entries(CEX_EXCHANGES)) {
      rows.push({
        exchange: config.name,
        exchangeKey,
        asset,
        url: cefiUrl(exchangeKey, asset),
      });
    }
  }
  return rows;
}

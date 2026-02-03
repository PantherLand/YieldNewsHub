const CEFI_ASSETS = ['USDT', 'USDC', 'DAI', 'FDUSD', 'PYUSD', 'FRAX', 'USDE', 'USDY', 'USDS'];

function cefiUrl(exchange, asset) {
  const a = String(asset).toUpperCase();
  if (exchange === 'binance') {
    return `https://www.binance.com/en/earn?asset=${encodeURIComponent(a)}`;
  }
  if (exchange === 'okx') {
    return `https://www.okx.com/earn`;
  }
  if (exchange === 'bybit') {
    return `https://www.bybit.com/en/earn/`;
  }
  return null;
}

export function getCexLinks() {
  const rows = [];
  for (const asset of CEFI_ASSETS) {
    rows.push({ exchange: 'Binance', exchangeKey: 'binance', asset, url: cefiUrl('binance', asset) });
    rows.push({ exchange: 'OKX', exchangeKey: 'okx', asset, url: cefiUrl('okx', asset) });
    rows.push({ exchange: 'Bybit', exchangeKey: 'bybit', asset, url: cefiUrl('bybit', asset) });
  }
  return rows;
}

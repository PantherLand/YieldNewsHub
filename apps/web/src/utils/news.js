export function buildNewsSignature(items = []) {
  return (items || [])
    .slice(0, 20)
    .map((item) => `${item.id || item.url || ''}|${item.publishedAt || ''}|${item.score || ''}`)
    .join('||');
}

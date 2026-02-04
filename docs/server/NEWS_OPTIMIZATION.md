# 新闻源优化说明

## ✅ 已完成的优化

### 1. 新增高质量新闻源

**之前（5个源）：**
- Federal Reserve
- U.S. Treasury
- SEC
- Binance
- CoinDesk

**现在（11个源）：**

#### 宏观/监管（低频，高影响）
- Federal Reserve
- U.S. Treasury
- SEC

#### 加密新闻（高频更新）
- CoinDesk
- CoinTelegraph
- Decrypt
- The Block

#### DeFi 专项
- DeFi Llama Blog

#### 协议官方博客
- Aave Blog
- Curve Finance Blog

#### CEX 公告
- Binance Announcements

### 2. 扩展关键词检测

新增关键词类别：
- **DeFi 协议**：aave, compound, curve, uniswap, maker, liquidity, tvl
- **监管**：cftc, regulation, compliance, approval, ban
- **风险事件**：vulnerability, breach, attack, rug pull, scam
- **市场事件**：crash, rally, surge, volatility, liquidity crisis
- **稳定币**：usde, peg (新增)

### 3. 改进日志和监控

**新增详细日志：**
```
[news] Polling 11 news sources...
[news] ✓ CoinDesk: 15 new, 3 updated
[news] ✓ CoinTelegraph: 8 new, 1 updated
[news] ✗ Aave Blog: Failed to fetch
[news] Poll complete: 10/11 sources OK, 45 new items, 5 updated
```

**返回统计信息：**
- `sourcesProcessed` - 成功处理的源数量
- `sourcesFailed` - 失败的源数量
- `totalNew` - 新增条目数
- `totalUpdated` - 更新条目数

### 4. 新增手动触发接口

#### 手动抓取新闻
```bash
POST /api/jobs/news
```

返回：
```json
{
  "success": true,
  "data": {
    "message": "News polling completed",
    "sourcesProcessed": 10,
    "sourcesFailed": 1,
    "totalNew": 45,
    "totalUpdated": 5
  }
}
```

#### 手动抓取 APY
```bash
POST /api/jobs/apy
```

## 🎯 效果预期

### 新闻更新频率
| 新闻源 | 更新频率 | 预计新条目/天 |
|--------|---------|--------------|
| CoinDesk, CoinTelegraph, Decrypt, The Block | 每小时多条 | 100-200 |
| DeFi Llama | 每周几条 | 1-2 |
| Aave, Curve | 每月几条 | 0.5-1 |
| Fed, Treasury, SEC | 不定期 | 0-5 |
| Binance | 每天多条 | 10-20 |

**总计：**预计每天 **100-250** 条新闻（过滤后约 **20-50** 条高分新闻）

### 新闻质量
- ✅ 覆盖宏观、监管、DeFi、市场动态
- ✅ 关键词匹配更准确
- ✅ 重要新闻（score >= 6）实时推送

## 🚀 使用方法

### 1. 重启服务器
```bash
cd apps/server
npm run dev
```

服务器会自动：
- 启动时立即抓取一次新闻
- 每 5 分钟定时抓取（可配置 `NEWS_POLL_CRON`）

### 2. 手动触发抓取（测试）
```bash
# 抓取新闻
curl -X POST http://localhost:8787/api/jobs/news

# 抓取 APY
curl -X POST http://localhost:8787/api/jobs/apy
```

### 3. 查看新闻
```bash
# 获取所有新闻（默认 minScore=0）
curl http://localhost:8787/api/news?limit=50

# 只获取高分新闻
curl http://localhost:8787/api/news?minScore=6&limit=20

# 按关键词搜索
curl http://localhost:8787/api/news?q=aave&limit=10
```

## 📊 监控建议

### 检查新闻抓取状态
查看服务器日志：
```bash
# 查看最近的新闻抓取日志
tail -f logs/server.log | grep '\[news\]'
```

应该看到类似：
```
[news] Polling 11 news sources...
[news] ✓ CoinDesk: 15 new, 3 updated
[news] Poll complete: 10/11 sources OK, 45 new items, 5 updated
```

### 检查数据库
```bash
# 查询新闻总数
SELECT COUNT(*) FROM "NewsItem";

# 查询最近 24 小时的新闻
SELECT COUNT(*) FROM "NewsItem"
WHERE "createdAt" > NOW() - INTERVAL '24 hours';

# 查询各源的新闻数量
SELECT s.name, COUNT(n.id) as count
FROM "NewsSource" s
LEFT JOIN "NewsItem" n ON n."sourceId" = s.id
GROUP BY s.name
ORDER BY count DESC;
```

## 🔧 配置选项

### 调整抓取频率
在 `.env` 文件中：
```bash
# 每 10 分钟抓取一次（默认 5 分钟）
NEWS_POLL_CRON="*/10 * * * *"

# 每 2 分钟抓取一次（高频）
NEWS_POLL_CRON="*/2 * * * *"
```

### 添加更多新闻源
编辑 `src/sources.js`：
```javascript
{
  name: 'Your News Source',
  kind: 'RSS',
  url: 'https://example.com/rss',
}
```

### 调整关键词权重
编辑 `src/jobs/news.js` 的 `scoreItem` 函数。

## 🐛 故障排查

### 新闻数量为 0
1. 检查数据库是否有新闻源：
   ```sql
   SELECT * FROM "NewsSource";
   ```

2. 手动触发抓取：
   ```bash
   curl -X POST http://localhost:8787/api/jobs/news
   ```

3. 查看日志是否有错误

### 某些源一直失败
- RSS URL 可能失效，尝试在浏览器中打开
- 某些源可能需要代理或特定 User-Agent
- 暂时禁用该源：
  ```sql
  UPDATE "NewsSource" SET enabled = false WHERE name = 'Source Name';
  ```

## 📝 下一步优化建议

1. **去重**：相同新闻可能出现在多个源
2. **摘要生成**：使用 AI 生成更好的摘要
3. **分类**：自动分类（监管/DeFi/市场等）
4. **情绪分析**：分析新闻情绪（看涨/看跌）
5. **相关性评分**：基于用户关注的协议/资产调整评分

## ✨ 总结

✅ 新闻源数量：5 → 11
✅ 关键词数量：24 → 55
✅ 预计每日新闻：10-20 → 100-250
✅ 高质量新闻：5-10 → 20-50
✅ 新增手动触发接口
✅ 详细日志和监控

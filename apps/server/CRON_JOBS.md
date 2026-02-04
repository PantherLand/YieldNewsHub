# 定时任务配置说明

## 概览

YieldNewsHub 后台运行三个主要定时任务：

1. **新闻抓取任务** - 自动抓取中英文新闻
2. **APY数据更新任务** - 更新收益率数据
3. **缓存刷新任务** - 刷新策略缓存

## 新闻抓取任务（中英文）

### 默认配置

```bash
# 默认：每 5 分钟抓取一次
NEWS_POLL_CRON="*/5 * * * *"
```

### 工作流程

1. **启动时立即执行一次**
   - 服务器启动后立即抓取所有新闻源
   - 包括所有中英文新闻源

2. **定时自动执行**
   - 每5分钟自动运行一次
   - 抓取所有启用的新闻源：
     - 英文源：11个（Federal Reserve, SEC, CoinDesk, CoinTelegraph等）
     - 中文源：2个（律动BlockBeats, 區塊客 Blockcast）

3. **日志输出**
   ```
   [news] Polling 13 news sources...
   [news] ✓ CoinDesk: 5 new, 2 updated
   [news] ✓ 律动BlockBeats: 15 new, 3 updated
   [news] ✓ 區塊客 Blockcast: 8 new, 1 updated
   [news] Poll complete: 13/13 sources OK, 45 new items, 8 updated
   ```

### 抓取的新闻源列表

**英文新闻源（11个）：**
- Federal Reserve (Press Releases)
- U.S. Treasury (Press Releases)
- SEC (Press Releases)
- Binance Announcements
- CoinDesk
- CoinTelegraph
- Decrypt
- The Block
- DeFi Llama Blog
- Aave Blog
- Curve Finance Blog

**中文新闻源（2个）：**
- 律动BlockBeats（简体中文，实时快讯）
- 區塊客 Blockcast（繁体中文，深度分析）

### 手动触发

如果需要立即抓取最新新闻：

```bash
# 方式1：通过API手动触发
curl -X POST http://localhost:8787/api/jobs/news

# 方式2：重启服务器（会立即执行一次）
npm run dev
```

## APY 数据更新任务

### 默认配置

```bash
# 默认：每小时更新一次
APY_POLL_CRON="0 * * * *"
```

### 工作流程

1. 从 DeFiLlama 获取最新收益率数据
2. 更新数据库中的 APY 机会
3. 自动触发策略缓存刷新

## 缓存刷新任务

### 默认配置

```bash
# 默认：每小时刷新一次
CACHE_REFRESH_CRON="0 * * * *"
```

### 工作流程

刷新所有策略的缓存，确保前端获取的数据是最新的。

## 自定义配置

### 修改抓取频率

编辑 `.env` 文件：

```bash
# 每2分钟抓取一次新闻（高频）
NEWS_POLL_CRON="*/2 * * * *"

# 每10分钟抓取一次新闻（低频）
NEWS_POLL_CRON="*/10 * * * *"

# 每30分钟抓取一次新闻（节省资源）
NEWS_POLL_CRON="*/30 * * * *"
```

### Cron 语法说明

```
┌───────────── 分钟 (0 - 59)
│ ┌───────────── 小时 (0 - 23)
│ │ ┌───────────── 日期 (1 - 31)
│ │ │ ┌───────────── 月份 (1 - 12)
│ │ │ │ ┌───────────── 星期 (0 - 7) (0和7都是周日)
│ │ │ │ │
* * * * *
```

**常用示例：**
- `*/5 * * * *` - 每5分钟
- `0 * * * *` - 每小时
- `0 0 * * *` - 每天午夜
- `0 */2 * * *` - 每2小时
- `0 9-17 * * 1-5` - 工作日的9点到17点，每小时

## 监控和调试

### 查看日志

服务器运行时会输出详细日志：

```bash
# 查看所有日志
npm run dev

# 只查看新闻相关日志（如果有日志文件）
tail -f logs/server.log | grep '\[news\]'
```

### 检查任务状态

```bash
# 检查最近的新闻
curl "http://localhost:8787/api/news?limit=10"

# 检查中文新闻
curl "http://localhost:8787/api/news?language=zh&limit=10"

# 检查英文新闻
curl "http://localhost:8787/api/news?language=en&limit=10"
```

### 数据库查询

```sql
-- 查询新闻源统计
SELECT
  s.name,
  COUNT(n.id) as news_count,
  MAX(n.publishedAt) as latest_news
FROM "NewsSource" s
LEFT JOIN "NewsItem" n ON n."sourceId" = s.id
GROUP BY s.id, s.name
ORDER BY news_count DESC;

-- 查询最近24小时的新闻数量
SELECT COUNT(*)
FROM "NewsItem"
WHERE "createdAt" > NOW() - INTERVAL '24 hours';

-- 查询中文新闻数量
SELECT COUNT(*)
FROM "NewsItem" n
JOIN "NewsSource" s ON n."sourceId" = s.id
WHERE s.name IN ('律动BlockBeats', '區塊客 Blockcast');
```

## 故障排查

### 问题：新闻没有更新

**检查步骤：**

1. 确认服务器正在运行
   ```bash
   lsof -i :8787
   ```

2. 手动触发抓取测试
   ```bash
   curl -X POST http://localhost:8787/api/jobs/news
   ```

3. 检查数据库连接
   ```bash
   cd apps/server
   npx prisma studio
   ```

4. 查看错误日志
   - 检查服务器终端输出
   - 查找 `[news] ✗` 标记的失败源

### 问题：某些源一直失败

**可能原因：**
- RSS URL 失效或变更
- 网络问题或被墙
- 需要特定的 User-Agent

**解决方法：**

1. 手动测试RSS源
   ```bash
   curl -L "https://api.theblockbeats.news/v2/rss/all"
   ```

2. 临时禁用问题源
   ```sql
   UPDATE "NewsSource"
   SET enabled = false
   WHERE name = '源名称';
   ```

3. 更新RSS URL（如果源更换了地址）

### 问题：中文新闻显示乱码

**检查：**
- 数据库字符集是否为 UTF-8
- 浏览器编码设置
- API响应头的 Content-Type

## 性能优化建议

### 1. 调整抓取频率

根据服务器负载和需求调整：

- **高频场景**（实时新闻）：`*/2 * * * *` (每2分钟)
- **标准场景**（默认）：`*/5 * * * *` (每5分钟)
- **低频场景**（节省资源）：`*/15 * * * *` (每15分钟)

### 2. 数据库优化

```sql
-- 定期清理旧新闻（保留最近30天）
DELETE FROM "NewsItem"
WHERE "publishedAt" < NOW() - INTERVAL '30 days';

-- 创建索引（如果还没有）
CREATE INDEX IF NOT EXISTS idx_news_published
ON "NewsItem"("publishedAt" DESC);

CREATE INDEX IF NOT EXISTS idx_news_source
ON "NewsItem"("sourceId");
```

### 3. 分时段抓取

如果某些源更新频率较低，可以配置不同的抓取策略：

```javascript
// 示例：可以在代码中实现基于源类型的分时段抓取
// 高频源（CoinDesk, 律动BlockBeats）：每5分钟
// 中频源（DeFi Llama）：每30分钟
// 低频源（Fed, SEC）：每小时
```

## 总结

✅ 新闻抓取任务每5分钟自动运行
✅ 自动抓取13个新闻源（11英文 + 2中文）
✅ 启动时立即执行一次
✅ 支持手动触发
✅ 完整的日志和监控
✅ 可通过环境变量自定义频率

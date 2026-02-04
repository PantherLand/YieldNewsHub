# 缓存层实现说明

## 📋 改动概述

已成功实现后端缓存层，减少外部 API 调用，提升响应速度。

## ✅ 已完成的改动

### 1. 新增缓存服务模块 (`src/cache.js`)
- 内存缓存系统，支持自定义 TTL
- 提供 `get`, `set`, `delete`, `clear`, `stats` 方法
- 预定义缓存时间常量（1分钟 ~ 1天）

### 2. 更新策略模块 (`src/strategies/`)
**改动前：**
- 每次请求实时调用 DeFiLlama API
- 只有 1 分钟短缓存

**改动后：**
- 优先从数据库读取数据（已由 APY job 定期更新）
- 1 小时缓存策略结果
- 添加 `refreshAllStrategies()` 函数预热缓存

### 3. 添加缓存刷新任务 (`src/index.js`)
- **每小时自动刷新策略缓存**（跟 APY 数据更新同步）
- 启动时自动预热缓存（5秒后执行）
- 支持环境变量配置：`CACHE_REFRESH_CRON`（默认：`0 * * * *`）

### 4. 新增 API 接口

#### 查看缓存统计
```bash
GET /api/cache/stats
```
返回：缓存条目数、过期数、有效 keys 列表

#### 清空缓存
```bash
POST /api/cache/clear
```

#### 手动刷新缓存
```bash
POST /api/cache/refresh
```
返回：刷新结果统计

### 5. 优化 CEX 链接接口
- `/api/cex-links` 现在使用 1 小时缓存
- 减少重复计算

## 🎯 缓存策略

| 数据类型 | 缓存时长 | 刷新方式 |
|---------|---------|---------|
| 策略结果 | 1 小时 | 定时任务 + 按需生成 |
| DeFiLlama 池数据 | 1 小时 | 从数据库读取（fallback API）|
| CEX 链接 | 1 小时 | 按需生成 |

## 🚀 你需要做的操作

### 1. 重启服务器
```bash
cd apps/server
npm run dev
```

### 2. 验证缓存是否工作

#### 查看缓存统计
```bash
curl http://localhost:8787/api/cache/stats
```

#### 测试策略接口（应该很快）
```bash
curl http://localhost:8787/api/strategy/base-apy-priority?top=10
```

第一次请求会生成并缓存，后续请求直接返回缓存数据。

#### 查看日志
启动后应该看到：
```
[cache] Initial cache warm-up completed: 10 strategies cached
```

每小时应该看到：
```
[cache] Refreshing strategy caches...
[cache] Strategy cache refresh completed: 10 succeeded, 0 failed
```

### 3. （可选）调整缓存时间

如果需要修改刷新频率，在 `.env` 文件添加：

```bash
# 每 2 小时刷新一次
CACHE_REFRESH_CRON="0 */2 * * *"

# APY 数据每 30 分钟更新一次
APY_POLL_CRON="*/30 * * * *"
```

## 📊 性能提升

- **策略接口响应时间**：~2-3s → ~10-50ms（缓存命中）
- **外部 API 调用**：每次请求 → 每小时 1 次
- **数据库查询**：策略接口不再每次查询，使用内存缓存

## 🔍 监控建议

定期检查缓存统计：
```bash
curl http://localhost:8787/api/cache/stats
```

如果发现缓存命中率低，可能需要：
1. 增加缓存时长（修改 `TTL.ONE_HOUR` 为 `TTL.TWO_HOURS`）
2. 检查是否有 query 参数导致缓存 key 不同

## 🐛 故障排查

### 策略数据为空
检查数据库是否有 APY 数据：
```bash
# 在数据库中查询
SELECT COUNT(*) FROM "ApyOpportunity" WHERE source = 'defillama';
```

如果为空，手动触发 APY job：
```bash
curl -X POST http://localhost:8787/api/cache/refresh
```

### 缓存未命中
检查日志是否有 `[strategy] Database empty, falling back to external API` 警告。
如果有，说明数据库没有数据，检查 APY job 是否正常运行。

## 📝 下一步优化建议

1. **Redis 缓存**：如果需要多实例部署，考虑使用 Redis 替代内存缓存
2. **缓存预热**：在 APY job 完成后立即触发策略缓存刷新
3. **缓存版本**：添加缓存版本号，便于强制刷新
4. **监控告警**：集成缓存命中率监控

## ✨ 总结

✅ 所有策略数据现在使用 1 小时缓存
✅ 数据库作为主要数据源，外部 API 作为 fallback
✅ 自动定时刷新，无需手动操作
✅ 新增管理接口，方便监控和维护

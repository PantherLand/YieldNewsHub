# YieldNewsHub Server API 文档

基于当前实现（`apps/server/src/index.js`）整理，默认本地地址：

- Base URL: `http://localhost:8787`
- Content-Type: `application/json`
- 鉴权：当前版本无需鉴权

## 统一响应格式

### 成功响应

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

说明：
- `meta` 仅分页接口返回，字段为：`total`、`limit`、`offset`、`hasMore`

### 错误响应

```json
{
  "success": false,
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "xxx",
    "field": "xxx"
  }
}
```

常见 `error.code`：
- `INVALID_PARAMETER`
- `VALIDATION_ERROR`
- `NOT_FOUND`
- `INTERNAL_ERROR`
- `UNAUTHORIZED`
- `RATE_LIMITED`

---

## 1) 健康检查

### GET `/healthz`

响应示例：

```json
{
  "success": true,
  "data": { "ok": true }
}
```

---

## 2) 新闻列表

### GET `/api/news`

查询参数：
- `limit`：分页大小，默认 `50`，最大 `200`
- `offset`：分页偏移，默认 `0`
- `minScore`：最低分数，默认 `0`
- `source`：按来源名过滤，逗号分隔（如 `CoinDesk,The Block`）
- `tags`：按标签过滤（命中任意一个），逗号分隔
- `q`：标题模糊搜索（不区分大小写）

请求示例：

```bash
curl "http://localhost:8787/api/news?limit=20&offset=0&minScore=10&tags=hack,exploit&q=solana"
```

响应 `data.items[]` 字段：
- `id`
- `sourceId`
- `title`
- `url`（唯一）
- `publishedAt`
- `summary`
- `tags`（字符串数组）
- `score`
- `createdAt`
- `source`（内嵌来源对象：`id,name,kind,url,enabled,createdAt,updatedAt`）

---

## 3) APY 机会列表

### GET `/api/apy`

查询参数：
- 分页：
  - `limit`：默认 `50`，最大 `200`
  - `offset`：默认 `0`
- 基础过滤（均支持逗号分隔，且不区分大小写）：
  - `chain`
  - `provider`
  - `symbol`
  - `source`（例如：`defillama,cefi`）
- 搜索：
  - `q`：在 `provider/symbol/chain` 中模糊匹配
- 数值范围：
  - `minApy` / `maxApy`
  - `minTvl` / `maxTvl`
- 智能筛选：
  - `pureStableOnly`：`true/false`（也接受 `1/0/yes/no`）
  - `recommendedOnly`：`true/false`（仅推荐纯 `USDC/USDT/USDE/DAI`）
  - `riskLevel`：`low,medium,high`（可多值）
  - `minQuality`：`0~100`
- 排序：
  - `sortBy`：`quality`(默认)、`risk`、`apy`、`tvl`、`provider`、`updatedAt`
  - `sortOrder`：`asc` 或 `desc`（默认 `desc`）

请求示例：

```bash
curl "http://localhost:8787/api/apy?chain=Ethereum,Base&pureStableOnly=true&recommendedOnly=true&minApy=3&maxApy=15&sortBy=quality&sortOrder=desc&limit=20"
```

响应 `data.items[]` 字段（数据库原始字段 + 增强字段）：

数据库字段：
- `id, provider, chain, symbol, assetKind, apy, tvlUsd, url, riskNote, source, externalId, updatedAt, createdAt`

增强字段：
- 平台信息：`platformKey, platformName, logoKey, logoUrl, platformUrl`
- 链信息：`chainName, chainLogoKey, chainLogoUrl, chainColor`
- 风险/质量：`pureStable, pureDirectStable, stableRatio, directStableRatio, riskScore, riskLevel, qualityScore, recommended, tokenParts`

说明：
- `recommended=true` 仅表示该条目满足“纯直接稳定币”（`USDC/USDT/USDE/DAI`）与风控质量阈值。

---

## 4) 策略推荐（Strategy）- 5 个 API

说明：
- 这 5 个接口都直接拉取 DeFiLlama `https://yields.llama.fi/pools`，并只保留 `USDC/USDT/USDE/DAI` 的直接稳定币池。
- 通用参数：`top`（可选，默认 `10`，范围 `1~30`）。
- 通用响应字段：
  - `data.category`：固定 `strategy`
  - `data.strategy`：`id,name,description`
  - `data.generatedAt`：生成时间
  - `data.items[]`：`symbol,chain,project,apy,apyBase,apyReward,tvlUsd,pool,url,stablecoin,exposure,ilRisk,trustedProtocol,pureDirectStable,score`

接口列表：
- `GET /api/strategy/base-apy-priority`
- `GET /api/strategy/conservative-core`
- `GET /api/strategy/liquidity-bluechip`
- `GET /api/strategy/reward-balanced`
- `GET /api/strategy/opportunistic-guarded`

请求示例：

```bash
curl "http://localhost:8787/api/strategy/base-apy-priority?top=10"
```

---

## 5) 数据源列表

### GET `/api/sources`

说明：返回新闻源和 APY 源。

请求示例：

```bash
curl "http://localhost:8787/api/sources"
```

响应结构：
- `data.news[]`：`id,name,kind,url,enabled,createdAt,updatedAt`
- `data.apy[]`：`id,name,url,enabled,createdAt,updatedAt`

---

## 6) CEX 跳转链接

### GET `/api/cex-links`

说明：返回 CEX 理财入口链接（不含 APY 聚合），资产固定为 `USDC/USDT/USDE/DAI`。

请求示例：

```bash
curl "http://localhost:8787/api/cex-links"
```

响应 `data.items[]` 字段：
- `exchange`（如 `Binance`）
- `exchangeKey`（如 `binance`）
- `asset`（如 `USDT`）
- `url`

---

## 7) Telegram 集成配置

### POST `/api/integrations/telegram`

请求体：

```json
{
  "enabled": true,
  "botToken": "123456:ABCDEF",
  "chatId": "-1001234567890"
}
```

校验规则：
- `enabled` 必须是布尔值
- `botToken` 必须是非空字符串
- `chatId` 必须是非空字符串

请求示例：

```bash
curl -X POST "http://localhost:8787/api/integrations/telegram" \
  -H "Content-Type: application/json" \
  -d '{"enabled":true,"botToken":"123456:ABCDEF","chatId":"-1001234567890"}'
```

响应：

```json
{
  "success": true,
  "data": {
    "integration": {
      "id": "xxx",
      "enabled": true,
      "chatId": "-1001234567890"
    }
  }
}
```

---

## 8) Telegram 测试消息

### POST `/api/integrations/telegram/test`

说明：发送固定测试消息 `YieldNewsHub test message`。

请求示例：

```bash
curl -X POST "http://localhost:8787/api/integrations/telegram/test"
```

成功响应：

```json
{
  "success": true,
  "data": {
    "message": "Test message sent successfully"
  }
}
```

失败时通常返回：
- `500 INTERNAL_ERROR`（例如未配置 Telegram 或 Telegram API 调用失败）

---

## 分页返回示例

```json
{
  "success": true,
  "data": { "items": [] },
  "meta": {
    "total": 135,
    "limit": 20,
    "offset": 40,
    "hasMore": true
  }
}
```

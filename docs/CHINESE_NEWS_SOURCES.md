# 中文加密货币新闻源调研报告

## ✅ 推荐使用的中文新闻源

### 1. 律动BlockBeats（强烈推荐）⭐⭐⭐⭐⭐

**基本信息：**
- 官网：https://www.theblockbeats.info
- RSS URL：`https://api.theblockbeats.news/v2/rss/all`
- 语言：简体中文
- GitHub：https://github.com/BlockBeatsOfficial/RSS-v2

**RSS 订阅链接：**
```javascript
// 全部内容（推荐）
https://api.theblockbeats.news/v2/rss/all

// 仅快讯
https://api.theblockbeats.news/v2/rss/newsflash

// 仅文章
https://api.theblockbeats.news/v2/rss/article
```

**优点：**
- ✅ RSS格式完全标准，兼容性好
- ✅ 更新频率高（实时快讯 + 深度文章）
- ✅ 内容质量高，涵盖市场、DeFi、监管等
- ✅ 官方维护的RSS服务，稳定可靠
- ✅ 简体中文，适合大陆用户

**内容示例：**
```
· 比特币充币情绪延续，过去24小时CEX净流入4,069.98枚BTC
· 比特币8分钟反弹1.57%，回升突破7.5万美元
· Arthur Hayes抛售DeFi代币买入HYPE
· Vitalik提议将预测市场与DAO引入创作者代币生态
```

**测试结果：** ✅ 通过 - RSS正常工作，实时更新


---

### 2. 區塊客 Blockcast（推荐）⭐⭐⭐⭐

**基本信息：**
- 官网：https://blockcast.it
- RSS URL：`https://blockcast.it/feed/`
- 语言：繁体中文（zh-TW）
- 成立时间：2017年4月

**优点：**
- ✅ RSS格式标准
- ✅ 深度文章为主，分析质量高
- ✅ 内容全面，涵盖市场、技术、政策
- ✅ 繁体中文，适合港澳台用户

**内容示例：**
```
· 比特幣跌破 6.5 萬美元機率超過 70%，市場在擔心什麼？
· 基金會瘦身禦寒、L2 重新定位，Vitalik 的以太坊「重生劇本」
```

**测试结果：** ✅ 通过 - RSS正常工作

**注意：** 繁体中文，如需简体可考虑在前端做繁简转换。


---

### 3. 金色财经（通过 RSSHub）⭐⭐⭐

**基本信息：**
- 官网：https://www.jinse.cn
- RSS URL：通过 RSSHub 获取
- 语言：简体中文

**RSSHub 路由：**
```javascript
// 快讯（推荐）
https://rsshub.app/jinse/lives

// 分类新闻
https://rsshub.app/jinse/zhengce  // 政策
https://rsshub.app/jinse/timeline  // 时间线新闻
```

**优点：**
- ✅ 内容更新频率极高（7x24小时滚动）
- ✅ 国内知名度高
- ✅ 简体中文

**缺点：**
- ❌ 官方不提供RSS，需通过第三方RSSHub
- ❌ RSSHub官方建议仅用于测试，生产环境需自建
- ⚠️ 测试时RSSHub有访问限制提示

**测试结果：** ⚠️ 有限制 - 需要自建RSSHub服务器

**自建方案：**
如需使用，需部署自己的RSSHub实例：
- 官方文档：https://docs.rsshub.app/deploy/


---

### 4. PANews ⭐⭐⭐

**基本信息：**
- 官网：https://www.panewslab.com
- RSS页面：https://www.panewslab.com/en/rss
- 语言：中英双语

**状态：**
- ⚠️ 访问RSS链接返回HTML页面而非XML
- 可能需要从RSS页面手动复制订阅链接
- 建议直接访问 https://www.panewslab.com/en/rss 获取最新链接

**优点：**
- ✅ 国际视野的前沿资讯
- ✅ 创始人为福布斯亚洲30 under 30获奖者
- ✅ 深度研报质量高

**测试结果：** ⚠️ 需要进一步确认RSS订阅地址


---

## 📊 综合对比

| 新闻源 | 语言 | 更新频率 | RSS可用性 | 推荐度 |
|--------|------|---------|-----------|--------|
| 律动BlockBeats | 简体中文 | ⭐⭐⭐⭐⭐ | ✅ 完全可用 | ⭐⭐⭐⭐⭐ |
| 區塊客 Blockcast | 繁体中文 | ⭐⭐⭐⭐ | ✅ 完全可用 | ⭐⭐⭐⭐ |
| 金色财经 | 简体中文 | ⭐⭐⭐⭐⭐ | ⚠️ 需自建RSSHub | ⭐⭐⭐ |
| PANews | 中英双语 | ⭐⭐⭐⭐ | ⚠️ 待确认 | ⭐⭐⭐ |


---

## 🚀 推荐实施方案

### 方案一：仅添加律动BlockBeats（最简单）

**优点：**
- 开箱即用，无需额外配置
- 简体中文，覆盖大部分中文用户需求
- 更新频率高，内容质量好

**修改文件：** `apps/server/src/sources.js`

```javascript
// 取消注释或添加：
{
  name: '律动BlockBeats',
  kind: 'RSS',
  url: 'https://api.theblockbeats.news/v2/rss/all',
},
```

### 方案二：添加简体+繁体双语源（推荐）

**覆盖更广的中文用户群：**
- 律动BlockBeats（简体）- 大陆用户
- 區塊客（繁体）- 港澳台用户

```javascript
// 添加以下两个源：
{
  name: '律动BlockBeats',
  kind: 'RSS',
  url: 'https://api.theblockbeats.news/v2/rss/all',
},
{
  name: '區塊客 Blockcast',
  kind: 'RSS',
  url: 'https://blockcast.it/feed/',
},
```

### 方案三：完整中文生态（进阶）

**如果愿意自建RSSHub，可以添加金色财经：**

```javascript
// 前提：已部署自己的RSSHub实例
{
  name: '金色财经快讯',
  kind: 'RSS',
  url: 'https://your-rsshub-domain.com/jinse/lives',
},
```


---

## 💡 实施建议

### 立即可用（推荐）

**添加律动BlockBeats**：
1. 编辑 `apps/server/src/sources.js`
2. 在 `DEFAULT_NEWS_SOURCES` 数组中添加：
   ```javascript
   {
     name: '律动BlockBeats',
     kind: 'RSS',
     url: 'https://api.theblockbeats.news/v2/rss/all',
   },
   ```
3. 重启服务器：`cd apps/server && npm run dev`
4. 手动触发抓取测试：`curl -X POST http://localhost:8787/api/jobs/news`

### 后续优化

**语言标签：**
考虑在数据库中为新闻添加语言字段（`language: 'zh'` 或 `'en'`），方便前端按语言筛选。

**繁简转换：**
如果使用區塊客（繁体），可以在前端集成繁简转换库：
- `opencc-js` - 开源繁简转换工具
- 让简体用户也能阅读繁体新闻


---

## 🔗 相关链接

- [律动BlockBeats官网](https://www.theblockbeats.info)
- [律动BlockBeats RSS GitHub](https://github.com/BlockBeatsOfficial/RSS-v2)
- [區塊客官网](https://blockcast.it)
- [RSSHub文档](https://docs.rsshub.app)
- [金色财经官网](https://www.jinse.cn)


---

## ✅ 测试记录

**测试日期：** 2026-02-04

**测试结果：**
1. ✅ 律动BlockBeats - RSS正常，内容实时更新
2. ✅ 區塊客 - RSS正常，文章质量高
3. ⚠️ 金色财经 - 需通过RSSHub，官方实例有限制
4. ⚠️ PANews - RSS地址需进一步确认


---

## 📝 下一步

1. **决定方案**：选择方案一、二或三
2. **修改代码**：更新 `sources.js`
3. **测试**：手动触发新闻抓取
4. **监控**：观察中文新闻源的抓取效果
5. **优化关键词**：考虑添加中文关键词到 `IMPORTANT_KEYWORDS`

**中文关键词建议：**
```javascript
// 添加到 IMPORTANT_KEYWORDS
'比特币', '以太坊', 'DeFi', '监管', '暴跌', '暴涨',
'央行', '数字人民币', '香港', '新加坡', '合规',
'牛市', '熊市', '减半', '挖矿', '质押'
```

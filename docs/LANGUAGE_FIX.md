# 语言切换优化说明

## ✅ 已修复的问题

### 1. 语言切换按钮显示优化

**修改文件：** `apps/web/src/ui/LanguageToggle.jsx`

**改进：**
- ✅ 增加按钮最小宽度：32px → 40px
- ✅ 中文时使用系统中文字体：`PingFang SC`, `Microsoft YaHei`
- ✅ 防止中文显示变形或乱码

**效果：**
- 英文界面：显示 `🌐 EN`
- 中文界面：显示 `🌐 中文`

### 2. 新闻语言提示

**修改文件：** `apps/web/src/ui/App.jsx`

**新增功能：**
当界面语言为中文时，在新闻列表顶部显示提示：
```
📰 新闻内容为英文原文
```

**效果：**
- ✅ 用户切换到中文界面时，会看到提示说明新闻是英文的
- ✅ 英文界面不显示此提示
- ✅ 橙色警告样式，显眼但不刺眼

### 3. 预留中文新闻源

**修改文件：** `apps/server/src/sources.js`

**新增（注释状态）：**
- 金色财经 (Golden Finance)
- PANews
- BlockBeats (律动)

**如何启用：**
在 `apps/server/src/sources.js` 中，找到注释的中文新闻源，去掉 `/*` 和 `*/` 即可启用。

## 🎯 使用方法

### 测试语言切换

1. 启动前端：
```bash
cd apps/web
npm run dev
```

2. 打开浏览器：`http://localhost:5173`

3. 点击右上角的 `🌐 EN` 按钮
   - 应该切换为 `🌐 中文`
   - 界面所有文本都变为中文
   - 新闻列表顶部显示 `📰 新闻内容为英文原文`

4. 再次点击切换回英文
   - 应该切换为 `🌐 EN`
   - 界面恢复英文
   - 新闻提示消失

### 启用中文新闻源（可选）

如果你想要中文新闻，编辑 `apps/server/src/sources.js`：

```javascript
// 找到这段注释的代码
/*
{
  name: '金色财经 (Golden Finance)',
  kind: 'RSS',
  url: 'https://www.jinse.com/lives/rss',
},
*/

// 去掉注释变成
{
  name: '金色财经 (Golden Finance)',
  kind: 'RSS',
  url: 'https://www.jinse.com/lives/rss',
},
```

然后重启服务器：
```bash
cd apps/server
npm run dev
```

## 📊 对比

### 之前 ❌
- 语言按钮可能显示不正常（中文乱码或变形）
- 切换到中文后，新闻还是英文，没有说明
- 用户可能困惑为什么新闻不是中文

### 现在 ✅
- 语言按钮正常显示，中文字体优化
- 中文界面会提示"新闻内容为英文原文"
- 预留了中文新闻源，可随时启用

## 🔧 语言相关配置

### 修改默认语言

编辑 `apps/web/src/i18n/LanguageContext.jsx`：

```javascript
// 修改默认语言（第 36 行）
// 默认为英文
return 'en';

// 改为默认中文
return 'zh';
```

### 添加更多翻译

编辑 `apps/web/src/i18n/translations.js`：

```javascript
export const translations = {
  en: {
    yourKey: 'Your English Text',
  },
  zh: {
    yourKey: '你的中文文本',
  },
};
```

在组件中使用：
```javascript
const { t } = useLanguage();
return <div>{t('yourKey')}</div>;
```

## 💡 未来优化建议

1. **新闻翻译**
   - 集成翻译 API（Google Translate, DeepL）
   - 自动翻译英文新闻标题和摘要
   - 成本：每月约 $10-50（取决于新闻量）

2. **多语言新闻源**
   - 自动根据界面语言切换新闻源
   - 中文界面显示中文源，英文界面显示英文源
   - 或者两种语言的新闻都显示

3. **语言检测**
   - 自动检测新闻内容语言
   - 添加语言标签（EN/中文）
   - 允许用户按语言筛选

## 🐛 故障排查

### 语言按钮显示乱码
- 清除浏览器缓存
- 检查浏览器字体设置
- 确保系统安装了中文字体

### 切换语言后页面没变化
- 打开浏览器控制台查看是否有错误
- 检查 localStorage 是否可用
- 刷新页面

### 中文提示不显示
- 确保已切换到中文界面
- 确保在新闻页面（不是其他 tab）
- 检查浏览器控制台是否有错误

## ✨ 总结

✅ 语言按钮显示优化（字体、宽度）
✅ 中文界面显示新闻语言提示
✅ 预留中文新闻源（可选启用）
✅ 完善的语言切换体验

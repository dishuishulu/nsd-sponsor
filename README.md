# NSD 服务器 · 赞助页

一个纯静态的《我的世界》服务器赞助页面，无需构建、无依赖、无后端，双击 `index.html` 就能看。

## 文件结构

```
nsd-sponsor/
├─ index.html      页面结构（一般不用改）
├─ styles.css      样式（配色、布局；深色 + 金色主题）
├─ data.js         ★ 所有文案和套餐内容都在这里，改内容只改这个文件
├─ main.js         渲染逻辑（一般不用改）
├─ netlify.toml    Netlify 部署配置（已写好，一般不用动）
├─ .gitignore
└─ assets/
   └─ pay-qr.jpg   你给的那张收款二维码
```

## 改内容速查（全部在 `data.js`）

| 想改什么 | 改哪里 |
| --- | --- |
| 服务器名字、标语、顶部公告 | `site.server` / `site.slogan` / `site.notice` |
| QQ 群号、加群链接、服务器 IP | `site.qqGroup` / `site.qqGroupLink` / `site.javaIP` / `site.bedrockIP` |
| 套餐名称、价格、特权列表 | `tiers`（`{ text, on }`，`on: false` 会自动显示成灰叉） |
| 套餐对比表 | 自动从 `tiers` 生成，不用手写 |
| 赞助流程四步 | `steps` |
| 常见问题 | `faq` |
| 支付弹窗里的二维码、提示语 | `pay.qrImage` / `pay.tips` |
| 赞助者感谢名单 | `sponsors`（留空 `[]` 就整块隐藏） |
| 页脚免责声明 | `footer.note` |

> 加新套餐 = 在 `tiers` 里复制一段改一改，卡片和对比表会自动跟着变。

## 交互功能

- 点任意「立即赞助」→ 弹出对应套餐的收款码弹窗（Esc / 点遮罩 / 点 × 关闭）
- 弹窗内有「复制备注」按钮，一键复制 `游戏ID + 套餐名`
- 支持直接分享到某个套餐：`你的域名/#pay-pro`（普通 `#pay-basic`，至尊 `#pay-supreme`）
- 常见问题手风琴展开、滚动进场动画、移动端单列自适应（高级套餐自动排到第一位）

## 本地预览

```bash
cd nsd-sponsor
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

直接双击 `index.html` 也能用（除了极个别浏览器对本地图片限制外都正常）。

## 部署到 Netlify（推荐，仓库已配好）

仓库里已带 `netlify.toml`，**不需要构建命令，不需要填输出目录**，Netlify 会自动识别。

### 方式一：连 GitHub 仓库（自动部署）

1. 打开 <https://app.netlify.com/> → **Add new site** → **Import an existing project**
2. 选 **GitHub** → 授权 → 选择本仓库
3. 表单填法：
   ```
   Build command      （留空）
   Publish directory  .
   ```
4. 点 **Deploy**。之后每次 `git push` 都会自动重新部署。

### 方式二：拖拽上传（不连仓库）

打开 <https://app.netlify.com/drop>，把这个文件夹直接拖进去。

### 其他平台

- **Cloudflare Pages**：连仓库，Build command 留空，Output directory 填 `/`
- **GitHub Pages**：Settings → Pages → Source 选 `main` 分支 `/ (root)`
- **自己的服务器 / 宝塔**：上传到站点根目录即可（Nginx 默认配置就能跑）

## Git 使用

```bash
git add .
git commit -m "update: 改了什么"
git push
```

推送后 Netlify 约 10~30 秒完成部署。**改内容只需要动 `data.js`**，改完 push 即可。

### 缓存提示

`netlify.toml` 里 HTML 设为 `max-age=0`（立即生效），CSS/JS 为 1 小时。
如果改完 JS 发现浏览器还是旧的，`Ctrl+Shift+R` 强制刷新一次。

## 后续扩展建议（想要我可以继续加）

1. **赞助到账留言墙** —— 已经内置 `sponsors` 区块，直接往数组里加人
2. **服务器状态** —— 接 `api.mcsrvstat.us` 显示在线人数 / 是否存活
3. **套餐库存 / 限时倒计时** —— 涨价或活动期
4. **升级差价计算** —— 普通→高级补 15，高级→至尊补 30，做成按钮自动带入金额
5. **多支付渠道** —— 微信 / 支付宝 / 爱发电各一张码，弹窗里做 Tab 切换

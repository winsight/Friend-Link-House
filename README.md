# idealclover Blogroll

> 🍭 翠翠和他的朋友们的博客更新

[预览链接 blogroll.icl.moe](https://blogroll.icl.moe/)

![](https://s2.loli.net/2022/05/04/KTSp2DoxMEtCZWu.png)

> 仅收录友链博客文章，不代表翠翠本人观点

## 这是什么

因为自己在经营着 [个人网站](https://idealclover.top) ~~别骂了别骂了 会更新的~~ 所以也认识了一些有自己独立博客的校友朋友以及网络小伙伴们。

最初的时候还会时不时去友链中逛逛，但随着这个列表越来越长，自己也就没有时间精力一个个点进去了。往往点进去发现有新的更新，但我却一直没看到。

痛定思痛，想着用 RSS 的方式订阅自己友链们的博客更新，这样可以时常去拜访拜访。

说来也巧，自己的一个学弟 [orangex4](https://orangex4.cool/) 搞了个项目，聚合了我南的一些独立博客。想着就可以魔改一下，用到自己的友链们上。因此趁着五一假期搞了搞。

看了下，原项目的原理是通过 GitHub Actions 每天两次对列表进行爬取，生成出对应的静态网站并更新到 cloudflare workers 上，也是很巧妙了。

代码很强，傻翠就是狗尾续貂改了个小样式就拿来用了~ [预览链接 blogroll.icl.moe](https://blogroll.icl.moe/)

## 如何使用

如果你也想整一个的话，其实也不难，相对还是比较好办的

### Fork 项目

这个就不用我教了吧，看见右上角那个 fork 按钮了不，点就完事了！

生成一个自己的仓库之后好方便做更新和修改。

### 配置 CloudFlare

最重要的是先配置 CloudFlare，让整个链路先跑起来，之后的具体代码再怎么改都来得及。

CloudFlare 的网站在 [这里](https://cloudflare.com/)，注册账号之后先在左侧选中 `workers`， 注册一个 workers

然后在 [这里](https://dash.cloudflare.com/profile/api-tokens) 注册一个 api 密钥，并且在你 fork 的 GitHub 仓库中 `Settings` 的 `Secrets` 里添加一个叫 `CF_WORKERS_TOKEN` 的密钥，把刚刚申请的 api 密钥添加进去

最后进入到 [wrangler.toml](wrangler.toml) 中，修改这个文件里面的 `account_id` 和 `zone_id`，其中 `account_id` 可以在 `workers` 中获取到，而对于 `zone_id`，如果你没有自定义域名的诉求，可以在最前面加井号注释掉

修改完成并同步到 main 分支之后，GitHub Actions 应该会自动启动，观察执行情况就可以了。正常来讲应该会执行成功的。

### 本地部署与修改

既然基础已经跑起来了，接下来需要把它变成自己的，需要修改的有几处，当然，具体修改哪些看你需求：

更便捷的配置化功能什么的，接下来交给学弟实现吧。

* 修改获取的链接：直接修改这个 README.md 中下方的表格就可以了
* 修改 logo 等其他前端展现（已标记TODO）
    * ./web/public/favicon.ico -- 网站 icon
    * ./src/assets/logo.png -- 页内显示 logo
    * ./src/index.html -- 页面 title
    * ./src/APP.vue -- 页内标题及 banner 文案
* 修改自动生成的 RSS 信息（已标记TODO）：index.js

在本地想部署起来的话，直接 clone 你自己 fork 出的仓库到本地，然后作为标准 npm 项目去部署

```
# 安装依赖
npm install

# 开发
npm run dev

# 测试 RSS 获取

npm run gen

# 构建
npm run build
```

## 想加翠翠友链？

和 [关于](https://idealclover.top/about.html) 页面中的要求一样，可以在关于页面中进行申请，也可以直接在这个项目中提 [issue](https://github.com/idealclover/blogroll/issues) 或者直接提 [pull request](https://github.com/idealclover/blogroll/pulls)

但不保证照单全收哦！

## LICENSE

项目基于 [NJU-LUG/Blogroll](https://github.com/nju-lug/blogroll)，采用 [MIT Licence](./LICENSE)

## 傻翠的朋友 list

| Name               | RSS                                   | HTML                        |
| ------------------ | ------------------------------------- | --------------------------- |
| Idealclover's Blog | https://idealclover.top/feed          | https://idealclover.top/    |
| ZGQ's Blog         | https://blog.izgq.net/feed            | https://blog.izgq.net/      |
| bus1996            | https://bus1996.me/feed               | https://bus1996.me/         |
| HiKi               | https://www.aneureka.cn/atom.xml      | https://www.aneureka.cn/    |
| lizhihao6          | https://lizhihao6.online/feed         | https://lizhihao6.online/   |
| DIYGod             | https://diygod.me/atom.xml            | https://diygod.me/          |
| Tianyun Zhang      | https://doowzs.com/rss.xml            | https://doowzs.com/         |
| 鹏鹏               | https://blog.chper.cn/feed/           | http://blog.chper.cn/       |
| 冰凌胧月的小窝     | https://imiku.me/index.xml            | https://imiku.me            |
| SimpleZero         | https://mikuac.com/feed/              | https://mikuac.com          |
| VicBlog            | https://ddadaal.me/rss.xml            | https://ddadaal.me/         |
| Literature         | https://lizhihao6.online/feed         | https://www.literature.hk   |
| 青空之蓝           | https://blog.ixk.me/rss.xml           | https://www.ixk.me          |
| 樱花庄的白猫       | https://2heng.xin/feed                | https://2heng.xin           |
| 辣椒の酱           | https://removeif.github.io/atom.xml   | https://removeif.github.io/ |
| Domon              | https://www.domon.cn/rss/             | https://www.domon.cn        |
| SangSir            | https://sangsir.com/feed              | https://sangsir.com/        |
| 恶魔菌の记事簿     | https://meow3.family.blog/feed/       | https://meow3.family.blog/  |
| 蓝小柠的博客       | https://www.bleshi.com/feed/          | https://www.bleshi.com/     |
| 宇宙よりも遠い場所 | https://kirainmoe.com/index.xml       | https://kirainmoe.com/      |
| beyondstars        | https://exploro.one/feed/atom         | https://beyondstars.xyz/    |
| Sukka              | https://blog.skk.moe/rss.xml          | https://skk.moe/            |
| fengkx             | https://www.fengkx.top/atom.xml       | https://www.fengkx.top/     |
| JosePhilo          | https://josephilo.com/feed/           | https://josephilo.com       |
| ChrAlpha 的幻想乡  | https://blog.ichr.me/atom.xml         | https://chralpha.com        |
| Spencer Woo        | https://spencerwoo.com/feed           | https://spencerwoo.com/     |
| 木子的博客         | https://blog.k8s.li/atom.xml          | https://blog.k8s.li         |
| c0sMx              | https://www.c0smx.com/feed/           | https://www.c0smx.com       |
| 云游君的小站       | https://www.yunyoujun.cn/atom.xml     | https://www.yunyoujun.cn    |
| 猫鱼的小站         | https://2cat.net/?feed=rss2           | http://2cat.net             |
| MiaoTony's 小窝    | https://miaotony.xyz/atom.xml         | https://miaotony.xyz        |
| Timegg             | https://timegg.top/index.xml          | https://timegg.top/         |
| Aengus Blog        | https://www.aengus.top/feed           | https://www.aengus.top/     |
| klaus & laura      | https://klauslaura.cn/feed            | https://klauslaura.cn       |
| Orangex4           | https://orangex4.cool/atom.xml        | https://orangex4.cool/      |
| 小丁的个人博客     | https://tding.top/atom.xml            | https://tding.top/          |
| 不鉴的安全屋       | https://ryushane.com/index.php/feed/  | https://ryushane.com/       |
| 南雍随笔           | https://ydjsir.com.cn/atom.xml        | https://ydjsir.com.cn       |
| Cyris              | https://sound.cyris.moe/atom.xml      | https://cyris.moe/          |
| Dejavu's Blog      | https://www.dejavu.moe/index.xml      | https://www.dejavu.moe      |
| 世说新语           | https://www.wangyurui.top/feed.xml    | https://www.wangyurui.top   |
| itsNekoDeng        | https://dyfa.top/atom.xml             | https://dyfa.top/           |
| LarryZhao          | http://feeds.feedburner.com/larryzhao | https://larryzhao.com/      |
| SkyWT              | https://blog.skywt.cn/feed            | https://skywt.cn/           |

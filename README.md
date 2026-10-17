# 微信定位小程序（完整增强版）

这是一个增强版微信小程序定位示例，包含：

- 当前位置获取
- 地图展示
- 地址逆地理编码（腾讯地图）
- 实时定位监听
- 位置轨迹记录与路线显示
- 清空轨迹按钮

## 运行方式

1. 下载此仓库。
2. 用微信开发者工具导入项目。
3. 在 `pages/index/index.js` 中把 `YOUR_TENCENT_MAP_KEY` 替换成真实的腾讯地图 key。
4. 设定小程序 AppID，运行即可。

## 功能说明

### 1）获取当前坐标

`getCurrentLocation()` 会先判断是否已有定位权限；如果没有，就请求授权。

### 2）逆地理编码

`reverseGeocode(latitude, longitude)` 会调用腾讯地图 API：

```javascript
https://apis.map.qq.com/ws/geocoder/v1/
```

把经纬度转换成详细地址。

### 3）实时定位

`startWatchLocation()` 使用：

```javascript
wx.startLocationUpdate()
wx.onLocationChange()
```

实时监控位置变化，并持续更新地图和路线。

### 4）轨迹记录

程序会把每次定位点加入 `trackPoints` 数组，并使用 `polyline` 在地图上绘制轨迹线。

### 5）清空轨迹

点击“清空轨迹”后，会清空存储的路线点。

## 代码结构

```text
wechat-location-miniapp
├─ app.js
├─ app.json
├─ app.wxss
├─ project.config.json
├─ README.md
└─ pages
   └─ index
      ├─ index.js
      ├─ index.wxml
      └─ index.wxss
```

## 注意事项

- 小程序定位需要用户授权。
- 逆地理编码依赖腾讯地图 key，必须替换为真实 key。
- 生产环境建议后端统一处理地图接口，避免前端 key 暴露。

## 可继续扩展的功能

- 共享位置给指定好友
- 轨迹回放
- 周边 POI 搜索
- 地图导航
- 后端定位上报

如果你愿意，我可以继续把它升级成：

- “共享位置版”（多人共享定位）
- “轨迹回放版”（记录并回放路线）
- “附近商家搜索版”（地图搜索 + POI）
- “后端定位上报版”（Node.js + WebSocket）

我可以继续直接补下一版。
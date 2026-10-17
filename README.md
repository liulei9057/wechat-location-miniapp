# 微信定位小程序

这是一个基于微信小程序的定位示例，包含：

- 获取当前位置
- 在地图上显示当前位置
- 逆地理编码解析地址
- 开启/停止实时定位

## 运行方式

1. 复制此仓库到本地。
2. 打开微信开发者工具。
3. 选择“导入项目”。
4. 选择本项目目录。
5. 设定自己的小程序 AppID。
6. 在 `pages/index/index.js` 中替换 `YOUR_TENCENT_MAP_KEY` 为真实的腾讯地图 Key。

## 关键配置

### 1）腾讯地图 Key

本示例中，通过调用腾讯地图开放 API 来解析地理位置：

```javascript
const MAP_KEY = 'YOUR_TENCENT_MAP_KEY';
```

请在腾讯地图开放平台申请一个 key，并替换到这里。

### 2）权限

在 `app.json` 中已声明定位权限：

```json
"permission": {
  "scope.userLocation": {
    "desc": "用于展示当前位置和解析地理位置"
  }
}
```

## 功能说明

- `getCurrentLocation()`：请求位置权限并获取当前位置。
- `reverseGeocode()`：将经纬度转换为地址。
- `startWatchLocation()`：开启实时定位监听。
- `stopWatchLocation()`：停止实时定位监听。

## 注意事项

- 小程序定位功能需要用户授权。
- 真实项目里，建议把地图 key 放在后台配置或加密处理。
- 生产环境建议使用更稳妥的服务端反查地址，以减少前端 key 暴露。

## 目录结构

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

## 进阶扩展

后续还可以继续扩展：

- 实时共享位置给其他用户
- 轨迹记录与路线绘制
- 地图搜索周边 POI
- 逆地理编码 + 展示附近店铺
- 后台定位与定时上报

如果你愿意，我还可以继续把这个项目升级成：

- “轨迹记录版”
- “共享位置版”
- “带地图搜索 + POI 的完整版”

我可以下一步直接继续补。 

const MAP_KEY = 'YOUR_TENCENT_MAP_KEY';

Page({
  data: {
    latitude: 39.9042,
    longitude: 116.4074,
    markers: [],
    polyline: [],
    address: '未获取地址',
    status: '等待定位',
    isWatching: false,
    watchId: null,
    trackPoints: [],
  },

  onLoad() {
    this.setData({
      markers: [{
        id: 1,
        latitude: 39.9042,
        longitude: 116.4074,
        width: 24,
        height: 24,
        title: '当前位置',
        callout: {
          content: '当前位置',
          color: '#333',
          fontSize: 12,
          borderRadius: 6,
          bgColor: '#ffffff',
          padding: 6,
          display: 'ALWAYS',
        },
      }],
      polyline: [{
        points: [{ latitude: 39.9042, longitude: 116.4074 }],
        color: '#2e7dff',
        width: 4,
        dotted: false,
      }],
    });
  },

  onUnload() {
    this.stopWatchLocation();
  },

  getCurrentLocation() {
    const self = this;

    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userLocation'] === false) {
          wx.showModal({
            title: '定位权限已关闭',
            content: '请在设置中打开“使用我的地理位置”权限。',
            success(modalRes) {
              if (modalRes.confirm) {
                wx.openSetting({
                  success() {
                    self.fetchLocation();
                  },
                  fail() {
                    wx.showToast({ title: '未授权定位', icon: 'none' });
                  },
                });
              }
            },
          });
          return;
        }

        wx.authorize({
          scope: 'scope.userLocation',
          success() {
            self.fetchLocation();
          },
          fail() {
            wx.showToast({ title: '定位授权失败', icon: 'none' });
          },
        });
      },
      fail() {
        wx.showToast({ title: '请求权限失败', icon: 'none' });
      },
    });
  },

  fetchLocation() {
    const self = this;

    wx.showLoading({ title: '获取中...' });
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        const point = {
          latitude: res.latitude,
          longitude: res.longitude,
        };

        const trackPoints = self.data.trackPoints.length > 0 ? self.data.trackPoints : [point];
        const last = trackPoints[trackPoints.length - 1];
        const distance = self._distanceBetween(last, point);

        if (distance > 3 || trackPoints.length === 1) {
          trackPoints.push(point);
        }

        self.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          status: '已获取当前位置',
          trackPoints,
          polyline: [{
            points: trackPoints,
            color: '#2e7dff',
            width: 4,
            dotted: false,
          }],
          markers: [{
            id: 1,
            latitude: res.latitude,
            longitude: res.longitude,
            width: 24,
            height: 24,
            title: '当前位置',
            callout: {
              content: '当前位置',
              color: '#333',
              fontSize: 12,
              borderRadius: 6,
              bgColor: '#ffffff',
              padding: 6,
              display: 'ALWAYS',
            },
          }],
        });

        self.reverseGeocode(res.latitude, res.longitude);
      },
      fail(err) {
        console.error('getLocation fail:', err);
        wx.showToast({ title: '获取位置失败', icon: 'none' });
      },
      complete() {
        wx.hideLoading();
      },
    });
  },

  reverseGeocode(latitude, longitude) {
    const self = this;

    if (!MAP_KEY || MAP_KEY === 'YOUR_TENCENT_MAP_KEY') {
      this.setData({
        address: '请替换为自己的腾讯地图 key 后启用逆地理编码',
      });
      return;
    }

    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/',
      data: {
        location: `${latitude},${longitude}`,
        key: MAP_KEY,
        output: 'json',
      },
      success(res) {
        const info = res.data && res.data.result;
        const resultAddress = info && info.address ? info.address : '无法解析地址';
        self.setData({ address: resultAddress });
      },
      fail() {
        self.setData({ address: '地址解析失败' });
      },
    });
  },

  startWatchLocation() {
    const self = this;

    wx.startLocationUpdate({
      success() {
        if (self.data.watchId) {
          wx.offLocationChange(self.data.watchId);
        }

        const watchId = wx.onLocationChange((res) => {
          if (!res || typeof res.latitude !== 'number' || typeof res.longitude !== 'number') {
            return;
          }

          const point = {
            latitude: res.latitude,
            longitude: res.longitude,
          };

          const currentTrack = self.data.trackPoints.slice();
          const last = currentTrack[currentTrack.length - 1];
          const distance = last ? self._distanceBetween(last, point) : Number.MAX_VALUE;

          if (!last || distance > 3) {
            currentTrack.push(point);
          }

          self.setData({
            latitude: res.latitude,
            longitude: res.longitude,
            status: '实时定位中',
            isWatching: true,
            trackPoints: currentTrack.slice(-200),
            polyline: [{
              points: currentTrack.slice(-200),
              color: '#2e7dff',
              width: 4,
              dotted: false,
            }],
            markers: [{
              id: 1,
              latitude: res.latitude,
              longitude: res.longitude,
              width: 24,
              height: 24,
              title: '实时位置',
              callout: {
                content: '实时位置',
                color: '#333',
                fontSize: 12,
                borderRadius: 6,
                bgColor: '#ffffff',
                padding: 6,
                display: 'ALWAYS',
              },
            }],
          });

          self.reverseGeocode(res.latitude, res.longitude);
        });

        self.setData({
          watchId,
          isWatching: true,
          status: '已开始实时定位',
        });
      },
      fail() {
        wx.showToast({ title: '开启实时定位失败', icon: 'none' });
      },
    });
  },

  stopWatchLocation() {
    const { watchId } = this.data;

    if (watchId) {
      wx.offLocationChange(watchId);
      this.setData({ watchId: null, isWatching: false, status: '已停止实时定位' });
    }

    wx.stopLocationUpdate({
      success() {
        console.log('stopLocationUpdate success');
      },
      fail() {
        console.log('stopLocationUpdate fail');
      },
    });
  },

  clearTrack() {
    this.setData({
      trackPoints: [],
      polyline: [{ points: [], color: '#2e7dff', width: 4, dotted: false }],
      status: '轨迹已清空',
    });
  },

  _distanceBetween(a, b) {
    if (!a || !b) return Number.MAX_VALUE;

    const toRad = (value) => value * Math.PI / 180;
    const earthRadius = 6371000;
    const dLat = toRad(b.latitude - a.latitude);
    const dLng = toRad(b.longitude - a.longitude);
    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);

    const h =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

    const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
    return earthRadius * c;
  },
});

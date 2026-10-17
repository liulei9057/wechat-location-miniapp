const MAP_KEY = 'YOUR_TENCENT_MAP_KEY';

Page({
  data: {
    latitude: 39.9042,
    longitude: 116.4074,
    markers: [],
    address: '未获取地址',
    status: '等待定位',
    isWatching: false,
    watchId: null,
  },

  onLoad() {
    const initial = {
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      markers: [{
        id: 1,
        latitude: this.data.latitude,
        longitude: this.data.longitude,
        width: 24,
        height: 24,
        iconPath: '/images/location-marker.png',
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
    };

    this.setData(initial);
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

        if (res.authSetting['scope.userLocation'] || res.authSetting['scope.userLocation'] === undefined) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              self.fetchLocation();
            },
            fail() {
              wx.showToast({ title: '定位授权失败', icon: 'none' });
            },
          });
        }
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
        const latitude = res.latitude;
        const longitude = res.longitude;

        self.setData({
          latitude,
          longitude,
          status: '已获取当前位置',
          markers: [{
            id: 1,
            latitude,
            longitude,
            width: 24,
            height: 24,
            iconPath: '/images/location-marker.png',
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

        self.reverseGeocode(latitude, longitude);
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
        address: '请在 index.js 中替换为真实的腾讯地图 key',
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
        const result = res.data && res.data.result;
        const address = result && result.address ? result.address : '无法解析地址';

        self.setData({
          address,
        });
      },
      fail() {
        self.setData({
          address: '地址解析失败',
        });
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

          self.setData({
            latitude: res.latitude,
            longitude: res.longitude,
            status: '实时定位中',
            isWatching: true,
            markers: [{
              id: 1,
              latitude: res.latitude,
              longitude: res.longitude,
              width: 24,
              height: 24,
              iconPath: '/images/location-marker.png',
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
});






















































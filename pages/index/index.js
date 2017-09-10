

const util = require('../../utils/util.js');

Page({
  // inputing:function(e){
  //   this.setData({inputCity:e.detail.value});
  // },
  bindSearch:function(){
    this.searchWeather(this.data.inputCity);
  },

  searchWeather: function (cityName) {
    console.log(cityName);
    let self = this;
    wx.request({
      url: 'https://wthrcdn.etouch.cn/weather_mini?city=' + cityName,
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: res => {
        if (res.data.status == 1002) {
          wx.showModal({
            title: '提示',
            content: '输入的城市名称有误，请重新输入！',
            showCancel: false,
            success: res => {
              self.setData({ inputCity: '' });
            }
          })
        } else {
          let weather = res.data.data;
          for (let i = 0; i < weather.forecast.length; i++) {
            let d = weather.forecast[i].date;
            //处理日期信息，添加空格
            console.log(d);
            // weather.forecast[i].date = ' ' + d.replace('星期', '　　　星期');
          }
          self.setData({
            city: cityName,//更新显示城市名称
            weather: weather,//更新天气信息
            inputCity: ''//清空查询输入框
          })
        }
      }
    })
  },
  
  /**
   * 页面的初始数据
   */
  data: {
    weather:{},
    today:'2016-11-18',
    city:'北京',
    inputCity:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
        this.setData({
          today:util.formatTime (new Date()).split(' ')[0]//更新当前日期
        });
        var self = this;
        wx.getLocation({
          type: 'wgs84',
          success: res => {
            console.log('success to load the location!');
            wx.request({
              url: 'https://api.map.baidu.com/geocoder/v2/' + '?ak=OLraI7NV4e7knYLVdiEBdKvG8s0qtPzn&location=' + res.latitude + ',' + res.longitude + '&output=json&pois=0',
              data: {},
              header: {
                'Content-Type':'application/json'
              },
              success: res =>{
                console.log('success to get the city!');
                let city = res.data.result.addressComponent.city.replace('市','');//城市名称
                console.log('获取的城市为：' + city);
                self.searchWeather(city); //查询制定城市的天气信息
                
              }
            })
          }
        })
      },





})
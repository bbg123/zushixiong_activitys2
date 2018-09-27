let obj = hrefObj()
var token = obj.token
// var token = 'KSeCkLvOyZobVljx'
var arr = []
var flag
var timer = 0
let timer1
init()

// 初始化数据
function init() {
  // 获取数据
  getData('init', function (res) {
    flag = res.data.is_draw
    let index = 1
    let juanIndex = 3
    let html = ''
    arr = res.data.list || []
    let data = res.data.winner_list || []
    // 判断是否有信息
    if (res.data.winner_list) {
      for (let i = 0; i < data.length; i++) {
        html += `<li class="msg">
          <div class="user_name">${data[i].name}</div>
          <div class="msg_goods">${data[i].intro}</div>
        </li>`
        index += 1
        if (i == data.length - 1) {
          html += `<li class="msg">
            <span>${data[0].name}</span>
            <span class="msg_goods">${data[0].intro}</span>
          </li>`
        }
      }
      msgAnimate(index)
    }
    $('.msg_box_content').html(html)

    // 我的幸运牌
    initmy_winner_list(res)

    // 把优惠劵找出来放到中间位置
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].type == 1) {
        if ((i == 3 || i == 4)) {
          continue
        }
        if (arr[juanIndex].type == 1) {
          juanIndex = 4
        }
        // 位置互换
        [arr[i], arr[juanIndex]] = [arr[juanIndex], arr[i]]
      }
    }

    let html1 = boxHtml(arr)
    $('.box').html(html1)

  })
}

// 我的幸运牌
function initmy_winner_list(res) {
  let html2 = ''
  // 判断是否有幸运牌
  let timeArr = []
  clearInterval(timer)
  if (res.data.my_winner_list.length != 0) {
    res.data.my_winner_list.forEach(item => {
      timeArr.push(item.end_time)
      html2 += `<div class="title_gz_draw_box_record">
      <div class="title_gz_draw_box_record_top">
        <div class="title_gz_draw_box_record_top_img" data-id="${item.goods_id}">
          <img src="${item.img}" alt="">
        </div>
        <div class="title_gz_draw_box_record_top_text">
          <span class="title_gz_draw_box_record_top_text1">${item.name}</span>
          <span class="title_gz_draw_box_record_top_time ${item.end_time != 0 ? 'clo_red' : ''}"></span>
          <button class="title_gz_draw_box_record_top_btn" data-id="${item.goods_id}" data-type="${item.type}">立即使用</button>
        </div>
      </div>
      <div class="title_gz_draw_box_record_bottom">
        ${item.intro}
      </div>
    </div>`
    })
  } else {
    html2 = '暂无数据'
  }
  $('.title_gz_draw_box').html(html2 + '<div class="close">X</div>')
  timer = setInterval(() => {
    timeArr.forEach((item, index) => {
      if (item != 0) {
        item--
      }
      timeArr.splice(index, 1, item)
      $('.title_gz_draw_box_record_top_time').eq(index).html(`距结束 ${item != 0 ? timeStamp(item) : '已失效'}`)
    })
  }, 1000)
}

// 时间换算
function timeStamp(second_time) {
  var time = parseInt(second_time)
  if (parseInt(second_time) > 60) {
    var second = second_time % 60
    var min = parseInt(second_time / 60)
    time = (min < 10 ? '0' + min : min) + ":" + (second < 10 ? '0' + second : second)

    if (min > 60) {
      min = parseInt(second_time / 60) % 60
      var hour = parseInt(parseInt(second_time / 60) / 60)
      time = (hour < 10 ? '0' + hour : hour) + ":" + (min < 10 ? '0' + min : min) + ":" + (second < 10 ? '0' + second : second)
    }
  }
  return time
}

// 获取url参数
function hrefObj() {　　
  var localhref = window.location.href;
  if (localhref.indexOf('?') != -1) {
    var localarr = localhref.split('?')[1].split('&')
    var tempObj = {};
    for (var i = 0; i < localarr.length; i++) {　　
      tempObj[localarr[i].split('=')[0]] = localarr[i].split('=')[1]
    }
    return tempObj;
  } else {
    return ""
  }
}

// 底部消息轮播
function msgAnimate(index) {
  let num = -45
  timer1 = setInterval(() => {
    if (Math.abs(num) >= (45 * index)) {
      num = -45
      $('.msg_box_content').css({
        top: 0
      })
    }
    $('.msg_box_content').animate({
      top: num
    })
    num += -45
  }, 3000)
}

// 请求数据
function getData(url, fn) {
  $.ajax({
    url: 'https://www.zushixiong.com/api/activity_draw1808/' + url,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "DeviceId": "xcx",
      "access-token": token,
    },
    dataType: 'json',
    success: fn
  })
}

// html结构
function boxHtml(arr, dir = 'front') {
  let html1 = ''
  arr.forEach((item, index) => {
    // 判断是正面还是反面
    if (dir == 'front') {
      if (index == 4) {
        html1 += `<div class="tap">
          <div class="box_children_tap">
            <span class="font">STAR</span>
            <span>点击翻牌</span>
          </div>
        </div>`
      }
      html1 += `<div class="box_children" data-num="${index}">
        <div class="num">
          <img src="${item.img}" alt="">
        </div>`
    } else if (dir == 'reverse') {
      if (index == 4) {
        html1 += `<div class="tap">
          <div class="box_children_tap">
            <span class="font">请选择</span>
            <span>一张幸运牌</span>
          </div>
        </div>`
      }
      html1 += `<div class="box_children activeIn" data-num="${index}">
      <div class="num" style="display: none;">
        <img src="${item.img}" alt="">
      </div>`
    }

    html1 += `
      <div class="num1" ${dir == 'reverse' ?'style="display: block;"' : ''}>
        <div class="num1_img">
          <img src="./images/reverse1.jpg" alt="">
        </div>
        </div>
      </div>`

  })
  return html1
}

window.onload = function () {

  // 点击旋转翻牌
  $('.box').on('touchstart', '.tap', function () {
    if (!$(this).siblings().hasClass('activeIn') && flag && !$(this).hasClass('box_children_active')) {
      flag = false
      $('.box_children').removeClass('box_children_active')
      arr.shuffle()
      let html2 = boxHtml(arr, 'reverse')
      $(this).siblings().addClass('activeIn')
      let timeOut = setTimeout(() => {
        $(this).siblings().children('.num').hide()
        $(this).siblings().children('.num1').show(function () {
          $('.box').html(html2)
          let timeOut1 = setTimeout(() => {
            flag = true
            clearTimeout(timeOut1)
          },200)
        })
        clearTimeout(timeOut)
      }, 120)
    } else {
      $('.is_draw_tips').fadeIn()
      $('.mask_layer2').fadeIn()
    }
    return false
  })

  // 点击选择牌
  $('.box').on('touchstart', '.box_children', function () {
    var box_childrenIndex = $(this).data('num')
    let that = $(this)
    if (that.hasClass('activeIn') && flag) {
      $('.loading').show()
      $('.mask_layer').show()
      flag = false
      getData('draw', function (res) {
        // 循环出和结果一样的商品,然后和点击位置的商品调换
        that.children('.num').children('img').attr("src", res.data.img)
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id == res.data.id) {
            // 找到结果的商品切换
            $('.box_children').eq(i).children('.num').children('img').attr('src', arr[box_childrenIndex].img)
            break
          }
        }
        $('.loading').hide()
        $('.mask_layer').hide()
        that.removeClass('activeIn')
        let timeOut = setTimeout(() => {
          // 选中牌翻转到正面
          that.children('.num').show()
          that.children('.num1').hide()
          // 加一个选中效果
          that.siblings().addClass('box_children_active')
          clearTimeout(timeOut)
          let timeOut1 = setTimeout(() => {
            // 删掉反面效果
            $('.box_children').removeClass('activeIn')
            clearTimeout(timeOut1)
            let timeOut2 = setTimeout(() => {
              $('.box_children_tap').html('<span class="font">STAR</span><span>点击翻牌</span>')
              $('.result_title2').html(res.data.intro)
              // 其他牌翻转
              $('.box_children').children('.num').show()
              $('.box_children').children('.num1').hide(function () {
                let timeOut3 = setTimeout(() => {
                  // 选中的图放到弹出框
                  $('.result').fadeIn().children('img').attr('src', res.data.img)
                  // 遮罩层显示
                  $('.mask_layer').fadeIn()
                  // 显示结果
                  $('.result').addClass('resActive')
                  clearTimeout(timeOut3)
                }, 1000)
              })
              clearTimeout(timeOut2)
            }, 120)

          }, 500)

        }, 120)

      })
    }
    return false
  })

  // 点击领取隐藏其他
  $('.btn').on('touchstart', function () {
    flag = true
    $('.result').fadeOut(200)
    $('.result').removeClass('resActive').hide(100)
    $('.mask_layer').fadeOut(200, function () {
      $('.title_gz_draw_box').fadeIn()
      $('.mask_layer2').fadeIn(function () {
        clearInterval(timer)
        getData('init', function (res) {
          initmy_winner_list(res)
        })
      })
    })
    return false
  })

  // 点击显示规则
  $('.title_gz_text').on('touchstart', function () {
    $('.title_gz_box').fadeIn()
    $('.mask_layer1').fadeIn()
    return false
  })

  // 点击显示中奖记录
  $('.title_gz_draw').on('touchstart', function () {
    $('.title_gz_draw_box').fadeIn()
    $('.mask_layer2').fadeIn(function () {
      clearInterval(timer)
      getData('init', function (res) {
        initmy_winner_list(res)
      })
    })
    return false
  })

  // 点击隐藏
  $('.mask_layer1').on('touchstart', function () {
    $('.title_gz_box').fadeOut()
    $('.mask_layer1').fadeOut()
    return false
  })

  $('.mask_layer2').on('touchstart', function () {
    $('.is_draw_tips').fadeOut()
    $('.mask_layer2').fadeOut()
    $('.title_gz_draw_box').fadeOut()
    return false
  })

  $('.is_draw_tips').on('click', function () {
    $(this).fadeOut()
    $('.mask_layer2').fadeOut()
    return false
  })

  $('.title_gz_box').on('click', function () {
    $(this).fadeOut()
    $('.mask_layer1').fadeOut()
    return false
  })

  // 刷新页面
  $('.title_img').on('click', function () {
    window.location.href = 'https://www.zushixiong.com/h5/draw1808/index.html?token=' + token
    return false
  })

  // 返回小程序首页
  $('.title_gz_back').on('click', function () {
    wx.miniProgram.switchTab({
      url: '/pages/Home/home'
    })
  })

  // 点击跳转到小程序对应的位置或商品
  $('.title_gz_draw_box').on('click', '.title_gz_draw_box_record_top_img', function () {
    if ($(this).data('id')) {
      wx.miniProgram.navigateTo({
        url: '/pages/choimmer/choimmer?id=' + $(this).data('id')
      })
    }
    return false
  })

  $('.title_gz_draw_box').on('click', '.title_gz_draw_box_record_top_btn', function () {
    switch ($(this).data('type')) {
      case 1:
        wx.miniProgram.navigateTo({
          url: '/pages/coupon/coupon?type=1'
        })
        break
      case 2:
        wx.miniProgram.navigateTo({
          url: '/pages/order/order?type=1'
        })
        break
      default:
        wx.miniProgram.switchTab({
          url: '/pages/index/index'
        })
        break
    }
    return false
  })

  $('body').on('click','.close' ,function() {
    $('.title_gz_draw_box').fadeOut()
    $('.title_gz_box').fadeOut()
    $('.mask_layer1').fadeOut()
    $('.mask_layer').fadeOut()
    $('.mask_layer2').fadeOut()
    $('.result').removeClass('resActive')
    return false
  })

  // 数组随机位置方法
  Array.prototype.shuffle = function () {
    var input = this;
    for (var i = input.length - 1; i >= 0; i--) {
      var randomIndex = Math.floor(Math.random() * (i + 1))
      let temp = input[i];
      input[i] = input[randomIndex];
      input[randomIndex] = temp;
    }
    return input;
  }
}

window.onbeforeunload = function() {
  this.clearInterval(timer1)
}
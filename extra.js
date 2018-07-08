(function () {
  // 添加附加HTML
  document.body.innerHTML += `
  <style>
    #ruisheng-mask {
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.7);
      display: none;
      justify-content: center;
      align-items: center;
    }
    #ruisheng-inputArea,
    #ruisheng-bottonArea{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
    .ruisheng-unit{
      flex-basis: 100%;
      flex-wrap: wrap;
      height: 100px;
    }
  </style>
  <div id="ruisheng-mask">
      <div id="ruisheng-inputArea">
          <input id="ruisheng-modifyContent" class="ruisheng-unit" type="text"/>
          <button id="ruisheng-check" class="ruisheng-unit">确定</button>
          <button id="ruisheng-cancel" class="ruisheng-unit">取消</button>
      </div>
      <div id="ruisheng-bottonArea">
          <button id="ruisheng-add" class="ruisheng-unit">在前面增加</button>
          <button id="ruisheng-modify" class="ruisheng-unit">修改本段</button>
      </div>
  </div>`


  var global = {
    target: {}, // 点击的原页面元素
    newContent: '', // 新输入的内容
    type: '' // 编辑内容时的方式：'ADD'表示在后面增加，'MODIFY'表示编辑本段
  }
  // 微信公众号页面内容
  var content = document.getElementById('page-content')
  // 遮罩层
  var mask = document.getElementById('ruisheng-mask')
  // 输入相关按钮
  var checkButton = document.getElementById('ruisheng-check')
  var cancelButton = document.getElementById('ruisheng-cancel')
  var inputContent = document.getElementById('ruisheng-modifyContent')
  var inputArea = document.getElementById('ruisheng-inputArea')

  // 编辑方式按钮
  var bottonArea = document.getElementById('ruisheng-bottonArea')
  var addButton = document.getElementById('ruisheng-add')
  var modifyButton = document.getElementById('ruisheng-modify')

  // 显示和隐藏遮罩层相关控件
  var hide = function(type) {
    // 清空输入
    inputContent.value = ''
    // 控件框隐藏
    mask.style.display = 'none'
    // switch(type) {
    //   case 'input':
        inputArea.style.display = 'none'
    //     break
    //   case 'bottons':
        bottonArea.style.display = 'none'
    //     break
    //   default: 
    // }
  }
  var show = function(type) {
    hide()
    mask.style.display = 'flex'
    switch(type) {
      case 'input':
        inputArea.style.display = 'flex'
        break
      case 'bottons':
        bottonArea.style.display = 'flex'
        break
      default:
        console.error('没有show方法的匹配结果')
    }
  }


  // 页面内容点击
  content.addEventListener('click', function (e) {
    var target = e.target
    var tagName = target.tagName

    // 添加修改文字
    if (tagName === 'p'
      || tagName === 'P'
      || tagName === 'span'
      || tagName === 'SPAN') {
      show('bottons')
      global.target = target
    }

    // 修改图片
    if (tagName === 'img'
      || tagName === 'IMG') {
      show('input')
      global.type = 'IMG'
      global.target = target
    }
  })

  // 编辑本段还是在前面增加的按钮点击
  addButton.addEventListener('click', function(e) {
    global.type = 'ADD'
    show('input')
  })
  modifyButton.addEventListener('click', function(e){
    global.type = 'MODIFY'
    show('input')
  })

  // 修改按钮点击
  checkButton.addEventListener('click', function (e) {
    global.newContent = inputContent.value
    switch(global.type) {
      case 'MODIFY':
        global.target.innerHTML = global.newContent
        break
      case 'ADD':
        var newPElement = document.createElement('p')
        newPElement.style.textAlign = 'center'
        newPElement.innerHTML = global.newContent
        global.target.parentNode.insertBefore(newPElement, global.target)
        break
      case 'IMG':
        global.target.setAttribute('src', global.newContent)
        break
      default:
    }

    hide('input')
  })
  cancelButton.addEventListener('click', function (e) {
    hide('input')
  })

})()

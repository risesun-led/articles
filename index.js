const
  request = require('request'),
  // cheerio = require('cheerio'),
  fs = require('fs')

// 爬虫并附加可编辑功能的脚本
const
  getContent = function (wxURL, articleName) {
    return request(wxURL, function (err, res) {
      if (err) return console.error(err)
      // const $ = cheerio.load(res.body.toString())

      // 替换图片SRC 微信页面特殊处理方式，所有图片都有一个data-src属性来保存src值
      const 
        content = res.body.toString().replace(/data-src/g, 'src'),
        newScript = []

      // 插入可编辑功能的脚本
      newScript.push(`<script src="../extra.js"></script>`)
      newScript.push('</html>')

      const newHTML = content.replace(/\<\/html\>(?!\-\-\>)/g, newScript.join(''))
      fs.writeFileSync(`./articles/${articleName}.html`, newHTML)
    })
  }

// 链接地址
const
  wxURL = 'https://mp.weixin.qq.com/s/P09e68RSF-KURgHVi4eMQQ',
  articleID = '1'
  
getContent(wxURL, articleID)




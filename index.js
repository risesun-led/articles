const
  request = require('request'),
  // cheerio = require('cheerio'),
  fs = require('fs'),
  http = require('http'),
  url = require('url')

// 爬虫并附加可编辑功能的脚本
const
  getContent = function (wxURL, articleName) {
    return request(wxURL, function (err, res) {
      if (err) return console.error(err)
      // const $ = cheerio.load(res.body.toString())

      // 替换图片SRC 微信页面特殊处理方式，所有图片都有一个data-src属性来保存src值
      // 由于转发到微信打开有防盗链机制，因此加上防盗链接头破解
      const 
        content = 
          res.body.toString()
            .replace(/\<head\>(?!\<\/head\>)/, `<head><meta name="referrer" content="no-referrer">`)
            .replace(/data-src="/g, 'src="http://img01.store.sogou.com/net/a/04/link?appid=100520029&url='),
        newScript = []

      // 插入可编辑功能的脚本
      newScript.push(`<script src="../extra.js"></script>`)
      newScript.push('</html>')

      console.log('+++++++++++++++++', articleName)
      const newHTML = content.replace(/\<\/html\>(?!\-\-\>)/g, newScript.join(''))
      fs.writeFileSync(`./articles/${articleName}.html`, newHTML)
    })
  }

// 建立服务器
const
  hostName = '127.0.0.1',
  port = '8088',
  server = http
    .createServer(function(req, res) {
      var pathname = url.parse(req.url).pathname

      console.log('~~~~~~~~~~~~~~~', pathname)
      res.setHeader('Content-Type','text/plain')
      res.setHeader('Access-Control-Allow-Origin',"*")
      res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")

      // POST方法
      if (req.method === "POST") {
        var body = ''

        req.on('data', function(chunk) {
          body += chunk
        })

        req.on('end', function() {
          body = JSON.parse(body)
          console.log('~~~~~~~~~~~~~~~~~~', body)

          // POST路由
          if (pathname === '/addarticle' && body && body.address) {
            getContent(body.address, body.name || (new Date()).toDateString())
          }
          else if(pathname === '/modifyhtml' && body && body.type && body.id && body.innerHtml) {

          }

        })
        
      }

      // 路由
      
      res.end("risesun")
    })
    .listen(port, hostName, function(){
      console.log('~~~~~~~~~~ 在１２７．０．０．１建立本地服务器，监听８０８８端口 ~~~~~~~~~~')
    })


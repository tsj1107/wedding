<?php
class JSSDK {
  private $appId;
  private $appSecret;
  public $User_ID;

  public function __construct($appId, $appSecret, $User_ID = 1) {
    $this->appId = $appId;
    $this->appSecret = $appSecret;
    $this->User_ID = $User_ID;
  }

  public function Ext_FileSystem(){
    if(!file_exists("jSon_file/jsapi_ticket_".$this->User_ID.".json")){
        touch("jSon_file/jsapi_ticket_".$this->User_ID.".json");
        chmod("jSon_file/jsapi_ticket_".$this->User_ID.".json",0755);
    }

    if(!file_exists("jSon_file/access_token_".$this->User_ID.".json")){
        touch("jSon_file/access_token_".$this->User_ID.".json");
        chmod("jSon_file/access_token_".$this->User_ID.".json",0755);
    }
  }

  public function GetSignPackage() {
    $this->Ext_FileSystem();
    $jsapiTicket = $this->getJsApiTicket();
    $url = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
    $timestamp = time();
    $nonceStr = $this->createNonceStr();

    // 这里参数的顺序要按照 key 值 ASCII 码升序排序
    $string = "jsapi_ticket=$jsapiTicket&noncestr=$nonceStr&timestamp=$timestamp&url=$url";

    $signature = sha1($string);

    $signPackage = array(
      "appId"     => $this->appId,
      "nonceStr"  => $nonceStr,
      "timestamp" => $timestamp,
      "url"       => $url,
      "signature" => $signature,
      "rawString" => $string
    );
    return $signPackage;
  }

  private function createNonceStr($length = 16) {
    $chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    $str = "";
    for ($i = 0; $i < $length; $i++) {
      $str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
    }
    return $str;
  }

  private function getJsApiTicket() {
    // jsapi_ticket 应该全局存储与更新，以下代码以写入到文件中做示例
    $data = json_decode(file_get_contents("jSon_file/jsapi_ticket_".$this->User_ID.".json"));
    if ($data->expire_time < time()) {
      $accessToken = $this->getAccessToken();

      $url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=$accessToken";
      $res = json_decode($this->_request($url,true,'GET'));
      $ticket = $res->ticket;
      if ($ticket) {
        $data->expire_time = time() + 7000;
        $data->jsapi_ticket = $ticket;
        $fp = fopen("jSon_file/jsapi_ticket_".$this->User_ID.".json", "w");
        fwrite($fp, json_encode($data));
        fclose($fp);
        chmod("jSon_file/jsapi_ticket_".$this->User_ID.".json",0777);
      }
      $this->getJsApiTicket();
    } else {
      $ticket = $data->jsapi_ticket;
    }

    return $ticket;
  }

  private function getAccessToken() {
    // access_token 应该全局存储与更新，以下代码以写入到文件中做示例
    $data = json_decode(file_get_contents("jSon_file/access_token_".$this->User_ID.".json"));
    if ($data->expire_time < time()) {
      $url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=$this->appId&secret=$this->appSecret";
      $res=json_decode($this->_request($url,true,'GET'));
      $access_token = $res->access_token;

      if ($access_token) {
        $data->expire_time = time() + 7000;
        $data->access_token = $access_token;
        $fp = fopen("jSon_file/access_token_".$this->User_ID.".json", "w");
        fwrite($fp, json_encode($data));
        fclose($fp);
        chmod("jSon_file/access_token_".$this->User_ID.".json",0777);
      }
      $this->getAccessToken();
    } else {
      $access_token = $data->access_token;
    }
    return $access_token;
  }
  public function _request($curl,$https=true,$method='GET',$data=null){
        $ch=curl_init();
        curl_setopt($ch,CURLOPT_URL,$curl);
        //是否要文件头
        curl_setopt($ch,CURLOPT_HEADER,false);
        //是否直接输出
        curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
        if($https){
            //是否对主机进行验证
            curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,false);
            curl_setopt($ch, CURLOPT_SSL_VERIFYHOST,true);
        }
        if($method=='POST'){
            curl_setopt($ch, CURLOPT_POST,true);
            curl_setopt($ch,CURLOPT_POSTFIELDS,$data);
        }
        $content=curl_exec($ch);
        curl_close($ch);
        return $content;
    }
  private function httpGet($url) {
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_TIMEOUT, 500);
    curl_setopt($curl, CURLOPT_URL, $url);

    $res = curl_exec($curl);
    curl_close($curl);

    return $res;
  }
}

//system start
/*$a=new JSSDK("wxcd32bccf96f2e484", "c060140481f69ec07919eb52073f86ea");
$b = $a->GetSignPackage();
$b=json_encode($b);
echo $b;
exit;*/

$jssdk = new JSSDK("wxcd32bccf96f2e484", "c060140481f69ec07919eb52073f86ea");
$signPackage = $jssdk->GetSignPackage();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script>
      !function(e){function t(a){if(i[a])return i[a].exports;var n=i[a]={exports:{},id:a,loaded:!1};return e[a].call(n.exports,n,n.exports,t),n.loaded=!0,n.exports}var i={};return t.m=e,t.c=i,t.p="",t(0)}([function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=window;t["default"]=i.flex=function(e,t){var a=e||100,n=t||1,r=i.document,o=navigator.userAgent,d=o.match(/Android[\S\s]+AppleWebkit\/(\d{3})/i),l=o.match(/U3\/((\d+|\.){5,})/i),c=l&&parseInt(l[1].split(".").join(""),10)>=80,p=navigator.appVersion.match(/(iphone|ipad|ipod)/gi),s=i.devicePixelRatio||1;p||d&&d[1]>534||c||(s=1);var u=1/s,m=r.querySelector('meta[name="viewport"]');m||(m=r.createElement("meta"),m.setAttribute("name","viewport"),r.head.appendChild(m)),m.setAttribute("content","width=device-width,user-scalable=no,initial-scale="+u+",maximum-scale="+u+",minimum-scale="+u),r.documentElement.style.fontSize=a/2*s*n+"px"},e.exports=t["default"]}]);
      flex(100, 1);
    </script>
    <link href="app.css" rel="stylesheet">
</head>
<body>
  <section id="bg">
    <div class="top animated slideInDown"></div>
    <div class="left animated slideInLeft"></div>
    <div class="right animated slideInRight"></div>
    <div class="bottom animated slideInUp"></div>
  </section>

  <div class="scenes">
    <section class="scene" id="scene0">
      <div id="logo"></div>
      <img src="./vendor/img/welcome.png" class="welcome">
      <img src="./vendor/img/names.png" class="names">
      <img src="./vendor/img/time.png" class="time">
      <img src="./vendor/img/address.png" class="address">
    </section>

    <section class="scene" id="scene1">
      <img src="./vendor/img/chloe-flower.png" class="chloe">
      <div class="pop"><span>听说夸克要结婚啦？！</span></div>
    </section>

    <section class="scene" id="scene2">
      <img src="./vendor/img/quark-flower.png" class="quark">
      <div class="pop"><span>听说小帅要结婚啦？！</span></div>
    </section>

    <section class="scene" id="scene3">
      <img src="./vendor/img/group-flower.png" class="group">
      <div class="pop"><span>听说跨克和小帅 <br> 都要结婚啦？！</span></div>
    </section>

    <section class="scene" id="scene4">
      <div class="pop"><span>是的！</span></div>
    </section>

    <section class="scene" id="scene5">
      <div class="white">
        <img src="./vendor/img/arrow-down.png" class="arrow-down">
        <img src="./vendor/img/invite.png" class="invite animated fadeIn">
        <a href="https://3gimg.qq.com/lightmap/v1/marker/index.html?type=0&marker=coord:30.24892,120.13039;coordtype:5;title:%E6%9D%AD%E5%B7%9E%E9%87%91%E6%BA%AA%E5%B1%B1%E5%BA%84;addr:%E6%9D%8E%E5%85%83%E8%B6%85%20%E5%92%8C%20%E5%94%90%E5%B8%85%E4%BD%B6%20%E8%AF%9A%E6%8C%9A%E9%82%80%E8%AF%B7">
          <img src="./vendor/img/map-hangzhou.png" class="map animated fadeIn" >
        </a>
        <p>2017年10月14日15时38分 <br> 杭州金溪山庄湖边小草坪见</p>
      </div>
    </section>
  </div>

  <script src="./vendor/zepto.min.js"></script>
  <script src="./vendor/two.min.js"></script>
  <script type="text/javascript" src="app.js"></script>
  <script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>

  <script>
function writeObj(obj){
 var description = "";
 for(var i in obj){
 var property=obj[i];
 description+=i+" = "+property+"\n";
 }
 alert(description);
}
  // 注意：所有的JS接口只能在公众号绑定的域名下调用，公众号开发者需要先登录微信公众平台进入“公众号设置”的“功能设置”里填写“JS接口安全域名”。
  // 如果发现在 Android 不能分享自定义内容，请到官网下载最新的包覆盖安装，Android 自定义分享接口需升级至 6.0.2.58 版本及以上。
  // 完整 JS-SDK 文档地址：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
  var unit_title='李元超&唐帅佶婚礼邀请';
  var unit_content='杭州金溪山庄湖边小草坪见';
  var unit_link='http://www.h-rock.com/marry/index.php';
  var unit_image='http://www.h-rock.com/marry/vendor/img/group-flower.png';
  wx.config({
    appId: '<?php echo $signPackage["appId"];?>',
    timestamp: <?php echo $signPackage["timestamp"];?>,
    nonceStr: '<?php echo $signPackage["nonceStr"];?>',
    signature: '<?php echo $signPackage["signature"];?>',
    jsApiList: [
    'onMenuShareTimeline',
    'onMenuShareAppMessage'
      // 所有要调用的 API 都要加到这个列表中
    ]
  });
  wx.ready(function () {
    // 在这里调用 API

    wx.checkJsApi({
        jsApiList: ['onMenuShareAppMessage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
        success: function(res) {
           // writeObj(res.checkResult);
            // 以键值对的形式返回，可用的api值true，不可用为false
            // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
        }
    });
    wx.onMenuShareTimeline({
        title: unit_title, // 分享标题
        link: unit_link, // 分享链接
        desc: unit_content, // 分享描述
        imgUrl: unit_image, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });

    wx.onMenuShareAppMessage({
        title: unit_title, // 分享标题
        desc: unit_content, // 分享描述
        link: unit_link, // 分享链接
        imgUrl: unit_image, // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });

    wx.onMenuShareQQ({
        title: unit_title, // 分享标题
        desc: unit_content, // 分享描述
        link: unit_link, // 分享链接
        imgUrl: unit_image, // 分享图标
        success: function () {
           // 用户确认分享后执行的回调函数
        },
        cancel: function () {
           // 用户取消分享后执行的回调函数
        }
    });

    wx.onMenuShareWeibo({
        title: unit_title, // 分享标题
        desc: unit_content, // 分享描述
        link: unit_link, // 分享链接
        imgUrl: unit_image, // 分享图标
        success: function () {
           // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    wx.error(function(res){
       // writeObj(res);
    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    });
  });
</script>
</body>
</html>

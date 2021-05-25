
layui.define(['jquery','layer'],function(exports){

  var $ = layui.jquery , layer=layui.layer;
  var UrlParm = function () {
        var data, index;
        (function init() {
            data = [];
            index = {};
            var u = window.location.search.substr(1);
            if (u != '') {
                var parms = decodeURIComponent(u).split('&');
                for (var i = 0, len = parms.length; i < len; i++) {
                    if (parms[i] != '') {
                        var p = parms[i].split("=");
                        if (p.length == 1 || (p.length == 2 && p[1] == '')) {
                            data.push(['']);
                            index[p[0]] = data.length - 1;
                        } else if (typeof (p[0]) == 'undefined' || p[0] == '') {
                            data[0] = [p[1]];
                        } else if (typeof (index[p[0]]) == 'undefined') {
                            data.push([p[1]]);
                            index[p[0]] = data.length - 1;
                        } else {
                            data[index[p[0]]].push(p[1]);
                        }
                    }
                }
            }
        })();
        return {
            parm: function (o) {
                try {
                    return (typeof (o) == 'number' ? data[o][0] : data[index[o]][0]);
                } catch (e) {
                }
            },
            parmValues: function (o) {
                try {
                    return (typeof (o) == 'number' ? data[o] : data[index[o]]);
                } catch (e) { }
            },
            hasParm: function (parmName) {
                return typeof (parmName) == 'string' ? typeof (index[parmName]) != 'undefined' : false;
            },
            parmMap: function () {
                var map = {};
                try {
                    for (var p in index) { map[p] = data[index[p]]; }
                } catch (e) { }
                return map;
            }
        }
    } ();

  var str = " <img src=\"{img}\" alt=\"{alias}\">\n" +
      "  <i class=\"iconfont icon-renzheng\" title=\"猿圈社区\"></i>\n" +
      "  <h1>\n" +
      "    {alias}\n" +
      "    <i class=\"layui-badge fly-badge-vip\">{vipLevel}</i>\n" +
      "    <span id='is_manager' style=\"color:#c00;\">(管理员)</span>\n" +
      "  </h1>\n" +
      "\n" +
      "  <p style=\"padding: 10px 0; color: #5FB878;\">认证信息: {authenticate}</p>\n" +
      "\n" +
      "  <p class=\"fly-home-info\">\n" +
      "    <i class=\"iconfont icon-kiss\" title=\"飞吻\"></i><span style=\"color: #FF7200;\">{accumulatePoints} 飞吻</span>\n" +
      "    <i class=\"iconfont icon-shijian\"></i><span>{registerTime} 加入</span>\n" +
      "    <i class=\"iconfont icon-chengshi\"></i><span>来自人界</span>\n" +
      "  </p>\n" +
      "<!--  <p class=\"fly-home-sign\">(人生仿若一场修行)</p>-->\n" +
      "\n" +
      "  <div class=\"fly-sns\" data-user=\"\">\n" +
      "    <a href=\"javascript:;\" class=\"layui-btn layui-btn-primary fly-imActive\" data-type=\"addFriend\">加为好友</a>\n" +
      "    <a href=\"javascript:;\" class=\"layui-btn layui-btn-normal fly-imActive\" data-type=\"chat\">发起会话</a>\n" +
      "  </div>";

  var sendPort = "<li>\n" +
      "            <span class=\"fly-jing {isEssence}\">精</span>\n" +
      "            <a href=\"/jie/detail.html?classId={classId}&id={portId}\" class=\"jie-title\">{name}</a>\n" +
      "            <i>{createTime}</i>\n" +
      "            <em class=\"layui-hide-xs\">答:{replyNumber}</em>\n" +
      "          </li>";
  if(layui.cache.user.state == 1 ||UrlParm.parm("alias")){
      getUserHome();
  }
  function userPort() {
      $.ajax({
          url: "/api/user/lastSendPort",
          type: "post",
          dataType: "json",
          async: false,
          data: {
              'alias':UrlParm.parm("alias")?UrlParm.parm("alias"):layui.cache.user.alias
          },
          error:function(res){
              layer.msg('异常' ,{shift: 6});
          },
          success:function(res){
              if(res.length > 0){
                    $("#lastSendPortNone").remove();
                    for(var x = 0;x <res.length;x++){
                        var data = res[x];
                       var rt = sendPort.replace(/{classId}/g,data.classId)
                            .replace(/{portId}/g,data.id)
                            .replace(/{name}/g,data.name)
                            .replace(/{createTime}/g,data.createTime)
                            .replace(/{replyNumber}/g,data.replyNumber)
                            .replace(/{isEssence}/g,data.isEssence?'isEssenceTrue':'isEssenceFalse');
                        $("#lastSendPort").append(rt);
                    }
                  $(".isEssenceFalse").remove();
              }
          }
      });
  }
    function userReply() {
        $.ajax({
            url: "/api/user/lastReplyPort",
            type: "post",
            dataType: "json",
            async: false,
            data: {
                'alias':UrlParm.parm("alias")?UrlParm.parm("alias"):layui.cache.user.alias
            },
            error:function(res){
                layer.msg('异常' ,{shift: 6});
            },
            success:function(res){
                if(res && res.length > 0){
                    $("#lastReplyPortNone").remove();
                    for(var x = 0;x <res.length;x++){
                        var data = res[x];
                        var rt = sendPort.replace(/{classId}/g,data.classId)
                            .replace(/{portId}/g,data.id)
                            .replace(/{name}/g,data.name)
                            .replace(/{createTime}/g,data.createTime)
                            .replace(/{replyNumber}/g,data.replyNumber)
                            .replace(/{isEssence}/g,data.isEssence?'isEssenceTrue':'isEssenceFalse');
                        $("#lastReplyPort").append(rt);
                    }
                    $(".isEssenceFalse").remove();
                }
            }
        });
    }

  function getUserHome(){
      $.ajax({
          url: "/api/user/home",
          type: "post",
          dataType: "json",
          async: false,
          data: {
              'alias':UrlParm.parm("alias")?UrlParm.parm("alias"):layui.cache.user.alias
          },
          error:function(res){
              layer.msg('异常' ,{shift: 6});
          },
          success:function(res){
              if(res.id){
                 var rt =  str.replace(/{img}/g,res.img)
                      .replace(/{alias}/g,(res.state == 1?res.alias:"此号已封"))
                      .replace(/{vipLevel}/g,res.vipLevel)
                      .replace(/{authenticate}/g,res.authenticate?res.authenticate:'无')
                      .replace(/{accumulatePoints}/g,res.accumulatePoints)
                      .replace(/{registerTime}/g,res.registerTime);
                  $("#user_home").html(rt);
                  if(!res.isManager){
                      $("#is_manager").remove();
                  }
                  if(res.state == 1){
                      userPort();
                      userReply();
                  }
              } else {
                  layer.msg('异常',{shift: 6});
              }
          }
      });
  }

  exports('userHome', null);
});
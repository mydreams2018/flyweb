
layui.define('jquery', function(exports){

  var $ = layui.jquery;
 var currentUser = {
     account: '游客'
   ,state: 0
   ,img: '/api/userImg/default.jpg'
   ,accumulatePoints: 0
 };
 var str = " <li class=\"layui-nav-item\">\n" +
     "        <a class=\"iconfont icon-touxiang layui-hide-xs\" href=\"/user/login.html\"></a>\n" +
     "      </li>\n" +
     "      <li class=\"layui-nav-item\">\n" +
     "        <a href=\"/user/login.html\">登入</a>\n" +
     "      </li>\n" +
     "      <li class=\"layui-nav-item\">\n" +
     "        <a href=\"/user/reg.html\">注册</a>\n" +
     "      </li>\n" +
     "      <li class=\"layui-nav-item layui-hide-xs\">\n" +
     "        <a href=\"/api/auth/qq\" onclick=\"layer.msg('正在通过QQ登入', {icon:16, shade: 0.1, time:0})\" title=\"QQ登入\" class=\"iconfont icon-qq\"></a>\n" +
     "      </li>\n" +
     "      <li class=\"layui-nav-item layui-hide-xs\">\n" +
     "        <a href=\"#\" onclick=\"layer.msg('还在开发中', {icon:16, shade: 0.1, time:2000})\" title=\"微博登入\" class=\"iconfont icon-weibo\"></a>\n" +
     "      </li>";
 layui.cache.user = currentUser;
  $.ajax({
    url: "/api/getCurrentUser",
    type: "get",
      async: false,
    success: function (data) {
      if(!data.toString().match('<!DOCTYPE html>')){
          layui.cache.user = data;
          $("#userAlias").text(data.alias);
          $("#authenticate").attr('title','认证信息：'+(data.authenticate?data.authenticate:'无'));
          $("#vipLevel").text(data.vipLevel);
          $("#userImg").attr('src',data.img);
      }else{
          $('#current-account').empty();
          $("#current-account").html(str);
      }
    },
    error: function () {
        $('#current-account').empty();
        $("#current-account").html(str);
    }
  });
  exports('account', null);
});
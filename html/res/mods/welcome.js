
layui.define('jquery', function(exports){
  var $ = layui.jquery;

  var str = " <div class=\"fly-panel-title\">\n" +
      "          签到\n" +
      "          <i class=\"fly-mid\"></i> \n" +
      "          <a href=\"javascript:;\" class=\"fly-link\" id=\"LAY_signinHelp\">说明</a>\n" +
      "          <span class=\"fly-signin-days\">已连续签到<cite>{accumulateSign}</cite>天</span>\n" +
      "        </div>\n";

  if(layui.cache.user.state == 1){
      $.ajax({
          url: "/api/userSign/selectByPrimaryKey",
          type: "post",
          async: false,
          success: function (data) {
            if(data && data.accumulateSign > 0){
                if(data.currentSign){
                    str +=" <div class=\"fly-panel-main fly-signin-main\">\n" +
                        "          <button class=\"layui-btn layui-btn-disabled\">今日已签到</button>\n" +
                        "          <span>获得了<cite>{countSign}</cite>飞吻</span>\n" +
                        "        </div>";
                }else{
                    str = str +" <div class=\"fly-panel-main fly-signin-main\">\n" +
                        "          <button class=\"layui-btn layui-btn-danger\" id=\"LAY_signin\">今日签到</button>\n" +
                        "          <span>可获得<cite>{countSign}</cite>飞吻</span>\n" +
                        "        </div>";
                }
                $("#user_signcount").empty();
                var countSign ;
                if(data.accumulateSign >= 30){
                    countSign = 30;
                }else if(data.accumulateSign >= 15){
                    countSign = 15;
                }else if(data.accumulateSign >= 5){
                    countSign = 10;
                }else{
                    countSign = 5;
                }
                var rt = str.replace(/{accumulateSign}/g,data.accumulateSign)
                    .replace(/{countSign}/g,countSign);
                $("#user_signcount").html(rt);
            }
          }
      });
  }else{
      $("#LAY_signin").removeClass("layui-btn-danger");
      $("#LAY_signin").addClass("layui-btn-disabled");
  }

  var userReply = " <dd>\n" +
      "      <a href=\"/user/home.html?alias={userAlias}\">\n" +
      "      <img src=\"{userImg}\"><cite>{userAlias}</cite><i>{replyNumber}次回答</i>\n" +
      "      </a>\n" +
      "    </dd>";
  $.ajax({
        url: "/api/userReplyPort/selectAll",
        type: "post",
        async: false,
        success: function (data) {
            if(data && data.length > 0){
                for(var x=0;x<data.length;x++){
                    var replyRt = userReply.replace(/{userAlias}/g,data[x].alias)
                        .replace(/{userImg}/g,data[x].userImg)
                        .replace(/{replyNumber}/g,data[x].replyNumber);
                    $("#user_replyPort").append(replyRt);
                }
            }
        }
  });
  exports('welcome', null);
});
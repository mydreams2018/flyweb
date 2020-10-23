
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
    var portData = " <li>\n" +
        "            <a href=\"/user/home.html?alias={userAlias}\" class=\"fly-avatar\">\n" +
        "              <img src=\"{userImg}\" alt=\"{userAlias}\">\n" +
        "            </a>\n" +
        "            <h2>\n" +
        "              <a class=\"layui-badge\">动态</a>\n" +
        "              <a href=\"/jie/detail.html?classId=1&id={portId}\">{portTitle}</a>\n" +
        "            </h2>\n" +
        "            <div class=\"fly-list-info\">\n" +
        "              <a href=\"/user/home.html?alias={userAlias}\" link>\n" +
        "                <cite>{userAlias}</cite>\n" +
        "                <i class=\"iconfont icon-renzheng\" title=\"认证信息:{authenticate}\"></i>\n" +
        "                <i class=\"layui-badge fly-badge-vip\">{vipLevel}</i>\n" +
        "              </a>\n" +
        "              <span>{createTime}</span>\n" +
        "              <span class=\"fly-list-kiss layui-hide-xs\" title=\"悬赏飞吻\"><i class=\"iconfont icon-kiss\"></i>{experience}</span>\n" +
        "              <span class=\"layui-badge fly-badge-accept layui-hide-xs\">{portState}</span>\n" +
        "              <span class=\"fly-list-nums\"> \n" +
        "                <i class=\"iconfont icon-pinglun1\" title=\"回答\"></i>{replyNumber}\n" +
        "              </span>\n" +
        "            </div>\n" +
        "            <div class=\"fly-list-badge\">\n" +
        "              <span class=\"layui-badge layui-bg-red\">精帖</span>\n" +
        "            </div>\n" +
        "          </li>";
  function dataPorts(order){
      $("#kungreatPort").empty();
      $.ajax({
          url: "/api/report/queryReport",
          type: "post",
          async: false,
          data: {
              'classId':1,
              'orderType':order,
              'userAccount':'kungreat',
              'currentPage':1,
              'pageSize':8
          },
          success: function (data) {
              if(data && data.datas.length > 0){
                  var dt = data.datas;
                  for(var x=0;x<dt.length;x++){
                     var ps =  portData.replace(/{userAlias}/g,dt[x].alias)
                          .replace(/{userImg}/g,dt[x].userImg)
                          .replace(/{replyNumber}/g,dt[x].replyNumber)
                          .replace(/{portId}/g,dt[x].id)
                          .replace(/{portTitle}/g,dt[x].name)
                          .replace(/{authenticate}/g,dt[x].authenticate?dt[x].authenticate:"无")
                          .replace(/{vipLevel}/g,dt[x].vipLevel)
                          .replace(/{createTime}/g,dt[x].createTime)
                          .replace(/{experience}/g,dt[x].experience)
                          .replace(/{portState}/g,dt[x].portState);
                     $("#kungreatPort").append(ps);
                  }
              }
          }
      });
  };
  $("#order_new").on("click",function (data) {
      $("#order_replyNum").removeClass("layui-this");
      $("#order_new").addClass("layui-this");
      dataPorts("create_time");
  });
    $("#order_replyNum").on("click",function (data) {
        $("#order_new").removeClass("layui-this");
        $("#order_replyNum").addClass("layui-this");
        dataPorts("reply_number");
    });
    dataPorts("create_time");
    exports('welcome', null);
});
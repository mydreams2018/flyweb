
layui.define(['jquery','layer'], function(exports){
  var $ = layui.jquery
      ,layer=layui.layer;

    var classIddata = UrlParm.parm('classId');
    var currentPage = UrlParm.parm('currentPage')?UrlParm.parm('currentPage'):1;
    if(classIddata){
        switch (classIddata) {
            case '1':
                layui.$("#htmlBack").addClass("layui-this");
                break;
            case '2':
                layui.$("#htmlFront").addClass("layui-this");
                break;
            case '3':
                layui.$("#htmlData").addClass("layui-this");
                break;
            case '4':
                layui.$("#htmlComplex").addClass("layui-this");
                break;
        }
    };
    var portUser ;
    var Htmldetails = "     <li data-id=\"{dataId}\" class=\"jieda-daan\">\n" +
        "            <div class=\"detail-about detail-about-reply\">\n" +
        "              <a class=\"fly-avatar\" href=\"/user/home.html?account={userAccount}\">\n" +
        "                <img src=\"{userImg}\" alt=\"{alias}\">\n" +
        "              </a>\n" +
        "              <div class=\"fly-detail-user\">\n" +
        "                <a href=\"/user/home.html?account={userAccount}\" class=\"fly-link\">\n" +
        "                  <cite>{alias}</cite>\n" +
        "                  <i class=\"iconfont icon-renzheng\" title=\"认证信息：{authenticate}\"></i>\n" +
        "                  <i class=\"layui-badge fly-badge-vip\">{vipLevel}</i>              \n" +
        "                </a>\n" +
        "                \n" +
        "                <span id='{is_currentUser}'>(楼主)</span>\n" +
        "                <span id='{is_manager}' style=\"color:#5FB878\">(管理员)</span>\n" +
        "\n"+
        "              </div>\n" +
        "\n" +
        "              <div class=\"detail-hits\">\n" +
        "                <span>{createData}</span>\n" +
        "              </div>\n" +
        "\n" +
        "              <i id='{is_adoption}' class=\"iconfont icon-caina\" title=\"最佳答案\"></i>\n" +
        "            </div>\n" +
        "            <div class=\"detail-body jieda-body photos\">\n" +
        " {detailsText}\n" +
        "            </div>\n" +
        "            <div class=\"jieda-reply\">\n" +
        "              <span class=\"jieda-zan zanok\" type=\"zan\">\n" +
        "                <i class=\"iconfont icon-zan\"></i>\n" +
        "                <em>{likeNumber}</em>\n" +
        "              </span>\n" +
        "              <span type=\"reply\">\n" +
        "                <i class=\"iconfont icon-svgmoban53\"></i>\n" +
        "                回复\n" +
        "              </span>\n" +
        "              <div class=\"jieda-admin\">\n" +
        "                <span id='{is_edit}' type=\"edit\">编辑</span>\n" +
        "                <span id='{is_delete}' type=\"del\">删除</span>\n" +
        "                <span id='{adoption}' class=\"jieda-accept\" type=\"accept\">采纳</span>\n" +
        "              </div>\n" +
        "            </div>\n" +
        "          </li>";
//查回贴
    function getPortDetails() {
        $.ajax({
            url: "/api/detailsText/queryDetails",
            type: "post",
            dataType: "json",
            async: false,
            data: {
                "classId": classIddata,
                "portId": UrlParm.parm('id'),
                'currentPage':currentPage
            },
            success: function (data) {
                $("#jieda").empty();
                if(data.datas.length > 0){
                    for(var x=0;x <data.datas.length;x++){
                        var resData = data.datas[x];
                        var rt = Htmldetails.replace(/{dataId}/g,resData.id)
                            .replace(/{userAccount}/g,resData.userAccount)
                            .replace(/{userImg}/g,resData.userImg)
                            .replace(/{alias}/g,resData.alias)
                            .replace(/{authenticate}/g,resData.authenticate)
                            .replace(/{vipLevel}/g,resData.vipLevel)
                            .replace(/{createData}/g,resData.createData)
                            .replace(/{detailsText}/g,contentMy(resData.detailsText))
                            .replace(/{likeNumber}/g,resData.likeNumber)
                            .replace(/{is_adoption}/g,"is_adoption"+x)
                            .replace(/{is_currentUser}/g,"is_currentUser"+x)
                            .replace(/{is_manager}/g,"is_manager"+x)
                            .replace(/{is_edit}/g,"is_edit"+x)
                            .replace(/{is_delete}/g,"is_delete"+x)
                            .replace(/{adoption}/g,"adoption"+x);
                        $("#jieda").append(rt);
                        if(!resData.isAdoption){
                            $("#is_adoption"+x).remove();
                        }
                        if(portUser.userAccount != resData.userAccount){
                            $("#is_currentUser"+x).remove();
                        }
                        if(!resData.isManager){
                            $("#is_manager"+x).remove();
                        }
                        if(layui.cache.user.state != 1){
                            $("#is_edit"+x).remove();
                            $("#is_delete"+x).remove();
                            $("#adoption"+x).remove();
                        }else{
                            if(portUser.userAccount != layui.cache.user.account
                                || portUser.portState == "已结"){
                                $("#adoption"+x).remove();
                            }
                            if(layui.cache.user.account != resData.userAccount){
                                if(!layui.cache.user.isManager){
                                    $("#is_delete"+x).remove();
                                }
                                $("#is_edit"+x).remove();
                            }
                        }
                    }
                }else{
                    $("#jieda").html("<li class=\"fly-none\">消灭零回复</li>");
                }
                document.getElementById("lastPaging").setAttribute("data-id",data.page.lastPage);
                document.getElementById("nextPaging").setAttribute("data-id",data.page.nextPage);
                document.getElementById("endPaging").setAttribute("data-id",data.page.endPage);
                document.getElementById("curPaging").setAttribute("data-id",data.page.currentPage);
                document.getElementById("curPaging").innerText=data.page.currentPage+'/'+data.page.endPage;
            },
            error: function (data) {
                $("#jieda").html("<li class=\"fly-none\">消灭零回复</li>");
            }
        });
    }
    // 查主贴
    $.ajax({
        url: "/api/report/selectByPrimaryKey",
        type: "post",
        dataType: "json",
        async: false,
        data: {
            "classId":classIddata,
            "id": UrlParm.parm('id')
        },
        success: function (data) {
            if(data.id){
                portUser = data;
                $("#htmlTitle").text(data.name);
                var str = "";
                if(data.portState =="未结"){
                    str = str + "<span class=\"layui-badge\" style=\"background-color: #999;\">未结</span>\n";
                };
                if(data.portState =="已结"){
                    str = str + "  <span id=\"\" class=\"layui-badge\" style=\"background-color: #5FB878;\">已结</span> \n";
                };
                if(data.isTop){
                    str = str +"    <span class=\"layui-badge layui-bg-black\">置顶</span>\n";
                };
                if(data.isEssence){
                    str = str +  "  <span class=\"layui-badge layui-bg-red\">精帖</span>\n";
                };
                str = str +   "    <span class=\"fly-list-nums\"> \n" +
                    "            <a href=\"#comment\"><i class=\"iconfont\" title=\"回答\">&#xe60c;</i>{replyNumber}</a>\n" +
                    "            <i class=\"iconfont\" title=\"人气\">&#xe60b;</i>{lookNumber}\n" +
                    "          </span>";
                var rt = str.replace(/{replyNumber}/g,data.replyNumber).replace(/{lookNumber}/g,data.lookNumber);
                $("#portHead").html(rt);
                str = "  <a class=\"fly-avatar\" href=\"/user/home.html?account={userAccount}\">\n" +
                    "            <img src=\"{userImg}\" alt=\"{alias}\">\n" +
                    "          </a>\n" +
                    "          <div class=\"fly-detail-user\">\n" +
                    "            <a href=\"/user/home.html?account={userAccount}\" class=\"fly-link\">\n" +
                    "              <cite>{alias}</cite>\n" +
                    "              <i class=\"iconfont icon-renzheng\" title=\"认证信息：{authenticate}\"></i>\n" +
                    "              <i class=\"layui-badge fly-badge-vip\">{vipLevel}</i>\n" +
                    "            </a>\n" +
                    "            <span>{createTime}</span>\n" +
                    "          </div>\n" +
                    "          <div class=\"detail-hits\" id=\"LAY_jieAdmin\" data-id=\"{portId}\">\n" +
                    "            <span style=\"padding-right: 10px; color: #ff7200\">悬赏：{experience}飞吻</span>  \n" +
                    "            <span id='editPort' class=\"layui-btn layui-btn-xs jie-admin\" type=\"edit\"><a href=\"/user/edit.html?classId={classId}&id={portId}\">编辑此贴</a></span>\n" +
                    "          </div>";
                rt = str.replace(/{userAccount}/g,data.userAccount).replace(/{userImg}/g,data.userImg)
                    .replace(/{alias}/g,data.alias).replace(/{authenticate}/g,data.authenticate?data.authenticate:'无')
                    .replace(/{vipLevel}/g,data.vipLevel).replace(/{createTime}/g,data.createTime)
                    .replace(/{portId}/g,data.id).replace(/{experience}/g,data.experience).replace(/{classId}/g,classIddata);
                $("#aboutUser").html(rt);
                if(layui.cache.user.account != data.userAccount){
                    $("#editPort").remove();
                };
                $("#detailBody").html(contentMy(data.details.detailsText));
                getPortDetails();
            }else{
                window.location.href='/404.html';
            }
        },
        error: function (data) {
            window.location.href='/404.html';
        }
    });

    function escapeMY(html){
        return String(html||'').replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
            .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
    };
    function contentMy(content){
        var html = function(end){
            return new RegExp('\\n*\\['+ (end||'') +'(pre|hr|div|span|p|table|thead|th|tbody|tr|td|ul|li|ol|li|dl|dt|dd|h2|h3|h4|h5)([\\s\\S]*?)\\]\\n*', 'g');
        };
        content = escapeMY(content||'') //XSS
            .replace(/img\[([^\s]+?)\]/g, function(img){  //转义图片
                return '<img src="' + img.replace(/(^img\[)|(\]$)/g, '') + '">';
            }).replace(/@(\S+)(\s+?|$)/g, '@<a href="javascript:;" class="fly-aite">$1</a>$2') //转义@
            .replace(/face\[([^\s\[\]]+?)\]/g, function(face){  //转义表情
                var alt = face.replace(/^face/g, '');
                return '<img alt="'+ alt +'" title="'+ alt +'" src="' + fly.faces[alt] + '">';
            }).replace(/a\([\s\S]+?\)\[[\s\S]*?\]/g, function(str){ //转义链接
                var href = (str.match(/a\(([\s\S]+?)\)\[/)||[])[1];
                var text = (str.match(/\)\[([\s\S]*?)\]/)||[])[1];
                if(!href) return str;
                var rel =  /^(http(s)*:\/\/)\b(?!(\w+\.)*(sentsin.com|layui.com))\b/.test(href.replace(/\s/g, ''));
                return '<a href="'+ href +'" target="_blank"'+ (rel ? ' rel="nofollow"' : '') +'>'+ (text||href) +'</a>';
            }).replace(html(), '\<$1 $2\>').replace(html('/'), '\</$1\>') //转移HTML代码
            .replace(/\n/g, '<br>') //转义换行
        return content;
    };

    exports('details', null);
});
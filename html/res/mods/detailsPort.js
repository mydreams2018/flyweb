
layui.define(['jquery','layer'], function(exports){
  var $ = layui.jquery
      ,layer=layui.layer;

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

    var classIddata = UrlParm.parm('classId');
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
    $.ajax({
        url: "/api/report/selectByPrimaryKey",
        type: "post",
        data: {
            "classId":classIddata,
            "id": UrlParm.parm('id')
        },
        success: function (data) {
            if(data.id){
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
            }else{
                layer.msg("数据请求出错", {shift: 6});
            }
        },
        error: function (data) {
            layer.msg('数据请求出错', {shift: 6});
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
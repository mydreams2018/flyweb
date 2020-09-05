
layui.define(['jquery','layer'], function(exports){
  var $ = layui.jquery;
    $.ajax({
        url: "/api/clearAll",
        type: "get",
        async: false,
        success: function (data) {
            layui.layer.msg(data.msg, {shift: 6});
        }
    })
    exports('exit', null);
});
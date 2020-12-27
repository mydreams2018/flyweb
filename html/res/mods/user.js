/**

 @Name: 用户模块

 */
 
layui.define(['fly', 'element'], function(exports){

  var $ = layui.jquery;
  var layer = layui.layer;
  var form = layui.form;
  var fly = layui.fly;
  var element = layui.element;
  var upload = layui.upload;

  var gather = {}, dom = {
    mine: $('#LAY_mine')
    ,mineview: $('.mine-view')
    ,minemsg: $('#LAY_minemsg')
  };

  //我的相关数据
  var elemUCM = $('#LAY_ucm');
  gather.minelog = {};

  //显示当前tab
  if(location.hash){
    element.tabChange('user', location.hash.replace(/^#/, ''));
  }

  element.on('tab(user)', function(){
    var othis = $(this), layid = othis.attr('lay-id');
    if(layid){
      location.hash = layid;
    }
  });

  //上传图片
  if($('.upload-img')[0]){
      var avatarAdd = $('.avatar-add');
      upload.render({
        elem: '.upload-img'
        ,url: '/api/user/uploadImg'
        ,size: 500
        ,accept: 'images'
        ,before: function(){
          avatarAdd.find('.loading').show();
        }
        ,done: function(res){
          if(res.status == 1){
            window.location.reload();
          } else {
            layer.msg(res.msg, {icon: 5});
          }
          avatarAdd.find('.loading').hide();
        }
        ,error: function(){
          avatarAdd.find('.loading').hide();
        }
      });
  }

  //提交成功后刷新
  fly.form['set-mine'] = function(data, required){
    layer.msg('修改成功', {
      icon: 1
      ,time: 1000
      ,shade: 0.1
    }, function(){
      location.reload();
    });
  }

  //帐号绑定
  $('.acc-unbind').on('click', function(){
    var othis = $(this), type = othis.attr('type');
    layer.confirm('整的要解绑'+ ({
      qq_id: 'QQ'
      ,weibo_id: '微博'
    })[type] + '吗？', {icon: 5}, function(){
      fly.json('/api/unbind', {
        type: type
      }, function(res){
        if(res.status == 1){
          layer.alert('已成功解绑。', {
            icon: 1
            ,end: function(){
              location.reload();
            }
          });
        } else {
          layer.msg(res.msg);
        }
      });
    });
  });


  //我的消息
  gather.minemsg = function(){
    var messageStr = "<ul class=\"mine-msg\">\n" +
        "            <li data-id=\"{id}\">\n" +
        "              <blockquote class=\"layui-elem-quote\">\n" +
        "              <a href=\"/user/home.html?alias={alias}\" target=\"_blank\"><cite>{alias}</cite></a>@回答了您<a target=\"_blank\" href=\"/jie/detail.html?classId={classId}&id={portId}\"><cite>查看贴子详情</cite></a>\n" +
        "              </blockquote>\n" +
        "              <p><span>{receiveDate}</span><a href=\"javascript:;\" class=\"layui-btn layui-btn-small layui-btn-danger fly-delete\">查看</a></p>\n" +
        "            </li>\n" +
        "          </ul>"
      ,delEnd = function(clear){
        if(clear || dom.minemsg.find('.mine-msg li').length == 0){
        dom.minemsg.html('<div class="fly-none">您暂时没有最新消息</div>');
        }
      }
      ,deldataMsg = 0
      ,resDataTemp = null
      ,queryMessage = function(){
      //查询@信息
         $.ajax({
          url: "/api/userMessage/selectAll",
          type: "post",
          async: false,
          success: function (res) {
            dom.minemsg.empty();
            resDataTemp = null;
            deldataMsg = 0;
           if(res && !res.toString().match('<!DOCTYPE html>') &&res.length > 0){
              for(var x=0;x<res.length;x++) {
                var resData = res[x];
                var rt = messageStr.replace(/{classId}/g,resData.classId).replace(/{id}/g,resData.id)
                  .replace(/{alias}/g,resData.srcAlias).replace(/{portId}/g,resData.portId)
                  .replace(/{receiveDate}/g,resData.receiveDate);
                dom.minemsg.append(rt);
                deldataMsg++;
              }
             resDataTemp = res;
            }else{
              delEnd(true);
           }
          },
          error: function () {
          layer.msg("获得数据出错", {icon: 5});
          delEnd(true);
          }
         });
      };
    //阅读
    dom.minemsg.on('click', '.mine-msg li .fly-delete', function(){
      var othis = $(this).parents('li'), id = othis.data('id');
      console.log('阅读');
      if(id && resDataTemp && resDataTemp.length > 0){
          for(var x=0;x<resDataTemp.length ;x++){
             if(resDataTemp[x].id == id){
               $.ajax({
                 url: "/api/detailsText/selectByPrimaryKey",
                 type: "post",
                 async: false,
                 data:{
                   "id":resDataTemp[x].detailsId,
                   "classId":resDataTemp[x].classId
                 },
                 success: function (res) {
                    if(res && res.id && res.detailsText){
                      var detaieText = fly.content(res.detailsText);
                      layer.open({
                        type: 1
                        ,title: '预览'
                        ,shade: false
                        ,area: ['100%', '100%']
                        ,scrollbar: false
                        ,content: '<div class="detail-body" style="margin:20px;">'+ detaieText +'</div>'
                      });
                    }else{
                      layer.msg("获得数据出错", {icon: 5});
                    }
                 },
                 error: function () {
                   layer.msg("获得数据出错", {icon: 5});
                 }
               });
             }
          }
      }else{
        layer.msg("获得数据出错", {icon: 5});
      }
    });

    //删除全部
    $('#LAY_delallmsg').on('click', function(){
      if(deldataMsg > 0){
        layer.confirm('确定清空吗？', function(index){
          layer.close(index);
          $.ajax({
            url: "/api/userMessage/deleteByAccount",
            type: "post",
            async: false,
            data:{
              "deleteNum":deldataMsg
            },
            success: function (res) {
              queryMessage();
            }
          });
        });
      }
    });
    queryMessage();
  };

  dom.minemsg[0] && gather.minemsg();

  exports('user', null);
  
});
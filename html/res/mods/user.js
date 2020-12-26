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

    //阅读后删除
    dom.minemsg.on('click', '.mine-msg li .fly-delete', function(){
      var othis = $(this).parents('li'), id = othis.data('id');
      console.log('阅读后删除');
      // if(res.status == 1){
      //   othis.remove();
      //   delEnd();
      // }
    });

    //删除全部
    $('#LAY_delallmsg').on('click', function(){
      var othis = $(this);
      layer.confirm('确定清空吗？', function(index){
        layer.close(index);
        console.log('确定清空吗');
        // if(res.status == 1){
        //   othis.addClass('layui-hide');
        //   delEnd(true);
        // }
      });
    });

  };

  dom.minemsg[0] && gather.minemsg();

  exports('user', null);
  
});
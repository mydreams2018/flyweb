/**

 @Name: 求解板块

 */
 
layui.define('fly', function(exports){

  var $ = layui.jquery;
  var layer = layui.layer;
  var util = layui.util;
  var laytpl = layui.laytpl;
  var form = layui.form;
  var fly = layui.fly;
  
  var gather = {}, dom = {
    jieda: $('#jieda')
    ,content: $('#L_content')
    ,jiedaCount: $('#jiedaCount')
  };

  //监听专栏选择
  form.on('select(column)',function(obj){
    var value = obj.value
    ,tips = {
      tips: 1
      ,maxWidth: 250
      ,time: 30
    };
    for(var x=1;x<5;x++){
      $('#dataType'+x).addClass('layui-hide');
    }
    $('#dataType'+value).removeClass('layui-hide');
    layer.tips('你已选择', obj.othis, tips);
  });

  //求解管理
  gather.jieAdmin = {
    //删求解
    del: function(div){
      layer.confirm('确认删除该求解么？', function(index){
        layer.close(index);
      });
    }
    
    //设置置顶、状态
    ,set: function(div){
      var othis = $(this);
    }
  };

  $('body').on('click', '.jie-admin', function(){
    console.log(this);
    // var othis = $(this), type = othis.attr('type');
    // gather.jieAdmin[type] && gather.jieAdmin[type].call(this, othis.parent());
  });

  //解答操作
  gather.jiedaActive = {
    zan: function(li){ //赞
      if(layui.cache.user.state != 1){
        layer.msg("请先登录" ,{shift: 6});
        return ;
      }
      var othis = $(this);
      layui.$.ajax({
            url: "/api/detailsText/likeAccount",
            type: "post",
            dataType: "json",
            async: false,
            data: {
              id:li.data('id'),
              'classId':UrlParm.parm("classId")
            },
            error: function (res) {
              layer.msg(res.msg ,{shift: 6});
            },
            success: function(res){
              if(res.status == 1){
                var zans = othis.find('em').html()|0;
                othis['addClass']('zanok');
                othis.find('em').html(++zans);
              } else {
                layer.msg(res.msg ,{shift: 6});
              }
            }
      });
    }
    ,reply: function(li){ //回复
      console.log($(li[0]).attr('data-id'));
      var val = dom.content.val();
      var aite = '@'+ li.find('.fly-detail-user cite').text().replace(/\s/g, '');
      dom.content.focus()
      if(val.indexOf(aite) !== -1) return;
      dom.content.val(aite +' ' + val);
    }
    ,accept: function(li){ //采纳
      var othis = $(this);
      layer.confirm('是否采纳该回答为最佳答案？', function(index){
        layer.close(index);
        layui.$.ajax({
          url: "/api/detailsText/acceptReply",
          type: "post",
          dataType: "json",
          async: false,
          data: {
            id:li.data('id'),
            'classId':UrlParm.parm("classId")
          },
          error: function (res) {
            layer.msg(res.msg ,{shift: 6});
          },
          success: function(res){
            if(res.status == 1){
              $('.jieda-accept').remove();
              li.addClass('jieda-daan');
              li.find('.detail-about').append('<i class="iconfont icon-caina" title="最佳答案"></i>');
            } else {
              layer.msg(res.msg ,{shift: 6});
            }
          }
        });
      });
    }
    ,edit: function(li){ //编辑
      layui.$.ajax({
        url: "/api/detailsText/selectByPrimaryKey",
        type: "post",
        dataType: "json",
        async: false,
        data: {
          id:li.data('id'),
          'classId':UrlParm.parm("classId")
        },
        error: function (res) {
          layer.msg(res.msg ,{shift: 6});
        },
        success: function(res){
          if(res.id){
            layer.prompt({
              formType: 2
              ,value: res.detailsText
              ,maxlength: 100000
              ,title: '编辑回帖'
              ,area: ['728px', '300px']
              ,success: function(layero){
                fly.layEditor({
                  elem: layero.find('textarea')
                });
              }
            }, function(value, index){
              layer.close(index);
              layui.$.ajax({
                url: "/api/detailsText/updateByPrimaryKey",
                type: "post",
                dataType: "json",
                async: false,
                data: {
                  id:li.data('id'),
                  'classId':UrlParm.parm("classId"),
                  'detailsText':value
                },
                error: function (res) {
                  layer.msg(res.msg ,{shift: 6});
                },
                success: function(res){
                  if(res.status == 1){
                    li.find('.detail-body').html(fly.content(value));
                  } else {
                    layer.msg(res.msg ,{shift: 6});
                  }
                }
              });
            });
          }else{
            layer.msg('贴子异常' ,{shift: 6});
          }
        }
      });
    }
    ,del: function(li){ //删除
      layer.confirm('确认删除该回答么？', function(index){
        layer.close(index);
        layui.$.ajax({
          url: "/api/detailsText/deleteReplyPort",
          type: "post",
          dataType: "json",
          async: false,
          data: {
            id:li.data('id'),
            'classId':UrlParm.parm("classId")
          },
          error: function (res) {
            layer.msg(res.msg ,{shift: 6});
          },
          success: function(res){
            if(res.status == 1){
              li.remove();
            } else {
              layer.msg(res.msg ,{shift: 6});
            }
          }
        });
      });    
    }
  };

  $('.jieda-reply span').on('click', function(){
    var othis = $(this), type = othis.attr('type');
    gather.jiedaActive[type].call(this, othis.parents('li'));
  });


  //定位分页
  if(/\/page\//.test(location.href) && !location.hash){
    var replyTop = $('#flyReply').offset().top - 80;
    $('html,body').scrollTop(replyTop);
  }

  exports('jie', null);
});
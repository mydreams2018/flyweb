/**

 @Name: 精华

 */
 
layui.define(['fly'], function(exports){

  var $ = layui.jquery;
  var layer = layui.layer;
  var fly = layui.fly;

  var active = {
    //点赞
    praise: function(othis){
      var li = othis.parents('li')
      ,PRIMARY = 'layui-btn-primary'
      ,unpraise = !othis.hasClass(PRIMARY)
      ,numElem = li.find('.fly-case-nums')

      fly.json('/case/praise/', {
        id: li.data('id')
        ,unpraise: unpraise ? true : null
      }, function(res){
        numElem.html(res.praise);
        if(unpraise){
          othis.addClass(PRIMARY).html('点赞');
          layer.tips('少了个赞囖', numElem, {
            tips: 1
          });
        } else {
          othis.removeClass(PRIMARY).html('已赞');
          layer.tips('成功获得个赞', numElem, {
            tips: [1, '#FF5722']
          });
        }
      });
    }

    //查看点赞用户
    ,showPraise: function(othis){
      var li = othis.parents('li');
      if(othis.html() == 0) return layer.tips('该项目还没有收到赞', othis, {
        tips: 1
      });
      fly.json('/case/praise_user/', {
        id: li.data('id')
      }, function(res){
        var html = '';
        layer.open({
          type: 1
          ,title: '项目【'+ res.title + '】获得的赞'
          ,id: 'LAY_showPraise'
          ,shade: 0.8
          ,shadeClose: true
          ,area: '305px'
          ,skin: 'layer-ext-case'
          ,content: function(){
            layui.each(res.data, function(_, item){
              html += '<li><a href="/u/'+ 168*item.id +'/" target="_blank" title="'+ item.username +'"><img src="'+ item.avatar +'"></a></li>'
            });
            return '<ul class="layer-ext-ul">' + html + '</ul>';
          }()
        })
      });
    }
  };

  $('body').on('click', '.fly-case-active', function(){
    var othis = $(this), type = othis.data('type');
    active[type] && active[type].call(this, othis);
  });

  exports('case', {});
});
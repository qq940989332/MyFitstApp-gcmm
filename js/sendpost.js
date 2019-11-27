$(function(){
    var GroupId,LocationAttr = 0,Location = "",Linumber = 1;
    // 业务逻辑
    // 七牛上传
    var uploader = momoqiniu.setUp({
        'domain': 'http://q08a66e5d.bkt.clouddn.com/',
        'browse_btn': 'UpLoad',
        'uptoken_url': `${ip}c/uptoken/`,
        'success': function (up, file, info) {
            $(`<img src="${file.name}"></img></a>`).appendTo(".ImgContainer");
            up.refresh()
        }
    })
    // 发布按钮逻辑
    $("#TopBar input").click(function(){
        if(!GroupId) 
        {
            $(".Alerterror p").text("选圈子啊！傻逼");
                    $(".Alerterror").fadeIn("fast",function(){
                    setTimeout(() => {
                        $(".Alerterror").fadeOut("fast")
                    }, 1500);
                    });
            return
        }
        var TextData = $(".PostArea").text().trim();
        var img = JSON.stringify($(".ImgContainer").html())
        TextData = TextData.replace(/\n\n\n/g,"\n")
        TextData = TextData.replace(/\n/g,"</br>")
        if(LocationAttr == 1)
        Location = $(".AdressTop span").text()
        var JsonData = {
            content:TextData,
            images:img,
            group_id:GroupId,
            title:"测试",
            location:Location
        }
        console.log(JsonData)
        Myajax("POST",`${ip}add_post/`,JsonData).then(
            function(msg){
                if(msg.code == 302)
                {
                    $(".Alerterror p").text("请重新登陆");
                    $(".Alerterror").fadeIn("fast",function(){
                    setTimeout(() => {
                        $(".Alerterror").fadeOut("fast",function(){
                            window.location = "./login.html"
                        })
                    }, 1500);
                    });
                }
                else if(msg.code == 200)
                {
                    $(".Alertsuccess p").text("发布成功");
                    $(".Alertsuccess").fadeIn("fast",function(){
                    setTimeout(() => {
                        $(".Alertsuccess").fadeOut("fast",function(){
                            $(".PostArea").text("");
                            window.location = "./index.html";
                        })
                    }, 1500);
                    });
                }
                else
                {
                    $(".Alerterror p").text("你被禁言了");
                    $(".Alerterror").fadeIn("fast",function(){
                    setTimeout(() => {
                        $(".Alerterror").fadeOut("fast")
                    }, 1500);
                    });
                }
            },
            function(){
                $(".Alerterror p").text("请检查网络连接");
                $(".Alerterror").fadeIn("fast",function(){
                setTimeout(() => {
                    $(".Alerterror").fadeOut("fast")
                }, 1500);
                });
            }
        )
    })
    // 获取发布按钮的状态
    setInterval(() => {
        if($(".PostArea").text().trim() != "")
        $("#TopBar input").prop("disabled",false)
        else
        $("#TopBar input").prop("disabled",true)
    }, 100);
    // 限制最大区域和字数
    $(".PostArea").keyup(function () { 
        // console.log($(".PostArea").text().length)
        uploader.refresh();
        if($(".PostArea").text().length >= 300)
        {
        $(".PostArea").text($(".PostArea").text().substr(0,299))
        //定位光标到最后
        var _div = document.querySelector('.PostArea');
        var range = document.createRange();
        range.selectNodeContents(_div);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        }
    }); 
    //添加圈子查询页面
    $(".CircleTop").click(function(){
        $.ajax({
            type: "GET",
            url: `${ip}group/`,
            data: "",
            dataType: "json",
            success: function (msg) {
                if(msg.code == 200)
                {
                    if( Linumber !== msg.data.groups.length )
                    for(var n = 0;Linumber<=msg.data.groups.length;n++,Linumber++)
                    {
                        $(`<li>${msg.data.groups[n].group_name}</li>`)
                        .attr("groupid",msg.data.groups[n].group_id)
                        .appendTo(".CircleList ul");
                    }
                    $(".CircleList").slideDown("fast");
                }
                else
                {
                    $(".Alerterror p").text("获取列表失败");
                    $(".Alerterror").fadeIn("fast",function(){
                    setTimeout(() => {
                        $(".Alerterror").fadeOut("fast")
                    }, 1500);
                    });
                }
            }
        }); 
    })
    $(".PostContainer").on("click",".CircleList li",function(e){
        console.log(e.target)
        GroupId = e.target.getAttribute("groupid");
        $(".CircleTop span").text(e.target.innerText)
        $(".CircleList").slideUp("fast");
    })
    // 获取定位
    $(".AdressTop").click(function(ev){
		$(".AdressTop span").text("正在获取位置......");
		//创建百度地图控件
		var geolocation = new BMap.Geolocation();
		geolocation.getCurrentPosition(function(r){
			if(this.getStatus() == BMAP_STATUS_SUCCESS){
				//以指定的经度与纬度创建一个坐标点
                var pt = new BMap.Point(r.point.lng,r.point.lat);
                LocationAttr = 1;
				//创建一个地理位置解析器
				var geoc = new BMap.Geocoder();
				geoc.getLocation(pt, function(rs){//解析格式：城市，区县，街道
					var addComp = rs.addressComponents;
					$(".AdressTop span").text( addComp.province+", "+addComp.city + ", " + addComp.district);
				});    
			}
			else {
				$(".AdressTop span").text('定位失败');
			}        
		},{enableHighAccuracy: true})//指示浏览器获取高精度的位置，默认false
	});
    // 底部导航栏逻辑
    $("#Bottombar div:nth-child(1)").click(function(){
        window.location = "./index.html"
    })
    $("#Bottombar div:nth-child(3)").click(function(){
        window.location = "./profileindex.html"
    })
    
})
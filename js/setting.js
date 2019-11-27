$(function(){
    var OriginalUsername;
    Myajax("GET",`${ip}info/`).then(function(msg){
        console.log(msg)
        if(msg.code==200)
        {
            if(!msg.data.avatar) msg.data.avatar="./img/testicon.jpg"
            else if(!msg.data.background) msg.data.background=""
            $("#Icon img").attr("src",msg.data.avatar)
            $("input[name='username']").val(msg.data.username)
            OriginalUsername = msg.data.username
            $("input[name='sex']").val(msg.data.gender)
            $("input[name='signature']").val(msg.data.signature)
            $("#UpBackGround img").attr("src",msg.data.background)
        }
        else  
        {
            $(".Alerterror p").text("数据获取错误");
            $(".Alerterror").fadeIn("fast",function(){
            setTimeout(() => {
                $(".Alerterror").fadeOut("fast")
            }, 1500);
            });
        }
    },function(){
        $(".Alerterror p").text("请检查网络连接");
            $(".Alerterror").fadeIn("fast",function(){
            setTimeout(() => {
                $(".Alerterror").fadeOut("fast")
            }, 1500);
            });
    })
    var uploader1 = momoqiniu.setUp({
        'domain': 'http://q08a66e5d.bkt.clouddn.com/',
        'browse_btn': 'Icon',
        'uptoken_url': `${ip}c/uptoken/`,
        'success': function (up, file, info) {
            $("#Icon img").attr("src",file.name)
        }
    })
    var uploader2 = momoqiniu.setUp({
        'domain': 'http://q08a66e5d.bkt.clouddn.com/',
        'browse_btn': 'UpBackGround',
        'uptoken_url': `${ip}c/uptoken/`,
        'success': function (up, file, info) {
            $("#UpBackGround img").attr("src",file.name)
        }
    })
    // 顶端按钮逻辑
    $(".BackUp").click(function(){
        window.history.back()
    })
    // 发送按钮
    $(".Save").click(function(){
        if($(".AlertMsgError").attr("display") == "none")
        {
            $(".Alerterror p").text("填好信息！傻逼");
            $(".Alerterror").fadeIn("fast",function(){
            setTimeout(() => {
                $(".Alerterror").fadeOut("fast")
            }, 1500);
            });
        }
        else
        {
            var UpdateData = {
                username: $("input[name='username']").val(),
                gender:$("input[name='sex']").val(),
                signature: $("input[name='signature']").val(),
                avatar: $("#Icon img").attr("src"),
                background:$("#UpBackGround img").attr("src")
            }
            Myajax("POST",`${ip}update_info/`,UpdateData).then(
                function(msg){
                    if(msg.code==200)
                    {
                        $(".Alertsuccess p").text("修改成功");
                        $(".Alertsuccess").fadeIn("fast",function(){
                        setTimeout(() => {
                            $(".Alertsuccess").fadeOut("fast",function(){
                                window.location = "./profileindex.html";
                            })
                        }, 1500);
                        });
                    }
                    else{
                        $(".Alerterror p").text("修改失败");
                        $(".Alerterror").fadeIn("fast",function(){
                        setTimeout(() => {
                            $(".Alerterror").fadeOut("fast")
                        }, 1500);
                        });
                    }
                },function(){
                    $(".Alerterror p").text("请检查网络连接");
                        $(".Alerterror").fadeIn("fast",function(){
                        setTimeout(() => {
                            $(".Alerterror").fadeOut("fast")
                        }, 1500);
                        });
                }
            )
        }
    })
    // 修改信息文本框的逻辑
    $(".Message input[name = 'username']").focusout(function(){
        if($(this).val()!= OriginalUsername)
        {//对名字进行修改才会进行判断
            var tempUsername = {username:$(this).val()};
            $.ajax({
                type: "POST",
                url: `${ip}temp_username/`,
                data: tempUsername,
                dataType: "json",
                success: function (msg) {
                    if(msg.code!=200) 
                    {
                        $(".AlertMsgError:eq(1) span").text(msg.message);
                        $(".AlertMsgError:eq(1)").fadeIn("fast");
                    }
                    else $(".AlertMsgError:eq(1)").fadeOut("fast")
                }
            });
        }
    })
    $("input[name='sex']").focusout(function(){
        if($(this).val() != "MALE" && $(this).val() != "FEMALE")
        {
            $(".AlertMsgError:eq(2) span").text("请选择MALE、FEMALE");
            $(".AlertMsgError:eq(2)").fadeIn("fast");
        }
        else $(".AlertMsgError:eq(2)").fadeOut("fast")
    })
    $("input[name='signature']").keyup(function () { 
       if ($(this).val().length >20 )
       {
        $(".AlertMsgError:eq(3) span").text("个性签名最多20个字");
        $(".AlertMsgError:eq(3)").fadeIn("fast");
        $(this).val( $(this).val().slice(0,20))
       }
       else $(".AlertMsgError:eq(3)").fadeOut("fast");
    });
    // 注销按钮
    $(".LogoutButton").click(function(){
        sessionStorage.removeItem("user_id")
        sessionStorage.removeItem("token");
        window.location = "./login.html"
    })
})
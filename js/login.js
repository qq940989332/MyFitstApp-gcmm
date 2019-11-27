$(function(){
    $("#SignupButton").click(function () { 
        $(".FirstContainer").fadeOut("normal",function (){  
            $(".SignupContainer").fadeIn("normal");
        });
    });
    $("#LoginButton").click(function () { 
        $(".FirstContainer").fadeOut("normal",function (){  
            $(".LoginContainer").fadeIn("normal");
        });
        
    });
    $(".SignupContainer .backicon").click(function () {  
        $(".SignupContainer").fadeOut("normal",function (){  
            $(".FirstContainer").fadeIn("normal");
        });
        $(".SignupContainer input[type = 'text'],.SignupContainer input[type = 'password']").val("");
    }) 
    $(".LoginContainer .backicon").click(function () {  
        $(".LoginContainer").fadeOut("normal",function (){  
            $(".FirstContainer").fadeIn("normal");
        });
        $(".LoginContainer input[type = 'text'],.LoginContainer input[type = 'password']").val("");
    }) 
    // 前后端交互逻辑
    $(".SignupContainer input[name = 'username']").focusout(function(){
        var tempUsername = {username:$(this).val()};
        $.ajax({
            type: "POST",
            url: `${ip}temp_username/`,
            data: tempUsername,
            dataType: "json",
            success: function (msg) {
                if(msg.code!=200) 
                {
                    $(".SignupContainer span").text(msg.message);
                    $(".SignupContainer div").fadeIn("fast");
                }
                else $(".SignupContainer div").fadeOut("fast")
            }
        });
    })
    $(".SignupContainer input[name = 'SignupButton']").click(function () { 
        var SignupUsername = $(".SignupContainer input[name = 'username']").val();
        var SignupPassword1 = $(".SignupContainer input[name = 'password1']").val();
        var SignupPassword2 = $(".SignupContainer input[name = 'password2']").val();
        var phonenumber = $(".SignupContainer input[name = 'phonenumber']").val();
        var smsNo = $(".SignupContainer input[name = 'smsNo']").val();
        var Sdata = {
            username:SignupUsername,
            password1:SignupPassword1,
            password2:SignupPassword2,
            telephone:phonenumber,
            sms_captcha:smsNo
        }
        $.ajax({
            type: "POST",
            url: `${ip}signup/`,
            data: Sdata,
            dataType: "json",
            // success:function(msg){
            //     console.log(msg)
            // }
        }).then(function(msg){
            console.log(msg) //查看返回的数据，可注释
            if(msg.code!=200)
            { 
                $(".Signuperror p").text(msg.message);
                $(".Signuperror").fadeIn("fast",function(){
                    setTimeout(function(){
                        $(".Signuperror").fadeOut("fast")
                    },1500)
                })
            }
            else
            {$(".SignupSuccess").fadeIn("fast",function(){
                setTimeout(function(){
                    $(".SignupSuccess,.SignupContainer").fadeOut("fast",function(){
                        $(".LoginContainer").fadeIn("normal")
                    });
                },1500) 
            })
            $(".SignupContainer input[type = 'text'],.SignupContainer input[type = 'password']").val("");
            }
        },function(){
                $(".Signuperror p").text(msg.message);
                $(".Signuperror").fadeIn("fast",function(){
                    setTimeout(function(){
                        $(".Signuperror").fadeOut("fast")
                    },1500)
                })
        });
    });
    $(".SignupContainer input[name = 'getsmsNo']").click(function(){
        var phonenumber = $(".SignupContainer input[name = 'phonenumber']").val();
        if (!(/^1[345879]\d{9}$/.test(phonenumber)))
        {
            $(".Signuperror").fadeIn("fast",function(){
                $(".Signuperror p").text("手机号码错误");
                $(".Signuperror").fadeIn("fast",function(){
                    setTimeout(function(){
                        $(".Signuperror").fadeOut("fast")
                    },1500)
            })})
        }
        else{
        var timestamp = (new Date).getTime();
        var sign = $.md5(timestamp + phonenumber + 'c1aew98a$#3FW94Efas6%846~12');
        var Solveddata = {
            telephone:phonenumber,
            timestamp,
            sign
        }
        $.ajax({
            type: "POST",
            url: `${ip}c/sms_captcha/`,
            data: Solveddata,
            dataType: "json",
            success: function (msg) {
                console.log(msg)
                if(msg.code!=200)
                {
                    $(".Signuperror p").text(msg.message);
                    $(".Signuperror").fadeIn("fast",function(){
                    setTimeout(function(){
                        $(".Signuperror").fadeOut("fast")
                    },1500)
                })
                }
                else
                {   
                    $(".SignupContainer input[name = 'getsmsNo']").attr("disabled",true);
                    var n = 60;
                    var interval1 = setInterval(() => {
                        $(".SignupContainer input[name = 'getsmsNo']").val(`验证码已发送(${n}s)`);
                        n--;
                        if(n==0){
                            clearInterval(interval1)
                            $(".SignupContainer input[name = 'getsmsNo']").attr("disabled",false).val("发送验证码");
                        }
                    }, 1000);

                }
            }
        });
    }
    })
    $(".LoginContainer input[type = 'button']").click(function(){
        var LoginUsername = $(".LoginContainer input[type = 'text']").val();
        var LoginPassword = $(".LoginContainer input[type = 'password']").val();
        var Logindata = {
            telephone:LoginUsername,
            password:LoginPassword
        }
        $.ajax({
            type: "POST",
            url: `${ip}login/`,
            data: Logindata,
            dataType: "json",
            timeout:10000,
            success: function (msg) {
                console.log(msg) //查看返回数据，可删除
                if(msg.code!=200){
                    $(".Signuperror p").text(msg.message)
                    $(".Signuperror").fadeIn("fast",function(){
                        setTimeout(() => {
                            $(".Signuperror").fadeOut("fast")
                        }, 1500);
                    })
                }
                else{
                    sessionStorage.setItem('token',msg.data.token);
                    sessionStorage.setItem('user_id',msg.data.user_id);
                    $(".SignupSuccess p").text("登陆成功");
                    $(".SignupSuccess").fadeIn("fast",function(){
                        setTimeout(function(){
                        $(".SignupSuccess").fadeOut("fast",function(){
                            window.location = "./profileindex.html"
                        });
                        },2000)
                    })
                } 
            },
            error:function(){
                $(".Signuperror p").text("请检查网络连接")
                    $(".Signuperror").fadeIn("fast",function(){
                        setTimeout(() => {
                            $(".Signuperror").fadeOut("fast")
                        }, 1500);
                    })
            }
            
        });
    })
})
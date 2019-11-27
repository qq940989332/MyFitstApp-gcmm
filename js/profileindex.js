$(function(){
    var n=0,UserId,data;
    $("body").append(
    `<div class="Alerterror"><img src="./img/error.png" style="width: 0.7rem; height: 0.7rem;">
    <p></p>
    </div>`);
    function getAllMessage(){
        return Myajax("GET",`${ip}profile/`,data);
    }
    function  getArticle(msg){
        // console.log(msg)//查看数据，可注释
        if(n==0 && msg.data.posts.length==0) 
        {//没有文章
            $(".ArticleContainer").append(`
            <div class="NoPage">快发表些文章吧~</br></br>
            <img src="http://q08a66e5d.bkt.clouddn.com/o_1dpcgupl61j9bhfm1pv15m24rcc.jpg" 
            style="width:9rem;margin:0 auto;border-radius:10%">
            </div>`)
            $(".ArticleContainer input[type='button']").remove()
        }
        for(x=0;x<=msg.data.posts.length-1;n++,x++){
            if(!msg.data.posts[x].images) msg.data.posts[x].images = `""`
            else if(msg.data.avatar == null) msg.data.avatar = "./img/testicon.jpg"   
            $(".ArticleContainer input[type='button']").before(`
            <div class="ContentManager">
                <span class="PandGID">${msg.data.posts[x].post_id}</span>
                <div class="ArticleIconName">
                    <img src="${msg.data.avatar}" class="Icon">
                    <div class="NameandDate">
                        <p>${msg.data.username}</p>
                        <p>${msg.data.posts[x].create_time}</p>
                    </div>
                    <img src="./img/delete.png" alt="" class="Delete">
                    <div class="DelSlowdown">删除</div>
                </div>
                <div class="Article">
                ${$.parseJSON(msg.data.posts[x].content)}
                </div>
                <div class="ImgContainer">
                ${$.parseJSON(msg.data.posts[x].images)}
                </div>
                <div class="Circle"><img src="./img/circle.png"><span>${msg.data.posts[x].group_name}</span></div>
                <div class="LikeAndComment">
                    <div><img src="./img/likeicon.png"><span>${msg.data.posts[x].like_post_count}</span></div>
                    <div><img src="./img/commenticon.png"><span>${msg.data.posts[x].comments_count}</span></div>
                </div>
            `);
        }
        data={post_number:n+1,user_id:UserId}
    }
    $(".ArticleContainer").on("click","input[type='button']",function(){
        getAllMessage().then(function(msg){
        if(msg.data.posts.length==0){
            $(".ArticleContainer input[type='button']")
            .before(`<div class="NoPage">已经到底啦~</div>`)
            .remove()
        }
        getArticle(msg);
        })
    })
    async function profileindex(){
        var UrlData = window.location.search
        if(!UrlData) UserId = sessionStorage.getItem("user_id")
        else{
            UserId = UrlData.substring(1)
            data={post_number:n+1,user_id:UserId}
            console.log(data)
            $(".SettingIcon").hide()
            $(".Back").show()
        }
        await getAllMessage().then(function(msg){
            console.log(msg)
            if(msg.code == 302){
                $(".Alerterror p").text("请重新登陆");
                $(".Alerterror").fadeIn("fast",function(){
                    setTimeout(() => {
                        $(".Alerterror").fadeOut("fast",function(){
                            window.location = "./login.html"
                        })
                    }, 1500);
                    });
            }
            else if(msg.code == 403){
                $(".Alerterror p").text("禁止访问，爬");
                $(".Alerterror").fadeIn("fast",function(){
                    setTimeout(() => {
                        $(".Alerterror").fadeOut("fast",function(){
                            window.location = "./login.html"
                        })
                    }, 1500);
                    });
            }
            else if(msg.data.avatar == null) msg.data.avatar = "./img/testicon.jpg"
            else if(msg.data.background)
            {//有背景图片的时候添加背景图片
                $("body").append(
                    `<div class="BackGround">
                    <img src="${msg.data.background}" alt="">
                    <img src="./img/jianbian.png" alt="">
                    </div>`)
            }
            $(".IconAndName").append(`
            <div class="Icon"><img src="${msg.data.avatar}" style="width:2.0rem;height:2.0rem"></div>
            <div class="Name"><p>${msg.data.username}</p><p>${msg.data.signature}</p></div>
            `)
            $(".ArticleContainer").append(`<input type="button" value="加载更多">`)
            getArticle(msg)
        },function(){
            $(".Alerterror p").text("数据获取失败");
            $(".Alerterror").fadeIn("fast",function(){
                setTimeout(() => {
                    $(".Alerterror").fadeOut("fast")
                }, 1500);
            });
        });
    }
    profileindex();
    // 设置后退
    $(".Back").click(function(){
        window.history.back(-1)
    })
    // 设置个人信息页
    $(".SettingIcon").click(function(){
        window.location = "./setting.html"
    })
    // 删除按钮
    $(document).on("click",".Delete",function(e){
        $(e.target.nextElementSibling).stop().slideToggle("fast");
    })
    $(document).on("click",".DelSlowdown",function(e){
        Myajax("POST",`${ip}delete_post/`,{post_id:e.target.parentElement.previousElementSibling.innerText})
        .then(function(msg){
            if(msg.code == 200)
            $(e.target.parentElement.parentElement).slideUp("fast",function(){
                $(this).remove()
            })
            else if(msg.code == 302)
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
            else
            {
                $(".Alerterror p").text("删除失败");
                $(".Alerterror").fadeIn("fast",function(){
                    setTimeout(() => {
                        $(".Alerterror").fadeOut("fast",function(){
                        })
                    }, 1500);
                    });
            }
        },function(){
            $(".Alerterror p").text("请检查网络连接");
            $(".Alerterror").fadeIn("fast",function(){
                setTimeout(() => {
                    $(".Alerterror").fadeOut("fast",function(){
                    })
                }, 1500);
                });
        })
    })
    // 底部导航栏逻辑
    $("#Bottombar div:nth-child(1)").click(function(){
        window.location = "./index.html"
    })
    $("#Bottombar div:nth-child(2)").click(function(){
        window.location = "./sendpost.html"
    })
})

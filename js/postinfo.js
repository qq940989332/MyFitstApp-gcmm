$(function(){
    var like,comment,data1="",data2="";
    var PostData = window.location.search.substring(1).split("&")
    var AuthorID = PostData[0],PostId = PostData[1]
    Myajax("GET",`${ip}${AuthorID}/post/detail/${PostId}/`,data1).then(
        function(msg){
            // console.log(msg)
            if(msg.code==200)
            {
                like = msg.data.post.attitude
                if(!msg.data.author.author_avatar) msg.data.author.author_avatar="./img/testicon.jpg"
                $(".User img").attr("src",msg.data.author.author_avatar)
                $(".User span:eq(0)").text(msg.data.author.author_name)
                $(".User span:eq(1)").text(msg.data.post.create_time)
                $(".Post").html($.parseJSON(msg.data.post.content))
                if(!msg.data.post.images) msg.data.post.images = `""`
                $(`${$.parseJSON(msg.data.post.images)}`).appendTo(".ImgContainer");
                $(".CircleInfo span").text(msg.data.post.group_name)
                if(msg.data.post.attitude == 0) $(".LikeAndComment img:eq(0)").attr("src","./img/likeicon.png")
                else $(".LikeAndComment img:eq(0)").attr("src","./img/liked.png")
                $(".LikeAndComment span:eq(0)").text(msg.data.post.like_post_count)
                $(".LikeAndComment span:eq(1)").text(msg.data.post.comment_count)
                for(x=0;x<msg.data.comments.length;x++,comment++)
                {
                    if(!msg.data.comments[x].author.author_avatar) msg.data.comments[x].author.author_avatar="./img/testicon.jpg"
                    $(`<li>
                    <div class="ComIconAndName">
                        <img src="${msg.data.comments[x].author.author_avatar}">
                        <div>
                            <span>${msg.data.comments[x].author.author_name}</span>
                            <span>${msg.data.comments[x].create_time}</span>
                        </div>
                        <div class="ZanAndCai">
                            <img src="./img/zan.png">
                            <span>2</span>
                            <img src="./img/cai.png">
                        </div>
                    </div>
                    <div class="CommentInfo">
                        ${msg.data.comments[x].content}
                    </div>
                    <div class="SlideLeft">删除</div>
                    <img src="./img/delete.png" class="DeleteIcon">
                </li>`).attr(
                    {CommentId:`${msg.data.comments[x].comment_id}`,
                     Author_Id:`${msg.data.comments[x].author.author_id}`}
                    ).appendTo($(".Comment ul"))
                }
                data2={comment}
            }
            else{
                $(".Alerterror p").text("请重新登陆");
                    $(".Alerterror").fadeIn("fast",function(){
                    setTimeout(() => {
                        $(".Alerterror").fadeOut("fast",function(){
                            window.location = "./index.html"
                        })
                    }, 1500);
                });
            }
        },function(err){
            console.log(err)
        }
    )
    // 防抖
    function FanDou(fn,time){
        var Timeout = null
        return function(){
            if(Timeout !== null) clearTimeout(Timeout)
            Timeout = setTimeout(() => {
                fn()
            }, time);
        }
    }
    $(document).on("click",".LikeAndComment div:eq(0)",FanDou(function(){
        Myajax("POST",`${ip}like_post/`,{post_id:PostId}).then(function(msg){
             if(msg.code == 200)
             {
                 if(msg.data.attitude == 0) $(".LikeAndComment img:eq(0)").attr("src","./img/likeicon.png")
                 else $(".LikeAndComment img:eq(0)").attr("src","./img/liked.png")
                 $(".LikeAndComment span:eq(0)").text(msg.data.like_post_count)
             }
             else
             {
                 $(".Alerterror p").text("请检查网络连接");
                     $(".Alerterror").fadeIn("fast",function(){
                     setTimeout(() => {
                         $(".Alerterror").fadeOut("fast")
                     }, 1500);
                 });
             }
        })
     },200))
// 回退按钮
$(".InfoBack").click(function (e) { 
    window.history.back(-1)
});
//点原图
$(".close").click(function(){
    $(".Alertimage").fadeOut();("fast");
})
$(document).on("click",".ImgContainer img",function(e){
    $(".Bigimage").attr("src",e.target.src)
    $(".Alertimage").fadeIn();("fast");
})
// 发表评论部分
$(".LikeAndComment span:eq(1)").click(function(){
    $(".SendComment").slideDown("fast");
})
$(".SendTitle img").click(function(){
    $(".SendComment").slideUp("fast");
})
$(".CommentArea div").keyup(function () { 
    if($(this).text().trim() != "") $(".SendTitle input").prop("disabled",false)
    else $(".SendTitle input").prop("disabled",true)
});
// 发表逻辑 postid content
$(".SendTitle input").click(function(){
    var content = $(".CommentArea div").text()
    Myajax("POST",`${ip}add_comment/`,{post_id:PostId,content})
    .then(function(msg){
        if(msg.code == 200)
        {
            $(".Alertsuccess p").text("发送成功");
            $(".Alertsuccess").fadeIn("fast",function(){
            setTimeout(() => {
                $(".Alertsuccess").fadeOut("fast",function(){
                    $(".SendComment").slideUp("fast");
                    window.location.reload(true)
                })
            }, 1500);
            });
        }
        else
        {
            $(".Alerterror p").text("发送失败");
            $(".Alerterror").fadeIn("fast",function(){
            setTimeout(() => {
                $(".Alerterror").fadeOut("fast")
            }, 1500);
        });
        }
    })
})
// 删除评论
$(document).on("click",".Comment .DeleteIcon",function(e){
    if(e.target.parentElement.getAttribute("Author_Id") == sessionStorage.getItem("user_id"))
    $(e.target.previousElementSibling).stop().animate({width:'toggle'},"fast")
})

$(document).on("click",".Comment .SlideLeft",function(e){
    Myajax("POST",`${ip}delete_comment/`,{comment_id:e.target.parentElement.getAttribute("CommentId")})
    .then(function(msg){
        if(msg.code == 200)
        {
            $(e.target.parentElement).slideUp("fast",function(){
                $(this).remove()
            })
        }
        else
        {
            $(".Alerterror p").text("删除失败");
            $(".Alerterror").fadeIn("fast",function(){
            setTimeout(() => {
                $(".Alerterror").fadeOut("fast")
            }, 1500)
            })
        }
    },function(){
            $(".Alerterror p").text("请检查网络连接");
            $(".Alerterror").fadeIn("fast",function(){
            setTimeout(() => {
                $(".Alerterror").fadeOut("fast")
            }, 1500)
            })
    }) 
})





})
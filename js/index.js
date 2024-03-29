$(function(){
    // 初始化部分
    var n = 0,data={},Long = 0;
    // 防抖函数
    function debounce(fn, wait) {
        var timeout = null;      //定义一个定时器
        return function() {
            if(timeout !== null) clearTimeout(timeout);  //清除这个定时器
            timeout = setTimeout(fn, wait);  
        }
    }
    // 处理函数
    function handle() {
        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
        var a = document.documentElement.scrollHeight;
        var b = Math.round(scrollTop);
        var c = document.documentElement.clientHeight;
        console.log(b,c,a)
        if( b+c == a+1 || b+c == a-1 || b+c == a)
        MakeIndex();
    }
    // ---------------------------防抖函数结束
    // 节流函数
    // var throttle = function(func, delay) {
        // var timer = null;
        // var startTime = Date.now();  //设置开始时间
        // return function() {
                // var curTime = Date.now();
                // var remaining = delay - (curTime - startTime);  //剩余时间
                // clearTimeout(timer);
                //  if (remaining <= 0) {      // 第一次触发立即执行
                    //    func();
                    //    startTime = Date.now();
                //  } else {
                    //    timer = setTimeout(func, remaining);   //取消当前计数器并计算新的remaining
                //  }
        //  }
    // }
    // function handle() {
        // var a = document.documentElement.scrollHeight;
        // var b = document.documentElement.scrollTop;
        // var c = document.documentElement.clientHeight;
        // if(b+c == a)
        // MakeIndex();
    // }
    // --------------------------防抖函数结束
    function Getmessage_Ajax(){
       return Myajax("GET",`${ip}`,data)
    }
    function MakeArticle(msg){
        // console.log(msg)
        for(x=0;x<=msg.data.posts.length-1;x++,n++){
            if(!msg.data.posts[x].author_avatar) msg.data.posts[x].author_avatar = "./img/testicon.jpg"
            if(!msg.data.posts[x].images) msg.data.posts[x].images = `""`
            if(msg.data.posts[x].location)
            $(`
            <div class="ContentManager">
                <span class="PandGID">
                    <span class="PostId">${msg.data.posts[x].post_id}</span>
                    <span class="GroupId">${msg.data.posts[x].group_id}</span>
                    <span class="AuthorId">${msg.data.posts[x].author_id}</span>
                </span>
                <div class="ArticleIconName">
                    <img src="${msg.data.posts[x].author_avatar}" class="Icon">
                    <div class="NameandDate">
                        <p>${msg.data.posts[x].author_name}</p>
                        <p>${msg.data.posts[x].create_time}</p>
                    </div>
                </div>
                <div class="Article">
                ${$.parseJSON(msg.data.posts[x].content)}
                </div>
                <div class="ImgContainer">
                ${$.parseJSON(msg.data.posts[x].images)}
                </div>
                <div class="Circle"><img src="./img/circle.png"><span GroupId="${msg.data.posts[x].group_id}">${msg.data.posts[x].group_name}</span></div>
                <div class="Location"><img src="./img/location.png"><span>${msg.data.posts[x].location}</span></div>
                <div class="LikeAndComment">
                    <div><img src="./img/likeicon.png"><span>${msg.data.posts[x].like_post_count}</span></div>
                    <div><img src="./img/commenticon.png"><span>${msg.data.posts[x].comment_count}</span></div>
                </div>
            </div>
            `).appendTo(".ArticleContainer");
            else
            $(`
            <div class="ContentManager">
                <span class="PandGID">
                    <span class="PostId">${msg.data.posts[x].post_id}</span>
                    <span class="GroupId">${msg.data.posts[x].group_id}</span>
                    <span class="AuthorId">${msg.data.posts[x].author_id}</span>
                </span>
                <div class="ArticleIconName">
                    <img src="${msg.data.posts[x].author_avatar}" class="Icon">
                    <div class="NameandDate">
                        <p>${msg.data.posts[x].author_name}</p>
                        <p>${msg.data.posts[x].create_time}</p>
                    </div>
                </div>
                <div class="Article">
                ${$.parseJSON(msg.data.posts[x].content)}
                </div>
                <div class="ImgContainer">
                ${$.parseJSON(msg.data.posts[x].images)}
                </div>
                <div class="Circle"><img src="./img/circle.png"><span GroupId="${msg.data.posts[x].group_id}">${msg.data.posts[x].group_name}</span></div>
                <div class="Location" style="display:${msg.data.posts[x].location?"block":"none"}"><img src="./img/location.png"><span>${msg.data.posts[x].location}</span></div>
                <div class="LikeAndComment">
                    <div><img src="./img/likeicon.png"><span>${msg.data.posts[x].like_post_count}</span></div>
                    <div><img src="./img/commenticon.png"><span>${msg.data.posts[x].comment_count}</span></div>
                </div>
            </div>
            `).appendTo(".ArticleContainer");
        data={post_number:n+1};
    }
}
    async function MakeIndex(){
        await Getmessage_Ajax().then(function(msg){
            // console.log(msg)
            if(msg.data.posts.length == 0){
                $(".ArticleContainer")
                .append(`<div class="NoPage">已经到底啦~</div>`);
                $(document).unbind("scroll");
                return
            }
            MakeArticle(msg);
        },
        function(err){
            console.log(err)
        })
    }
    $(document).scroll( (debounce(handle,200)) );
    MakeIndex();
    // 搜索框
    $(".SearchIcon").click(function () {
        var keyword = $(".SearchArea").val().trim()
        window.location = "./search.html?keyword="+encodeURI(keyword)+"&"+"groupid="
    });
    // 实时推送部分
    setInterval(() => {
        Myajax("GET",`${ip}post_list/`,{}).then(function(msg){
            // console.log(msg)
            if(msg.code == 200)
            {
                if($(".commentCircle").text()!= msg.data.comments_total) { 
                    // 判断是否有新消息，若出现新消息，则进行推送
                    Long = msg.data.comments_total
                    $(".commentCircle").text(msg.data.comments_total).fadeIn("fast")
                    $(".onCommentInfo ul li").remove() //刷新新消息
                    for(k=0;k<msg.data.posts.length;k++){
                        for(m=0;m<msg.data.posts[k].comments_quantity;m++){ //展现具体消息
                            $(".onCommentInfo ul").append(`
                            <li postid="${msg.data.posts[k].id}">
                            <div class="onComIcon"><img src="${msg.data.posts[k].comments[m].author_avatar}"></div>
                            <div class="onComCom">
                                <div>${msg.data.posts[k].comments[m].author_name}
                                <span>回复了你</span></div>
                                <div>${msg.data.posts[k].comments[m].content}</div>
                                <div>${msg.data.posts[k].comments[m].create_time}</div>
                            </div>
                            <div class="onComCon">
                                <div class="onComConBac">
                                    <div>
                                        ${msg.data.posts[k].content}
                                    </div>
                                </div>
                            </div>
                        </li>`)
                        }
                    }
                }
            }     
        },function(){
            $(".Alerterror p").text("请检查网络连接");
            $(".Alerterror").fadeIn("fast",function(){
            setTimeout(() => {
                $(".Alerterror").fadeOut("fast")
            }, 1500);
        });
        })
    },500);
    // 实时推送部分点击事件
    $(".commentCircle").click(function(){
        $(".onCommentContent").slideDown("fast");
    })
    $(".onCommentContent .bottomIcon").click(function(){
        $(".onCommentContent").slideUp("fast");
    })
    $(".onCommentContent").on("click","li",function(){
        window.location.replace(
        `./postinfo.html?${sessionStorage.getItem("user_id")}&${$(this).attr("postid")}`)
    })
    // 点头像进入个人中心
    $(document).on("click",".Icon",function(e){
        // console.log(e.target.parentNode.previousElementSibling.children[2].innerText)
        window.location = `./profileindex.html?${e.target.parentNode.previousElementSibling.children[2].innerText}`
    })
    //点原图
    $(".close").click(function(){
        $(".Alertimage").fadeOut();("fast");
    })
    $(document).on("click",".ImgContainer img",function(e){
        $(".Bigimage").attr("src",e.target.src)
        $(".Alertimage").fadeIn();("fast");
    })
    // 点帖子进帖子详情
    $(document).on("click",".Article",function(e){
        window.location = `./postinfo.html?${e.target.parentElement.children[0].children[2].innerText}&${e.target.parentElement.children[0].children[0].innerText}` 
    })
    // 点圈子进入圈子
    $(document).on("click",".Circle span",function(e){
        window.location = "./search.html?keyword="+"&"+"groupid="+encodeURI(e.target.getAttribute("GroupId"))
    })
    // 底部导航栏逻辑
    $("#Bottombar div:nth-child(2)").click(function(){
        window.location = "./sendpost.html"
    })
    $("#Bottombar div:nth-child(3)").click(function(){
        window.location = "./profileindex.html"
    })

})
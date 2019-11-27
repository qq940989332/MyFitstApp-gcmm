$(function(){
    var n = 0,
    keyword=decodeURI(window.location.search.slice(1).split("&")[0].split("=")[1]),
    group_id = decodeURI(window.location.search.slice(1).split("&")[1].split("=")[1]),
    data={post_number:n+1,keyword,group_id};
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
    //节流函数
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
        console.log(msg)
        for(x=0;x<=msg.data.posts.length-1;x++,n++){
            if(!msg.data.posts[x].author_avatar) msg.data.posts[x].author_avatar = "./img/testicon.jpg"
            if(!msg.data.posts[x].images) msg.data.posts[x].images = `""`
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
                <div class="Circle"><img src="./img/circle.png"><span>${msg.data.posts[x].group_name}</span></div>
                <div class="LikeAndComment">
                    <div><img src="./img/likeicon.png"><span>${msg.data.posts[x].like_post_count}</span></div>
                    <div><img src="./img/commenticon.png"><span>${msg.data.posts[x].comment_count}</span></div>
            </div>
            `).appendTo(".ArticleContainer");
        }

        data={post_number:n+1,keyword,group_id};
    }
    async function MakeIndex(){
        await Getmessage_Ajax().then(function(msg){
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
    // 点回退
    $(".SearchBar img").click(function(){
        window.location = "./index.html"
    })
    // 点头像进入个人中心
    $(document).on("click",".Icon",function(e){
        console.log(e.target.parentNode.previousElementSibling.children[2].innerText)
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
})
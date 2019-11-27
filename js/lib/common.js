function Myajax(type,url,data){
    return new Promise(function(resolve,reject){
        $.ajax({
            type,
            url,
            data,
            dataType: "json",
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("token", sessionStorage.token);
                XMLHttpRequest.setRequestHeader("user_id", sessionStorage.user_id);
            },
            success: function (msg) {
                resolve(msg)
            },
            error:function(){
                reject()
            }
        });
    })
}
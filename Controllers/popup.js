var background=chrome.extension.getBackgroundPage();
NetlogPopupObject=function(){
    var netLogPopup={
    };
    $(function(){//init
        if(localStorage.userInfo){
            var userInfo=JSON.parse(localStorage.userInfo);
            var out='<a target="blank" href="'+userInfo.profileUrl+'">'+userInfo.nickname+'</a>';
            $("#username").html(out);
            $("#userimg").attr("src",userInfo.thumbnailUrl);
        }
        
    })
    return netLogPopup;
}
var netLogPopup=new NetlogPopupObject();


//{"aboutMe":"","displayName":"Mohamed Azouz","gender":"male","id":"170215236","name":{"familyName":"Azouz","givenName":"Mohamed","formatted":"Mohamed Azouz"},"nickname":"M_azouz","profileUrl":"http://netlog.com/M_azouz","thumbnailUrl":"http://v4.netlogstatic.com/v6.00/4100//s/i/misc/thumb/thumb_male.jpg","isOwner":true,"isViewer":true}
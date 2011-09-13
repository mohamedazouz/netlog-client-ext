var background=chrome.extension.getBackgroundPage();
NetlogOptionObject=function(){
    var netLogOption={
        authenticate:function(){
            if(!localStorage.authtokenObj){
                background.netLogBG.netlogAuth.open( function(response){
                    console.log(JSON.stringify(response));
                });
                $("#auth").html("remove");
            }else{
                 window.localStorage.removeItem("authtokenObj");
                //localStorage.authtokenObj=null;
                $("#auth").html("auth");
            }
        },
        doFunction:function(){
            var options={};
            functionid=$("#functionid").val();
            if(functionid==5||functionid==6)//friend info || send notification required friend id
            {
                options.friend_id=169212791;
            }
            if(functionid==6)// send notification required tile & body for notification form
            {
                json.body="testtest";
                json.title="testDemo";
            }
            background.netLogBG.doFunction(functionid, options, function(response){
                console.log(JSON.stringify(response))
            });
        }
    };
    $(function(){
        var auth="";
        if(!localStorage.authtokenObj){
            auth="auth";
        }else{
            auth="remove";
        }
        $("#auth").html(auth)
        $("#auth").click(function(){
            netLogOption.authenticate();
        })
    })
    return netLogOption;
}
var netLogOption=new NetlogOptionObject();


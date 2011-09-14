var background=chrome.extension.getBackgroundPage();
NetlogOptionObject=function(){
    var netLogOption={
        authenticate:function(){
            if(!localStorage.authtokenObj){
                background.netLogBG.netlogAuth.open( function(response){
                    console.log(JSON.stringify(response));
                    netLogOption.initUser(function(){
                        console.log("Ready to use extension");
                    })
                });
                $("#auth").html("remove");
            }else{
                netLogOption.removeUserData();
                $("#auth").html("auth");
            }
        },
        initUserData:function(handler){
            netLogOption.getUserInfo(function(){
                netLogOption.getUserFriendList(function(){
                    netLogOption.getUserNotification(function(){
                        handler(1);
                    });
                });
            });
        },
        removeUserData:function(){
            window.localStorage.removeItem("authtokenObj");
            window.localStorage.removeItem("userInfo");
            window.localStorage.removeItem("userfriendList");
            window.localStorage.removeItem("userNotification");
        },
        getUserInfo:function(handler){
            netLogOption.doFunction(1,null, function(response){
                localStorage.userInfo=JSON.stringify(response.result);
                handler(response);
            });
        },
        getUserFriendList:function(handler){
            netLogOption.doFunction(2,null, function(response){
                localStorage.userfriendList=JSON.stringify(response.result);
                handler(response);
            });
        },
        getUserNotification:function(handler){
            netLogOption.doFunction(3,null, function(response){
                localStorage.userNotification=JSON.stringify(response.result);
                handler(response);
            });
        },
        uploadPhoto:function(){
            
        },
        doFunction:function(function_id,option,handler){
            var options={};
            functionid=function_id?function_id:$("#functionid").val();
            if(option){
                options=option;
            }else{
                if(functionid==5||functionid==6)//friend info || send notification required friend id
                {
                    options.friend_id=169212791;
                }
                if(functionid==6)// send notification required tile & body for notification form
                {
                    options.body="testtest";
                    options.title="testDemo";
                }
            }
            background.netLogBG.doFunction(functionid, options, function(response){
                handler(response)
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
        $("#notifier").click(function(){
            background.netLogBG.notifier.fireNotification();
        })
    })
    return netLogOption;
}
var netLogOption=new NetlogOptionObject();


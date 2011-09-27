var background=chrome.extension.getBackgroundPage();
NetlogOptionObject=function(){
    var netLogOption={
        authenticate:function(){
            if(!localStorage.authtokenObj){
                $("#loader").show();
                $("#authMsg").html("Authentication Process......");
                background.netLogBG.netlogAuth.open( function(response){
                    $("#authMsg").html("Getting User Data.......");
                    console.log(JSON.stringify(response));
                    background.netLogBG.initUserData(function(){
                        $("#loader").hide();
                        $("#auth").html("remove");
                        console.log("Ready to use extension");
                    })
                });
            }else{
                netLogOption.removeUserData();
                $("#auth").html("auth");
            }
        },
        removeUserData:function(){
            background.netLogBG.removeUserData();
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

        $("#getfunction").click(function(){
            console.log($("#functionid").val())
            switch($("#functionid").val()){
                case '1':{
                    console.log(window.localStorage.userInfo)
                }
                break;
                case '2':{
                    background.netLogDB.getAllFriends(function(callback){
                        console.log(JSON.stringify(callback))
                    })
                }
                break;
                case '3':{
                    console.log(window.localStorage.userNotification)
                }
                break;
            }
        });
        $("#notifier").click(function(){
            background.netLogBG.notifier.fireNotification();
        })
    })
    return netLogOption;
}
var netLogOption=new NetlogOptionObject();


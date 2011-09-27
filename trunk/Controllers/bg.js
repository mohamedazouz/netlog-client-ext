NetlogBGObject=function(){
    var netLogBG={
        netlogAuth:{
            open:function(handler){
                netLogBG.netlogAuth.Authenticate(0,netlogStaticData.baseURL+netlogStaticData.gettokenURL,function(data){
                    handler(data);
                });
                chrome.tabs.create({
                    url:netlogStaticData.baseURL+netlogStaticData.loginAuthorizeURL,
                    selected:true
                });
            },
            Authenticate:function(count,link,handler){
                if(! count){
                    count=0;
                }
                count=parseInt(count);
                if(count == 59){
                    return;
                }
                //        url=link
                try{
                    $.ajax({
                        url:link,
                        dataType:'json',
                        success:function(res){
                            if(res.code==400){
                                window.setTimeout(function(){
                                    netLogBG.netlogAuth.Authenticate(count+1,link,handler);
                                }, 1000 * 2);
                            }else{
                                localStorage.authtokenObj=JSON.stringify(res);
                                handler(res);
                            }
                        },
                        error:function(){
                            if(count < 60){
                                window.setTimeout(function(){
                                    netLogBG.netlogAuth.Authenticate(count+1,link,handler);
                                }, 1000 * 2);
                            }
                        }
                    });
                }catch (e){
                    window.setTimeout(function(){
                        netLogBG.netlogAuth.Authenticate(count+1,link,handler);
                    }, 1000 * 2);
                }

            }
        },
        notifier:{
            fireNotification:function(){
                webkitNotification=webkitNotifications.createHTMLNotification(
                    '../views/notification.html'
                    /*'../views/images/netloglogo.jpg',  // icon url - can be relative
                    'eshta ya m3lem',  // notification title
                    'fola yad'*/ // notification body text
                    );
                webkitNotification.show();
            //   setTimeout("webkitNotification.cancel();",2*1000);
            }
        },
        doFunction:function(functionid,options,handler){
            jsontemp=JSON.parse(localStorage.authtokenObj);
            json=
            {
                "key":jsontemp.token.key,
                "secret":jsontemp.token.secret,
                "function":functionid
            //  "friend_id":options.friend_id?options.friend_id:"",//friend info || send notification required friend id
            // "body":options.body?options.body:"",// send notification required tile & body for notification form
            //"title":options.title?options.title:""//
            }
            $.ajax({
                url:netlogStaticData.baseURL+netlogStaticData.dofunctionURL,
                data:json,
                type: "POST",
                dataType:"json",
                success: function(response){
                    handler(response)
                }
            });
        },
        initUserData:function(handler){
            netLogBG.getUserInfo(function(callback){
                console.log(callback)
                netLogBG.getUserFriendList(function(callback){
                    console.log(callback)
                    netLogBG.getUserNotification(function(callback){
                        console.log(callback)
                        handler(1);
                    });
                });
            });
        },
        removeUserData:function(){
            netLogDB.clearDB();
            window.localStorage.removeItem("authtokenObj");
            window.localStorage.removeItem("userInfo");
            window.localStorage.removeItem("userNotification");
        },
        getUserInfo:function(handler){
            netLogBG.doFunction(1,null,function(response){
                window.localStorage.userInfo=JSON.stringify(response.result);
                handler("Done , Setting User Info");
            })
        
        },
        getUserFriendList:function(handler){
            netLogBG.doFunction(2,null, function(response){
                netLogDB.insertFriends(response.result, function(response){
                    handler(response);
                });
            });
        },
        getUserNotification:function(handler){
            netLogBG.doFunction(3,null, function(response){
                window.localStorage.userNotification=JSON.stringify(response.result);
                handler("Done , User Notification");
            });
        }
    };
    $(function(){
        //init
      /*  netLogDB.getAllFriends(function(callback){
            console.log(callback);
        })*/
    })
    return netLogBG;
}


var netLogBG=new NetlogBGObject(); 

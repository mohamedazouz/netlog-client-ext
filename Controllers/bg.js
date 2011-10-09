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
            fireNotification:function(icon,title,body){
                webkitNotification=webkitNotifications.createNotification(//createHTMLNotification(
                    //'../views/notification.html'
                    icon,  // icon url - can be relative
                    title,  // notification title
                    body // notification body text
                    );
                webkitNotification.show();
                setTimeout("webkitNotification.cancel();",3*1000);
            }
        },
        doFunction:function(functionid,options,handler){
            jsontemp=JSON.parse(localStorage.authtokenObj);
            json=
            {
                "key":jsontemp.token.key,
                "secret":jsontemp.token.secret,
                "function":functionid,
                "friend_id":options?options.friend_id?options.friend_id:"":"",//friend info || send notification required friend id
                "body":options?options.body?options.body:"":"",// send notification required tile & body for notification form
                "title":options?options.title?options.title:"":""//
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
                    netLogBG.getFriendsLog(function(callback){
                        console.log(callback);
                        netLogBG.notifier.fireNotification('../views/images/icon_.png','Netlog Extension','you are Authorized to use the extension from POPup window');
                        netLogBG.StartState();
                        netLogBG.updateUserData();
                        handler(1);
                        chrome.browserAction.setIcon({
                            path:'../views/images/icon_.png'
                        });
                    });
                });
            });
        },
        removeUserData:function(){
            netLogDB.clearDB();
            window.localStorage.removeItem("authtokenObj");
            window.localStorage.removeItem("friendslog");
            window.localStorage.removeItem("userInfo");
            window.localStorage.removeItem("friendsLog");
        },
        getUserInfo:function(handler,update){
            netLogBG.doFunction(1,null,function(response){
                window.localStorage.userInfo=JSON.stringify(response.result);
                if(update){
                    netLogBG.notifier.fireNotification('../views/images/icon_.png','Netlog Extension','User Info. Updated');
                }else{
                    handler("Done , Setting/update User Info");
                }
                
            })
        
        },
        getUserFriendList:function(handler,update){
            netLogBG.doFunction(2,null, function(response){
                netLogDB.insertFriends(response.result, function(response){
                    if(update){
                        netLogBG.notifier.fireNotification('../views/images/icon_.png','Netlog Extension','User Friend List  Updated');
                    }else{
                        handler(response);
                    }
                });
            });
        },
        getFriendsLog:function(handler,update){
            netLogBG.doFunction(3,null, function(response){
                window.localStorage.friendsLog=JSON.stringify(response.result);
                if(update){
                    netLogBG.notifier.fireNotification('../views/images/icon_.png','Netlog Extension','User Friends Log Updated');
                }else{
                    handler("Done , User Friends Log");
                }
            });
        },
        updateUserData:function(){
            if(localStorage.authtokenObj){
                chrome.browserAction.setIcon({
                    path:'../views/images/icon_.png'
                });
                console.log("start Updating counter.....")
                window.setInterval("netLogBG.getFriendsLog(null,1)",2 * 1000 * 60 * 60);
                window.setInterval("netLogBG.getUserFriendList(null,1)",2 * 1000 * 60 * 60);
                window.setInterval("netLogBG.getUserInfo(null,1)",2 * 1000 * 60 * 60 );
            }
        },
        StartState:function(){
            window.localStorage.removeItem("pendingState");
            var x=chrome.extension.getViews({
                type:"popup"
            })
            if(x.length>0){
                x[0].netLogPopup.startState();
            }
        }
    };
    $(function(){
        //init
        netLogBG.updateUserData();
    })
    return netLogBG;
}


var netLogBG=new NetlogBGObject(); 

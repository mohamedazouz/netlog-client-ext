NetlogBGObject=function(){
    var netLogBG={
        netlogAuth:{
            open:function(handler){
                if(window.localStorage.errorObj){
                    window.localStorage.removeItem("errorObj");
                }
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
                    localStorage.errorObj=JSON.stringify({
                        error:"1",
                        msg:"Faild to Authenticate"
                    })
                    var x=chrome.extension.getViews({
                        type:"popup"
                    })
                    if(x.length>0){
                        x[0].netLogPopup.authenticationfail();
                    }
                    return;
                }
                //        url=link
                try{
                    $.ajax({
                        url:link,
                        dataType:'json',
                        success:function(res){
                            if(res.code==500){
                                localStorage.errorObj=JSON.stringify({
                                    error:"1",
                                    msg:"Faild to Authenticate"
                                })
                                var x=chrome.extension.getViews({
                                    type:"popup"
                                })
                                if(x.length>0){
                                    x[0].netLogPopup.authenticationfail();
                                }
                                return;
                            }
                            if(res.code==400){
                                window.setTimeout(function(){
                                    netLogBG.netlogAuth.Authenticate(count+1,link,handler);
                                }, 1000 * 2);
                            }else{
                                localStorage.authtokenObj=JSON.stringify(res);
                                if(window.localStorage.errorObj){
                                    window.localStorage.removeItem("errorObj");
                                }
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
            window.localStorage.status="Authentication Success ,Extension fetching data....";
            var x=chrome.extension.getViews({
                type:"popup"
            })
            if(x.length>0){
                x[0].netLogPopup.loaderMessage("Authentication Success ,Extension fetching data....");
            }
            netLogBG.getUserInfo(function(callback){
                console.log(callback)
                // netLogBG.getUserFriendList(function(callback){
                //  console.log(callback)
                netLogBG.getFriendsLog(function(callback){
                    console.log(callback);
                    netLogBG.notifier.fireNotification('../views/images/icon_.png','Netlog Extension','you are Authorized to use the extension from POPup window');
                    netLogBG.StartState();
                    netLogBG.updateUserData();
                    handler(1);
                    var x=chrome.extension.getViews({
                        type:"popup"
                    })
                    if(x.length<=0){
                        if(window.localStorage.badge!="0"){
                            chrome.browserAction.setBadgeText({
                                text:window.localStorage.badge
                            });
                        }
                    }
                    chrome.browserAction.setIcon({
                        path:'../views/images/icon_.png'
                    });
                });
            //});
            });
        },
        removeUserData:function(){
            window.localStorage.removeItem("authtokenObj");
            window.localStorage.removeItem("friendslog");
            window.localStorage.removeItem("userInfo");
            window.localStorage.removeItem("friendsLog");
            if(window.localStorage.errorObj){
                window.localStorage.removeItem("errorObj");
            }
        },
        getUserInfo:function(handler,update){
            netLogBG.doFunction(1,null,function(response){
                if(!response || response=="null" ){
                    window.localStorage.userInfo="{code:400}";
                    handler("Empty response User Info");
                }else{
                    if(!window.localStorage.userInfo){
                        window.localStorage.notifyNumberUserVisitor=response.result.profilevisitors.length;
                        window.localStorage.notifyNumberUserNotification=response.result.notifications.length;
                        window.localStorage.userInfo=JSON.stringify(response.result);
                    }else{
                        if(JSON.parse(window.localStorage.userInfo).profilevisitors.length==0){
                            window.localStorage.notifyNumberUserVisitor=response.result.profilevisitors.length;
                        }else{
                            vis=1;
                            var lastvistitorID=JSON.parse(window.localStorage.userInfo).profilevisitors[JSON.parse(window.localStorage.userInfo).profilevisitors.length-1].visitorid.id;
                            var vistitors=response.result.profilevisitors
                            var newVisitorItem=0;
                            for(i=vistitors.length-1;i>=0;i--){
                                if(lastvistitorID!=vistitors[i].visitorid.id){
                                    newVisitorItem++;
                                }else{
                                    break;
                                }
                            }
                            window.localStorage.notifyNumberUserVisitor=newVisitorItem;
                        }
                        if(JSON.parse(window.localStorage.userInfo).notifications.length==0){
                            window.localStorage.notifyNumberUserNotification=response.result.notifications.length;
                        }else{
                            var lastnotificationsID=JSON.parse(window.localStorage.userInfo).notifications[JSON.parse(window.localStorage.userInfo).notifications.length-1].nid;
                            var notifications=response.result.notifications
                            var newnotificationsItem=0;
                            for(i=notifications.length-1;i>=0;i--){
                                console.log(lastnotificationsID+"  ==   "+notifications[i].nid)
                                if(lastnotificationsID!=notifications[i].nid){
                                    newnotificationsItem++;
                                }else{
                                    break;
                                }
                            }
                            window.localStorage.notifyNumberUserNotification=newnotificationsItem;
                        }
                        window.localStorage.userInfo=JSON.stringify(response.result);
                    }
                    window.localStorage.badge="0";
                    badge=parseInt(window.localStorage.notifyNumberUserNotification)+parseInt(window.localStorage.notifyNumberUserVisitor);
                    window.localStorage.badge=badge;
                    if(update){
                        if(badge>0){
                            netLogBG.notifier.fireNotification('../views/images/icon_.png','Netlog Extension','check New vistor');
                        }
                        handler("update");
                    }else{
                        handler("Done , Setting/update User Info");
                    }
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
                if(!response || response=="null"){
                    window.localStorage.friendsLog="{code:400}";
                    handler("Empty response Friends Log");
                }else{
                    if(!window.localStorage.friendsLog){
                        window.localStorage.friendsLog=JSON.stringify(response.result);
                        window.localStorage.notifyNumberfriendsLog=response.result.friendActivities.list.length
                    }else{
                        if(JSON.parse(window.localStorage.friendsLog).friendActivities.list.length<=0){
                            window.localStorage.friendsLog=JSON.stringify(response.result);
                            window.localStorage.notifyNumberfriendsLog=JSON.parse(window.localStorage.friendsLog).friendActivities.list.length
                        }else{
                            var lastnotifyID=JSON.parse(window.localStorage.friendsLog).friendActivities.list[JSON.parse(window.localStorage.friendsLog).friendActivities.list.length-1].id;
                            var newList=response.result.friendActivities.list;
                            var newItem=0;
                            for(i=newList.length-1;i>=0;i--){
                                if(newList[i].id!=lastnotifyID){
                                    newItem++;
                                }else{
                                    break;
                                }
                            }
                            window.localStorage.notifyNumberfriendsLog=newItem;
                            window.localStorage.friendsLog=JSON.stringify(response.result);
                        }
                        
                    }
                    badge=parseInt(window.localStorage.notifyNumberfriendsLog);
                    badge+=parseInt(window.localStorage.badge);
                    window.localStorage.badge=badge;
                    if(update){
                        if(window.localStorage.notifyNumberfriendsLog!="0"){
                            netLogBG.notifier.fireNotification('../views/images/icon_.png','Netlog Extension','There is '+window.localStorage.notifyNumberfriendsLog+'items of new Friends Log ');
                        }
                        handler("update");
                    }else{
                        handler("Done , User Friends Log");
                    }
                }
            });
        },
        updateUserData:function(){
            if(localStorage.authtokenObj){
                chrome.browserAction.setIcon({
                    path:'../views/images/icon_.png'
                });
                console.log("start Updating counter.....")
                updateTime=2 * 1000 *60*60;
                //window.setInterval("",updateTime);
                //window.setInterval("netLogBG.getUserFriendList(null,1)",updateTime);
                window.setInterval("netLogBG.update()",updateTime );
            }
        },
        update:function(){
            netLogBG.getUserInfo(function(){
                netLogBG.getFriendsLog(function(){
                    if(window.localStorage.badge!="0"){
                        chrome.browserAction.setBadgeText({
                            text:window.localStorage.badge
                        });
                    }
                },1)
            },1)
            
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
        if(!window.localStorage.installed){
            window.localStorage.installed=1;
            window.localStorage.pendingState=1;
            netLogBG.netlogAuth.open( function(response){
                netLogBG.initUserData(function(){
                    console.log("Ready to use extension");
                })
            })
            netLogBG.updateUserData();
        }else{
            netLogBG.updateUserData();
        }
    })
    return netLogBG;
}


var netLogBG=new NetlogBGObject(); 

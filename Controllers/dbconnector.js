var NetLogDB=function(){
    var netLogDB={
        db:this.db,
        setup:function(){
            netLogDB.db=openDatabase('netlog', '1.0', 'Netlog Extension database',  5*1024*1024);
            netLogDB.db.transaction(function(tx) {
                tx.executeSql("create table if not exists " +
                    "friends(id integer primary key asc, aboutMe string, displayName string,"+
                    "uid integer,name string,nickname string,profileUrl string,thumbnailUrl string);",
                    [],
                    function() {
                        console.log("friends on.");
                    },
                    netLogDB.onError);
            });
        },
        /**
         * insert friends into db
         */
        insertFriends:function(list,handler){
            for(i=0;i < list.length; i++){
                netLogDB.insertFriend(list[i]);
            }
            handler("Done , Set/Update Friend List")
        },
        /**
         * clearing the database.
         */
        clearDB:function(){
            netLogDB.db.transaction(function(tx) {
                tx.executeSql("DELETE FROM friends;",[],null,netLogDB.onError);
            });
        },
        /**
         * clearing friends table.
         */
        cleareFriends:function(){
            netLogDB.db.transaction(function(tx) {
                tx.executeSql("DELETE FROM friends;",[],null,netLogDB.onError);
            });
        },
        insertFriend:function(friend,handler){
            netLogDB.db.transaction(function(tx) {
                tx.executeSql("INSERT into friends (aboutMe,displayName,uid,name,nickname,profileUrl,thumbnailUrl) VALUES (?,?,?,?,?,?,?);",
                    [friend.aboutMe,friend.displayName,friend.id,friend.name,friend.nickname,friend.profileUrl,friend.thumbnailUrl],
                    //                    [friend.uid,friend.name,friend.pic_square,"false"],
                    null,
                    netLogDB.onError);
            });
        },
        /**
         * returns a list of all friends.
         */
        getAllFriends:function(handler){
            var friends=[];
            netLogDB.db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM friends;",
                    [],
                    function(tx,results) {
                        for (i = 0; i < results.rows.length; i++) {
                            friends.push(results.rows.item(i));
                        }
                        handler(friends);
                    });
            },
            netLogDB.onError);
        },
        /**
         * get a friend item with unique netlog id.
         */
        getFriendByUID:function(uid,handler){
            var friends=[];
            netLogDB.db.transaction(function(tx) {
                tx.executeSql("SELECT * FROM friends where uid=? ;",
                    [uid],
                    function(tx,results) {
                        for (i = 0; i < results.rows.length; i++) {
                            friends.push(util.clone(results.rows.item(i)));
                        }
                        handler(friends);
                    });
            },
            netLogDB.onError);
        },
        /**
         * netlog error function.
         */
        onError: function(tx,error) {
            console.log("Error occurred: ", error);
        }
    }
    $(function(){
        netLogDB.setup();
    });
    return netLogDB;
}
var netLogDB=new NetLogDB();
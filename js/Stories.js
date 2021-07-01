firebase.auth().onAuthStateChanged((user) => {
    if(user){
        let user = firebase.auth().currentUser;
        let uid;
        if(user != null){
            uid = user.uid;
        }
        var path = window.location.pathname;
        var page = path.split("/").pop();

        console.log(page);
        console.log(uid);

        storiesRef = firebase.database().ref('/stories');
        if (storiesRef!= null){
            document.getElementById("storiesNull").style.display = "none";
            if(page == "publicStories.html"){
            
                viewStories();
            }else if(page == "myStories.html"){
                
                viewMyStories(uid);
            }
        }else{
            document.getElementById("storiesNull").style.display = "block";
            
        }
        
    }else{
        alert("No Active user");
    }
});

function viewStories(){
    const today = new Date().toISOString();
    storiesRef = firebase.database().ref('/stories');
    storiesRef.on('value',
    function(rec){
        rec.forEach(
            function(currentrec){  
                var username = getUsernameById(currentrec.val().userid);          
                document.getElementById("storiesContainer").innerHTML += `
                <div class="stories" id="storiesY">
                    <div class="dp-potrait">
                        <img src="images/profilePicture.svg" alt="">
                    </div>
        
                    <h4 id="usernameDisp">
                        ${username}
                    </h4>
                    
                    <hr style="width: 70%; text-align: center; background-color: #838b8f;">
                    <p class="storiesContent" id="storiesContent">
                        ${currentrec.val().storyContent}
                    </p>
                    <div class="dateAndLikes" id="dateAndLikes">
                        <p id="dateDisp">
                        ${currentrec.val().date}
                        </p> 
                        <p style="font-size:1.4em" id="likesCount">
                            <i class="fas fa-heart" onclick="likeStories(${currentrec.key})" style="cursor:pointer; color:#808080"></i>  ${currentrec.val().likesCount}
                        </p>
                    </div>
                </div>
                
                `
            }
        )
    })

}

function addStories(){
    var storyText = document.getElementById("content").value;
    var currDate = new Date().toISOString().slice(0,10);
    let user = firebase.auth().currentUser;
    let uid;
    let uname;
    if(user != null){
        uid = user.uid;
        let firebaseRefKey = firebase.database().ref('/users').child(uid);
        firebaseRefKey.on("value", (dataSnapshot)=>{            
            uname = dataSnapshot.val().username;
            console.log(uname);
            var storyRef = firebase.database().ref('/stories');
            var storyData = {
                userid : uid,
                storyContent : storyText,
                date : currDate,
                likesCount : 0
            }

            const autoId = storyRef.push().key;
            storyRef.child(autoId).set(storyData);
            document.getElementById("content").value = "";
            alert("Story posted!");            
            document.getElementById("myModal").style.display = "none";
                
        });    
        
        
    }
    
    
}

function viewMyStories(userid){
    const today = new Date().toISOString();
    let storiesRef = firebase.database().ref('/stories').orderByChild('userid').equalTo(userid);
    let reversed;
    storiesRef.on('value',
    function(rec){
        rec.forEach(
            function(currentrec){    
                var username = getUsernameById(currentrec.val().userid) ; 

                console.log(username);      
                document.getElementById("storiesContainer").innerHTML += `
                <div class="stories" id="storiesY">
                    <div class="dp-potrait">
                        <img src="images/profilePicture.svg" alt="">
                    </div>
        
                    <h4 id="usernameDisp">
                        ${username}
                    </h4>
                    
                    <hr style="width: 70%; text-align: center; background-color: #838b8f;">
                    <p class="storiesContent" id="storiesContent">
                        ${currentrec.val().storyContent}
                    </p>
                    <div class="dateAndLikes" id="dateAndLikes">
                        <p id="dateDisp">
                        ${currentrec.val().date}
                        </p> 
                        <p style="font-size:1.4em">
                            <i class="fas fa-trash-alt" onclick="deleteStories(${currentrec.key})" style="cursor:pointer"></i>
                            <i class="fas fa-heart" onclick="likeStories(${currentrec.key})" id="like-btn" style="cursor:pointer;"></i> ${currentrec.val().likesCount}
                        </p>
                    </div>
                </div>
                
                `
            }
        )
    })
}

function deleteStories(storyid){
    console.log(storyid);
    var a = confirm("Are you sure want to delete this story?"); 
    if(a){
        var stories = firebase.database().ref('/stories/' + storyid);
        stories.remove();
        alert("Story deleted.");
    }

}

function likeStories(storyid){
    console.log(storyid);
    var likesCountRef = firebase.database(). ref('/stories/' + storyid + '/likesCount');
    likesCountRef.on('value', (snapshot)=>{
        const data = snapshot.val();
        data = data + 1;
    })
}

function countInsight(){

}

function logOut(){
    var ans = confirm("Are you sure want to log out?");
    if (ans == true){
        firebase.auth().signOut().then(function(){
            alert("Logged out. See you!");
            window.location.href = "homepage.html"
        }).catch(function(error){
            alert(error.message)
        })
    }
    
}

function getUsernameById(userid){
    var userRef = firebase.database().ref('/users/'+ userid);
    console.log(userid);
    //var username;
    userRef.on('value', (snapshot)=>{
        var username = snapshot.val().username;
        console.log(username);
        return username;
    });
    //return username;
}

function reverseData(object){
    var newData = {};
    var keys = [];

    for(var key in object){
        keys.push(key);
    }

    for (var i = keys.length - 1; i >=0 ; i--){
        var value = object[keys[i]];
        newData[keys[i]] = value;
    }
    console.log(newData);
    return newData;
}

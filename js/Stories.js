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
                document.getElementById("storiesContainer").innerHTML += `
                <div class="stories" id="storiesY">
                    <div class="dp-potrait">
                        <img src="images/profilePicture.svg" alt="">
                    </div>
        
                    <h4 id="usernameDisp">
                        ${currentrec.val().username}
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
                username : uname,
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
    storiesRef = firebase.database().ref('/stories').orderByChild('userid').equalTo(userid);
    storiesRef.on('value',
    function(rec){
        rec.forEach(
            function(currentrec){            
                document.getElementById("storiesContainer").innerHTML += `
                <div class="stories" id="storiesY">
                    <div class="dp-potrait">
                        <img src="images/profilePicture.svg" alt="">
                    </div>
        
                    <h4 id="usernameDisp">
                        ${currentrec.val().username}
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

function deleteStories(id){
    var a = confirm("Are you sure want to delete this story?"); 
    if(a){
        var stories = firebase.database().ref('/stories').child(id);
        stories.remove();
        alert("Story deleted.");
    }

}

function likeStories(storyid){
    console.log(storyid);
}

function countInsight(){

}

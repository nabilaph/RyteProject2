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
        function (rec) {
            const data = rec.val()
            const name = Object.getOwnPropertyNames(data);
            const datArr = [];
            for (let i = 0; i < name.length; i++) {
                const id = name[i];
                datArr.push(data[id]);
            }
            const val = datArr.reverse();
            
 		 console.log(datArr);
            console.log(name);
		 const namerev = name.reverse();
		console.log(namerev);	
            let i = 0;
        val.forEach(
            function(currentrec){ 
            	var userRef = firebase.database().ref('/users/'+ currentrec.userid);
			    var username;
                userRef.once('value', (snapshot) => {
                    
			         username = snapshot.val().username;
				   

			
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
                        ${currentrec.storyContent}
                    </p>
                    <div class="dateAndLikes" id="dateAndLikes">
                        <p id="dateDisp">
                        ${currentrec.date}
                        </p> 
                        <p style="font-size:1.4em" id="likesCount">
                            <i class="fas fa-heart" id="like-btn" onclick="checkLikes('${namerev[i]}')" style="cursor:pointer; color:#808080"></i>  ${currentrec.likesCount}
                        </p>
                    </div>
                </div>
                
                `
                    i++;
    });
                
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
            var path = window.location.pathname;
        	 var page = path.split("/").pop();
 		 if(page == "publicStories.html"){
            
                window.location.href = "publicStories.html";
            }else if(page == "myStories.html"){
                
                window.location.href = "myStories.html";
            }else if(page == "pofile.html"){
                
                window.location.href = "pofile.html";
            }

        });    
        
    }
    
    
}

function viewMyStories(uid){

    let storiesRef = firebase.database().ref('/stories').orderByChild('userid').equalTo(uid);
    storiesRef.on('value',
        function (rec) {
            const data = rec.val()
            const name = Object.getOwnPropertyNames(data);
            const datArr = [];

            for (let i = 0; i < name.length; i++) {
                const id = name[i];
                datArr.push(data[id]);
            }
            const val = datArr;
            
 		 console.log(datArr);
            console.log(name);
		 const namerev = name.reverse();
		 console.log(namerev);	
            let i = 0;

        val.forEach(
            function(currentrec){ 
            	var userRef = firebase.database().ref('/users/'+ currentrec.userid);
			    var username;
                userRef.once('value', (snapshot) => {
                    
			         username = snapshot.val().username;
				   

			
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
			                    ${currentrec.storyContent}
			                </p>
			                <div class="dateAndLikes" id="dateAndLikes">
			                    <p id="dateDisp">
			                    ${currentrec.date}
			                    </p> 
			                    <p style="font-size:1.4em">
			                        <i class="fas fa-trash-alt" onclick="deleteStories('${name[i]}')" style="cursor:pointer"></i>
			                        <i class="fas fa-heart" onclick="checkLikes('${name[i]}')" id="like-btn" style="cursor:pointer;"></i> ${currentrec.likesCount}
			                    </p>
			                </div>
			            </div>
			            
			            `
                    i++;
    });
                
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
        var path = window.location.pathname;
        	 var page = path.split("/").pop();
 		 if(page == "publicStories.html"){
            
                window.location.href = "publicStories.html";
            }else if(page == "myStories.html"){
                
                window.location.href = "myStories.html";
            }else if(page == "pofile.html"){
                
                window.location.href = "pofile.html";
            }

    }

}

function addLikeCount(storyid){
    var likeRef = firebase.database().ref('/stories/'+storyid);
    likeRef.child('likesCount').once('value', function(snapshot) {
        var currentLikes = snapshot.val() ? snapshot.val() : 0;
        likeRef.update({
            'likesCount': currentLikes + 1
            }, function(error) {
              if (error) {
                console.log('Data could not be saved:' + error);
              } else {
                console.log('Data saved successfully');
              }
            });
    }); 
    
}

function removeLikeCount(storyid){
var user = firebase.auth().currentUser;
var userid;
   if(user !== null){
	userid = user.uid;

   }

    var likeRef = firebase.database().ref('/stories/'+storyid);
likeRef.child('likesCount').once('value', function(snapshot) {
        var currentLikes = snapshot.val() ? snapshot.val() : 0;
        likeRef.update({
            'likesCount': currentLikes - 1
            }, function(error) {
              if (error) {
                console.log('Data could not be saved:' + error);
              } else {
                console.log('Data saved successfully');
              }
            });
    }); 
    
        
}


function likeStories(storyid){
   var user = firebase.auth().currentUser;
   var uid;
   if(user !== null){
       uid = user.uid;
       
    }
    
    // const storyRef = firebase.database().ref("/likeStories/" + storyid);
    // const key = storyRef.key;
    // console.log(key)
    

   let likestoriesRef = firebase.database().ref("/likeStories/"+storyid);
   let likeData = {
       'like' : true
    }
   likestoriesRef.child(uid).set(likeData);
   addLikeCount(storyid);
    alert("You liked the story!");
        var path = window.location.pathname;
        	 var page = path.split("/").pop();
 		 if(page == "publicStories.html"){
            
                window.location.href = "publicStories.html";
            }else if(page == "myStories.html"){
                
                window.location.href = "myStories.html";
            }else if(page == "pofile.html"){
                
                window.location.href = "pofile.html";
            }

}

function unlikeStories(storyid){
   var user = firebase.auth().currentUser;
   var uid;
   if(user !== null){
	uid = user.uid;

   }

   let unlikestoriesRef = firebase.database().ref("/likeStories/"+storyid + "/" + uid);
   unlikestoriesRef.remove();
   removeLikeCount(storyid);
    alert("You unliked the story");
        var path = window.location.pathname;
        	 var page = path.split("/").pop();
 		 if(page == "publicStories.html"){
            
                window.location.href = "publicStories.html";
            }else if(page == "myStories.html"){
                
                window.location.href = "myStories.html";
            }else if(page == "pofile.html"){
                
                window.location.href = "pofile.html";
            }

}

function checkLikes(storyid){
   var user = firebase.auth().currentUser;
    var uid;
   if(user !== null){
	uid = user.uid;

   }

    let likeRef = firebase.database().ref("/likeStories/" + storyid + "/" + uid + "/");
    likeRef.once("value", (snapshot) => {
        const res = snapshot.val();
        console.log(res);

        if (res !== null) {
            unlikeStories(storyid);
            // window.location.href = "myStories.html";
        } else {
            likeStories(storyid);
            // window.location.href = "myStories.html";
        }
    });
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

function addUser(){
    var fullnameText = document.getElementById("fullname").value;
    var usernameText = document.getElementById("username").value;
    var passwordText = document.getElementById("password").value;
    var emailText = document.getElementById("email").value;

    firebase.auth().createUserWithEmailAndPassword(emailText, passwordText)
    .then((success)=>{
        var user = firebase.auth().currentUser;
        var uid;
        if(user!= null){
            uid = user.uid;
        }

        var userRef = firebase.database().ref('/users');
        var userData = {
            userid : uid,
            fullname : fullnameText,
            username : usernameText,
            email : emailText,
            password : passwordText
        }
        userRef.child(uid).set(userData);
        alert("Account registered!");
        window.location.href = "loginpage.html";
    }).catch((error)=>{
        alert(error.code + " " + error.message);
    })
};

function logIn(){
    var passwordText = document.getElementById("password").value;
    var emailText = document.getElementById("email").value;

    firebase.auth().signInWithEmailAndPassword(emailText, passwordText)
    .then((success)=>{        
        alert("Account logged in!");
        window.location.href= "publicStories.html";
    }).catch((error)=>{
        alert(error.code + " " + error.message);
    })

};

firebase.auth().onAuthStateChanged((user) => {
    if(user){
        let user = firebase.auth().currentUser;
        let uid;
        if(user != null){
            uid = user.uid;
        }
        countInsight();
        let firebaseRefKey = firebase.database().ref('/users').child(uid);
        firebaseRefKey.on("value", (dataSnapshot)=>{
		
            var x = document.getElementById("fullname").tagName;
            console.log(x);
            if(x == "H5"){
                document.getElementById("fullname").innerHTML = dataSnapshot.val().fullname;
            
            }else if(x == "INPUT"){
                document.getElementById("fullname").value = dataSnapshot.val().fullname;
            
            }
            document.getElementById("username").value = dataSnapshot.val().username;
            document.getElementById("email").value = dataSnapshot.val().email;
            document.getElementById("password").value = dataSnapshot.val().password;
        })
    }else{
        alert("No Active user");
    }
});

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

function updateProfile(){
    var fullnameText = document.getElementById("fullname").value;
    var usernameText = document.getElementById("username").value;
    var passwordText = document.getElementById("password").value;
    var emailText = document.getElementById("email").value;

    let user = firebase.auth().currentUser;
    let uid;
    if(user != null){
        uid = user.uid;
    }
    let usersRef = firebase.database().ref('/users');
    const newData ={
        fullname : fullnameText,
        username : usernameText,
        email : emailText,
        password : passwordText
    };
	updateUsernameInStories(usernameText);
    usersRef.child(uid).update(newData);
    
    alert("Profile Data Updated!");
    window.location.href ="pofile.html";
}

function countInsight(){
    let user = firebase.auth().currentUser;
    let uid;
    if(user != null){
        uid = user.uid;
    }
    console.log(uid);
    let storiesRef = firebase.database().ref('/stories').orderByChild('userid').equalTo(uid);
    storiesRef.on('value',(snapshot)=>{
        var countStories=snapshot.numChildren();
        var countLikes=0; 
        snapshot.forEach(
            function(rec){
                countLikes=countLikes+rec.val().likesCount;
            }
        );
        console.log(countLikes);
        var insightRef=firebase.database().ref('/insight');
        var insightData={
            userid:uid,
            storiesCount:countStories,
            likesCount:countLikes,
        }
        insightRef.child(uid).set(insightData);
        document.getElementById('postCount').innerHTML=countStories;
        document.getElementById('likesCount').innerHTML=countLikes;
    })
}

function updateUsernameInStories(usernameNew){

    let user = firebase.auth().currentUser;
        let uid;
        if(user != null){
            uid = user.uid;
        }
    let storiesref = firebase.database().ref('/stories').orderByChild('userid').equalTo(uid);
     storiesref.once('value',(snapshot)=>
	   snapshot.forEach(
		function(rec){
		    let usernameData ={
                    username : usernameNew
               };
			console.log(rec.key);
                firebase.database().ref('/stories').child(rec.key).update(usernameData);
           }
        )
     )

}




import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, get, child, set, ref as refDB, update} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getStorage, ref as sRef,uploadBytesResumable, getDownloadURL} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";
const auth = getAuth();
const db = getDatabase();
const dbref = refDB(db)

let uid;
const content = document.getElementById("content");

onAuthStateChanged(auth,(user) => {
    if (user.emailVerified) {
      uid = user.uid
      get(child(dbref, "userAuthList")).then((snapshot) => {
        snapshot.forEach((res) => {
            let container = document.createElement("div")
            container.setAttribute("class", "container")

            let profImgContainer = document.createElement("div")
            profImgContainer.setAttribute("class", "imgContainer")

            let profImg = document.createElement("img");
            if(res.val().ProfilePicture == "" || res.val().ProfilePicture == undefined){
              profImg.setAttribute(
                "src", 
                "https://nullchiropractic.com/wp-content/uploads/2017/11/profile-default-male-768x768.jpg"
              )
            }

            else if(res.val().ProfilePicture !== ""){
              profImg.setAttribute("src", res.val().ProfilePicture)
            }
            profImgContainer.appendChild(profImg)
            container.appendChild(profImgContainer)

            let nameDiv = document.createElement('div')
            nameDiv.setAttribute("class", "nameDiv")

            let name = document.createElement("h6")
            name.setAttribute("class", "name")
            name.innerHTML = res.val().username
            nameDiv.appendChild(name)
            container.appendChild(nameDiv)

            let date = document.createElement("h7")
            date.setAttribute("class", "date")
            date.innerHTML = res.val().date
            date.style.color = "black"
            nameDiv.appendChild(date)

            let uid = document.createElement("h6");
            uid.setAttribute("class", "userUid")
            uid.innerHTML = res.val().uid
            uid.style.display = "none"
            nameDiv.appendChild(uid)

            // let addFriendBtn = document.createElement("button");
            // addFriendBtn.setAttribute("class", "addFriendBtn")
            // addFriendBtn.innerHTML = "Add Friend"
            // container.appendChild(addFriendBtn)

            content.appendChild(container)
            // addFriendBtn.addEventListener('click', function(event){
              
            //   addFriendBtn.innerHTML = "Request Sent"
              
            // })
        })
      })
    } else {
      window.location.assign("../html/login.html");
    }
})


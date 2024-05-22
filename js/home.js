import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, get, child, set, ref as refDB, update} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getStorage, ref as sRef,uploadBytesResumable, getDownloadURL} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";
const auth = getAuth();
const db = getDatabase();
const dbref = refDB(db)

var showposts = document.getElementById("showposts");
var messageDiv = document.getElementById("messagediv")
var load = document.getElementById("load")
let uid;

onAuthStateChanged(auth,(user) => {
  if (user) {
    
    if (user.emailVerified) {
      uid = user.uid
      console.log(uid);
    }
  } else {
    window.location.assign("../html/login.html");
  }
  let posts = []
        
        get(child(dbref, `posts/`)).then((snapshot) => {
          if(snapshot.size === 0 ){
            messageDiv.style.display = "flex"
            load.style.display = "none"
          }

          else{
            load.style.display = "none"
            snapshot.forEach((postRes) => {
              posts.push(postRes)
              console.log(posts);

              let container = document.createElement("div")
              container.setAttribute("class", "container")

              let imgContainer = document.createElement("div")
              imgContainer.setAttribute("class", "imgContainer")

              let text = document.createElement("div")
              text.setAttribute("class", "textDiv")

              let userInfo = document.createElement("div")
              userInfo.setAttribute("class", "userInfo");

              //get user icon and name
              let userFav = document.createElement("img")
              userFav.setAttribute("class", "userFav")
              get(child(dbref, "userAuthList/" + postRes.val().userPost)).then((res) => {
                if(res.val().ProfilePicture !== ""){
                  userFav.setAttribute(
                      "src", 
                      res.val().ProfilePicture
                  )
                }

                if(res.val().ProfilePicture == ""){
                  userFav.setAttribute(
                    "src", 
                    "https://nullchiropractic.com/wp-content/uploads/2017/11/profile-default-male-768x768.jpg"
                )
                }
              })
              userInfo.appendChild(userFav)

              let userNamePost = document.createElement("h5")
              userNamePost.setAttribute("class", "userNamePost")
              get(child(dbref, "userAuthList/" + postRes.val().userPost)).then((res) => {
                userNamePost.innerHTML = res.val().username
              })
              userInfo.appendChild(userNamePost)

              text.appendChild(userInfo)

              //get post data
              let postVal = document.createElement("h6");
              postVal.setAttribute("class", "postVal");
              postVal.innerHTML = postRes.val().postValue;
              text.appendChild(postVal)

              let postDate = document.createElement("h7")
              postDate.setAttribute("class", "postDate")
              postDate.innerHTML = postRes.val().date
              text.appendChild(postDate)
              container.appendChild(text)
              
              let img = document.createElement("img")
              img.setAttribute("class", "postImg")
              img.setAttribute("src", postRes.val().ImgURL)
              imgContainer.appendChild(img)
              container.appendChild(imgContainer)

              //get reaction
              let reactDiv = document.createElement("div")
              reactDiv.setAttribute("class", "reactDiv")

              let likeBtn = document.createElement("i")
              likeBtn.setAttribute("class" , "fa-solid fa-thumbs-up")
              reactDiv.appendChild(likeBtn)

              let dislikeBtn = document.createElement("i")
              dislikeBtn.setAttribute("class" , "fa-solid fa-thumbs-down")
              reactDiv.appendChild(dislikeBtn)

              let likeArray = document.createElement("h5")
              likeArray.setAttribute("class", "reactArray")
              likeArray.innerHTML = postRes.val().like
              likeBtn.appendChild(likeArray)

              let dislikeArray = document.createElement("h5")
              dislikeArray.setAttribute("class", "reactArray")
              dislikeArray.innerHTML = postRes.val().dislikes
              dislikeBtn.appendChild(dislikeArray)
              
              //add in
              container.appendChild(reactDiv)
              showposts.appendChild(container)
            });
              
          }
        })
});

let signOutBtn = document.getElementById("signOutBtn");

    let SignOut = () =>{
      sessionStorage.removeItem("user-creds");
      sessionStorage.removeItem("user-info");
      window.location.href = "./login.html"
    }
    signOutBtn.addEventListener('click', SignOut);
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, get, child, set, ref as refDB, update, remove, push } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";
const auth = getAuth();
const db = getDatabase();
const dbref = refDB(db)

var showposts = document.getElementById("showposts");
var messageDiv = document.getElementById("messagediv")
var load = document.getElementById("load")
let uid
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (user.emailVerified) {
      uid = user.uid
      console.log(uid);
    }
  } else {
    window.location.assign("../html/login.html");
  }
  let posts = []
  get(child(dbref, `posts`)).then((snapshot) => {
    if (snapshot.size === 0) {
      messageDiv.style.display = "flex"
      load.style.display = "none"
    }

    else {
      load.style.display = "none"
      snapshot.forEach((postRes) => {
        posts.push(postRes)
        var postID = postRes.val().postKey

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
          if (res.val().ProfilePicture !== "") {
            userFav.setAttribute(
              "src",
              res.val().ProfilePicture
            )
          }

          if (res.val().ProfilePicture == "") {
            userFav.setAttribute(
              "src",
              "https://nullchiropractic.com/wp-content/uploads/2017/11/profile-default-male-768x768.jpg"
            )
          }
        })
        userInfo.appendChild(userFav)

        let colSpec = document.createElement("div")
        colSpec.setAttribute("class", "colSpec")
        userInfo.appendChild(colSpec)

        let userNamePost = document.createElement("h5")
        userNamePost.setAttribute("class", "userNamePost")
        get(child(dbref, "userAuthList/" + postRes.val().userPost)).then((res) => {
          userNamePost.innerHTML = res.val().username
        })
        colSpec.appendChild(userNamePost)

        text.appendChild(userInfo)

        //get post data
        let postDate = document.createElement("h7")
        postDate.setAttribute("class", "postDate")
        postDate.innerHTML = postRes.val().date
        colSpec.appendChild(postDate)

        let postTime = document.createElement("h7")
        postTime.setAttribute("class", "postTime")
        postTime.innerHTML = postRes.val().time
        colSpec.appendChild(postTime)

        let postVal = document.createElement("h6");
        postVal.setAttribute("class", "postVal");
        postVal.innerHTML = postRes.val().postValue;
        text.appendChild(postVal)

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
        likeBtn.setAttribute("class", "fa-solid fa-heart")
        reactDiv.appendChild(likeBtn)

        let likeTitle = document.createElement("h5")
        likeTitle.setAttribute("class", "reactArray")
        likeTitle.innerHTML = postRes.val().like
        likeTitle.style.color = "black"
        likeBtn.appendChild(likeTitle)

        get(child(dbref, `likes/${postID}/`)).then((res) => {
          likeTitle.innerHTML = res.size
        })

        //button like
        likeBtn.addEventListener("click", likePost)
        function likePost() {
          var user = auth.currentUser;
          if (user) {
            get(child(dbref, `likes/${postID}/${uid}`)).then((snapshot) => {
              if (snapshot.val() == true) {
                remove(refDB(db, `likes/${postID}/${uid}`))
                likeBtn.style.color = "white"
                location.reload()
              }
              else {
                var userUid = user.uid;
                var postRef = refDB(db, `likes/${postID}/${userUid}`)
                // set(refDB(db,`likes/${postID}/${userUid}`, true))
                set(postRef, true)
                  .then(() => {
                    updateLikeButton()
                    console.log("Successed");
                    location.reload()
                  })
                  .catch((error) => {
                    console.log(error);
                  })
              }
            })
          }
        }
        window.onload = updateLikeButton()
        function updateLikeButton() {
          get(child(dbref, `likes/${postID}/${uid}`)).then((snapshot) => {
            if (snapshot.val() == true) {
              likeBtn.style.color = "red"
            }
          })
        }

        let commentArray = document.createElement("div")
        commentArray.setAttribute("class", "commentDiv")

        let commentInput = document.createElement("textarea")
        commentInput.setAttribute("class", "commentInput")
        commentArray.appendChild(commentInput)

        let commentSendBtn = document.createElement("i")
        commentSendBtn.setAttribute("class", "fa-solid fa-paper-plane commentSendBtn")
        commentArray.appendChild(commentSendBtn);
        let dropDown = document.createElement("div")
        dropDown.setAttribute("id", "dropDownDiv")

        let dropDownShow = document.createElement("i")
        dropDown.appendChild(dropDownShow)
        dropDownShow.setAttribute("class", "fa-solid fa-angle-down dropdownbuttons")
        dropDownShow.setAttribute("id", "dropDownShow")
        dropDownShow.style.color = "black"

        let dropDownHide = document.createElement("i")
        dropDown.appendChild(dropDownHide)
        dropDownHide.setAttribute("class", "fa-solid fa-angle-up dropdownbuttons")
        dropDownHide.setAttribute("id", "dropDownHide")
        dropDownHide.style.display = "none"
        dropDownHide.style.color = "black"

        let commentDisplay = document.createElement("div")
        commentDisplay.setAttribute("class", "commentDisplay")
        commentDisplay.style.display = "none"

        commentSendBtn.addEventListener("click", function () {
          var hour = new Date().getHours()
          var min = new Date().getMinutes()
          var date = new Date().toLocaleDateString()
          if (commentInput.value == "") {
            alert("COMMENT SOMETHING")
          }

          else if (commentInput.value !== "") {
            // const refCommentDB = refDB(db, `comments/`+ postRes.val().postKey);
            let ID = postRes.val().postKey
            push(refDB(db, `comments/`+ ID), {
              postKey: postID,
              userUid: uid,
              comment: commentInput.value,
              date: date,
              time: hour + "h:" + min + "min",

            }).then(() => {
              commentInput.value = ""
              location.reload()
              console.log("comment sent");
            })
          }
        })

        get(child(dbref, `comments/${postID}`)).then((res) => {
          res.forEach((snapshot) => {
            let commentContainer = document.createElement("div")
            commentContainer.setAttribute("class", "commentContainer")

            let colSpecComment = document.createElement("div");
            colSpecComment.setAttribute("class", "colSpecComment")
            commentContainer.appendChild(colSpecComment)

            let userFavComment = document.createElement("img");
            userFavComment.setAttribute("class", "userFavComment")
            get(child(dbref, `userAuthList/${snapshot.val().userUid}`)).then((res) => {
              if (res.val().ProfilePicture !== "") {
                userFavComment.setAttribute(
                  "src",
                  res.val().ProfilePicture
                )
              }

              if (res.val().ProfilePicture == "") {
                userFavComment.setAttribute(
                  "src",
                  "https://nullchiropractic.com/wp-content/uploads/2017/11/profile-default-male-768x768.jpg"
                )
              }
            })
            colSpecComment.appendChild(userFavComment)

            let col = document.createElement("div")
            col.setAttribute("class", "col")
            colSpecComment.appendChild(col)

            let commentUsername = document.createElement("h5")
            commentUsername.setAttribute("class", "commentUsername");
            get(child(dbref, `userAuthList/${snapshot.val().userUid}`)).then((res) => {
              commentUsername.innerHTML = res.val().username
            })
            commentUsername.style.color = "black"
            col.appendChild(commentUsername)

            let incol = document.createElement("div")
            incol.setAttribute("class", "inCol")
            col.appendChild(incol);

            let commentTime = document.createElement("h6");
            commentTime.setAttribute("class", "commentTime");
            commentTime.innerHTML = snapshot.val().time
            incol.appendChild(commentTime)

            let commentDate = document.createElement("h6")
            commentDate.setAttribute("class", "commentDate")
            commentDate.innerHTML = snapshot.val().date;
            incol.appendChild(commentDate)

            let commentValue = document.createElement("p")
            commentValue.setAttribute("class", "commentVal")
            commentValue.innerHTML = snapshot.val().comment;
            commentContainer.appendChild(commentValue)
            commentDisplay.appendChild(commentContainer)
          })
        })

        //add in
        container.appendChild(reactDiv)
        container.appendChild(commentArray)
        container.appendChild(dropDown)
        dropDownShow.addEventListener("click",()=>{
          dropDownHide.style.display = "block"
          dropDownShow.style.display ="none"
          commentDisplay.style.display= "flex"
         })

         dropDownHide.addEventListener("click",()=>{
          dropDownHide.style.display = "none"
          dropDownShow.style.display ="block"
          commentDisplay.style.display= "none"
         })
        container.appendChild(commentDisplay)
        showposts.appendChild(container)
      });
    }
  })
});

let signOutBtn = document.getElementById("signOutBtn");

let SignOut = () => {
  sessionStorage.removeItem("user-creds");
  sessionStorage.removeItem("user-info");
  signOut(auth).then(() => {
    window.location.href = "./login.html"
  })
}
signOutBtn.addEventListener('click', SignOut);
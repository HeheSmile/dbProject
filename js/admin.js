import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyApxMylzZxo4C_p_OAoUuh5B5RnBrUpBCs",
  authDomain: "firedb1-4914e.firebaseapp.com",
  projectId: "firedb1-4914e",
  storageBucket: "firedb1-4914e.appspot.com",
  messagingSenderId: "274355745795",
  appId: "1:274355745795:web:7bd9613bd9dcdb8f918a36",
};

const app = initializeApp(firebaseConfig);
import {
  getDatabase,
  ref,
  get,
  set,
  child,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const db = getDatabase();
const dbref = ref(db);
const auth = getAuth(app);
//ref

var userNo = 0;
var tbody = document.getElementById("tbody1");

function addItemToTable(username, roleNo, uid) {
  let trow = document.createElement("tr");
  let td1 = document.createElement("td");
  let td2 = document.createElement("td");
  let td3 = document.createElement("td");
  var role = document.createElement("h6");
  let td4 = document.createElement("td");
  let changeRoleBtn = document.createElement("button");

  td1.innerHTML = ++userNo;
  td2.innerHTML = username;
  td4.innerHTML = uid;
  role.innerHTML = roleNo;
  td3.appendChild(role);
  
  let dropDown = document.createElement("div");
  dropDown.setAttribute("id", "dropDownDiv");
  let dropDownShow = document.createElement("i");
  dropDown.appendChild(dropDownShow);
  dropDownShow.setAttribute("class", "fa-solid fa-angle-down dropdownbuttons");
  dropDownShow.setAttribute("id", "dropDownShow");
  dropDownShow.style.color = "white";

  let dropDownHide = document.createElement("i");
  dropDown.appendChild(dropDownHide);
  dropDownHide.setAttribute("class", "fa-solid fa-angle-up dropdownbuttons");
  dropDownHide.setAttribute("id", "dropDownHide");
  dropDownHide.style.display = "none";
  dropDownHide.style.color = "white";

  let posts = document.createElement("div");
  posts.setAttribute("class", "userPosts");
  posts.style.display = "none";
  dropDown.appendChild(posts)

  get(child(dbref, `posts/`)).then((snapshot) => {
    snapshot.forEach((postRes) => {
      if (postRes.val().userPost == uid) {
        var postID = postRes.val().postKey;
        let container = document.createElement("div");
        container.setAttribute("class", "container");

        let imgContainer = document.createElement("div");
        imgContainer.setAttribute("class", "imgContainer");

        let text = document.createElement("div");
        text.setAttribute("class", "textDiv");

        //get post data
        let postVal = document.createElement("h6");
        postVal.setAttribute("class", "postVal");
        postVal.innerHTML = postRes.val().postValue;
        text.appendChild(postVal)

        let postDate = document.createElement("h7")
        postDate.setAttribute("class", "postDate")
        postDate.innerHTML = postRes.val().date
        text.appendChild(postDate)

        let postTime = document.createElement("h7")
        postTime.setAttribute("class", "postTime")
        postTime.innerHTML = postRes.val().time
        text.appendChild(postTime)

        let postValUpdate = document.createElement("input")
        postValUpdate.setAttribute("class", "postValInp")
        postValUpdate.style.color = "black"
        postValUpdate.style.backgroundColor = "white"
        postValUpdate.placeholder = "Fix anything you want"
        text.appendChild(postValUpdate)

        container.appendChild(text)
        let img = document.createElement("img")
        img.style.width = "50%"
        img.setAttribute("class", "postImg")
        img.setAttribute("src", postRes.val().ImgURL)
        imgContainer.appendChild(img)
        container.appendChild(imgContainer)

        let funcPost = document.createElement("div")
        funcPost.setAttribute("class", "funcPostDiv")
        container.appendChild(funcPost)

        let updatePost = document.createElement("button")
        updatePost.setAttribute("class", "updatePostBtn")
        updatePost.innerHTML = "Update"
        funcPost.appendChild(updatePost)

        let deletePost = document.createElement("button")
        deletePost.setAttribute("class", "deletePostBtn")
        deletePost.innerHTML = "Delete"
        funcPost.appendChild(deletePost)

        updatePost.addEventListener('click', function () {
          update(ref(db, "posts/" + postID), {
            postValue: postValUpdate.value,

          }).then(() => {
            alert("Updated")
            location.reload()
          })
          console.log(postRes.val().postKey)
        })

        deletePost.addEventListener('click', function () {
          remove(ref(db, "posts/" + postID)).then(() => {
            alert("Deleted")
            remove(ref(db, "likes/" + postRes.val().postKey))
            remove(refDB(db,`comments/${postRes.val().postKey}`))
            location.reload()
          })
          console.log(postRes.val().postKey)
        })

        let dropDownComment = document.createElement("div")
        dropDownComment.setAttribute("id", "dropDownDiv")
        container.appendChild(dropDownComment)
        let dropDownShowComment = document.createElement("i")
        dropDownComment.appendChild(dropDownShowComment)
        dropDownShowComment.setAttribute("class", "fa-solid fa-angle-down dropdownbuttons")
        dropDownShowComment.setAttribute("id", "dropDownShow")
        dropDownShowComment.style.color = "white"

        let dropDownHideComment = document.createElement("i")
        dropDownComment.appendChild(dropDownHideComment)
        dropDownHideComment.setAttribute("class", "fa-solid fa-angle-up dropdownbuttons")
        dropDownHideComment.setAttribute("id", "dropDownHide")
        dropDownHideComment.style.display = "none"
        dropDownHideComment.style.color = "white"

        let commentDisplay = document.createElement("div")
        commentDisplay.setAttribute("class", "commentDisplay")
        commentDisplay.style.display = "none"

        dropDownShowComment.addEventListener("click",()=>{
          dropDownHideComment.style.display = "block"
          dropDownShowComment.style.display ="none"
          commentDisplay.style.display= "flex"
         })

         dropDownHideComment.addEventListener("click",()=>{
          dropDownHideComment.style.display = "none"
          dropDownShowComment.style.display ="block"
          commentDisplay.style.display= "none"
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
        posts.appendChild(container)
        container.appendChild(commentDisplay)
      }
    });
  });

  dropDownShow.addEventListener("click", () => {
    dropDownHide.style.display = "block";
    dropDownShow.style.display = "none";
    posts.style.display = "flex";
  });

  dropDownHide.addEventListener("click", () => {
    dropDownHide.style.display = "none";
    dropDownShow.style.display = "block";
    posts.style.display = "none";
  });
  td3.appendChild(dropDown);

  changeRoleBtn.innerHTML = "Edit";
  changeRoleBtn.classList.add("change-button");
  td3.appendChild(changeRoleBtn);

  trow.appendChild(td1);
  trow.appendChild(td2);
  trow.appendChild(td3);
  trow.appendChild(td4);

  tbody.appendChild(trow);
}

function addItemOnce(user) {
  userNo = 0;
  tbody.innerHTML = "";
  user.forEach((element) => {
    addItemToTable(element.username, element.roleNo, element.uid);
  });
}

function getAllData() {
  const dbref = ref(db);
  get(child(dbref, "userAuthList")).then((snapshot) => {
    var users = [];
    snapshot.forEach((userSnapshot) => {
      users.push(userSnapshot.val());
    });
    addItemOnce(users);
  });
}

tbody.addEventListener("click", function (event) {
  if (event.target.classList.contains("change-button")) {
    let userUid = event.target
      .closest("tr")
      .querySelector("td:nth-child(4)").innerHTML;

    let currentRole = event.target.closest("td").querySelector("h6").innerHTML;

    if (currentRole !== null) {
      if (currentRole == 1) {
        updateRole(userUid, 0);
      } else if (currentRole == 0) {
        updateRole(userUid, 1);
      }
    }
  }
});

// Function to update role in the database
function updateRole(userUid, newRole) {
  const dbref = ref(db);
  update(ref(db, "userAuthList/" + userUid), {
    roleNo: newRole,
  })
    .then(() => {
      location.reload();
    })
    .catch((error) => {
      console.error("Error updating role: ", error);
    });
}

let signOutBtn = document.getElementById("signOutBtn");
signOutBtn.addEventListener("click", function () {
  signOut(auth).then(() => {
    window.location.href = "./login.html";
  });
});

const uploadProducts = () => { };
//   onAuthStateChanged(auth, (user) => {
//     if (user) {
//         if (user.emailVerified) {
//             setTimeout(() => {
//                 uid = user.uid
//             }, 1000);
//         }
//         else {
//             // login
//             setTimeout(() => {
//                 window.location.assign("../html/login.html");
//             }, 1000);
//         }
//     }
// });

onAuthStateChanged(auth, (user) => {
  let currentUser = user;
});

window.onload = getAllData;

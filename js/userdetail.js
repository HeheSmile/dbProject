import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, get, child, set, ref as refDB, update, remove} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"
import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getStorage, ref as sRef,uploadBytesResumable, getDownloadURL} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";
const auth = getAuth();
const db = getDatabase();
const dbref = refDB(db)

var postsshowbutton = document.getElementById("postsbutton");
var currentuserpost = document.getElementById("showposts");
var showuserprofilebutton = document.getElementById("userprofilebutton");
var load = document.getElementById("load")

const profileCoverImg = document.getElementById("userprofileimg");
const profileWallpaperImg = document.getElementById("usercoverimg")
var showposts = document.getElementById("showposts");
var messageDiv = document.getElementById("messagediv")

const inputUserCover = document.getElementById("inputforuserprofileimg")
const inputUserWallpaper = document.getElementById("inputforusercoverimg")
const userName = document.getElementById("userName")

const inputUsername = document.getElementById("username");
const inputDescription = document.getElementById("userdescription")
const userDataBtn = document.getElementById("updatedatabutton")
const description = document.getElementById("description")
var userdata = document.getElementById("editabledatadiv");
const messageData = userdata.message

let uid;
var files= [];
var fileName;
var fileExt;
var percentVal;
var reader = new FileReader()

onAuthStateChanged(auth,(user) => {
    console.log(user.uid)
    if (user.emailVerified) {
      uid = user.uid
      get(child(dbref, "userAuthList/" + uid)).then((res)=>{
        userName.innerHTML = res.val().username
        if(res.val().ProfilePicture !== ""){
          profileCoverImg.setAttribute(
            "src",
            res.val().ProfilePicture
          );
        }
        else if(res.val().ProfilePicture == ""){
          profileCoverImg.setAttribute(
            "src",
            "https://nullchiropractic.com/wp-content/uploads/2017/11/profile-default-male-768x768.jpg"
          );
        }

        if(res.val().CoverPicture !== ""){
          profileWallpaperImg.setAttribute(
            "src",
            res.val().CoverPicture
          )
        }
        else if( res.val().CoverPicture == ""){
          profileWallpaperImg.setAttribute(
            "src",
            "../assets/Wallpaper.png"
          )
        }

        if(res.val().Description !== ""){
          description.innerHTML = res.val().Description
        }

        if(res.val().Description == ""){
          description.innerHTML = "No Description"
        }
      })

    } else {
      window.location.assign("../html/login.html");
    }
        
        get(child(dbref, `posts/`)).then((snapshot) => {
              load.style.display = "none"
              snapshot.forEach((postRes) => {
                if(postRes.val().userPost !== uid){
                  messageDiv.style.display = "flex"
                  showposts.style.display = "none"
                }
                else{
                  let container = document.createElement("div")
                  container.setAttribute("class", "container")
    
                  let imgContainer = document.createElement("div")
                  imgContainer.setAttribute("class", "imgContainer")
    
                  let text = document.createElement("div")
                  text.setAttribute("class", "textDiv")
    
                  let postVal = document.createElement("h6");
                  postVal.setAttribute("class", "postVal");
                  postVal.innerHTML = postRes.val().postValue;
                  postVal.style.color = "black"
                  postVal.style.fontSize = "23px"
                  text.appendChild(postVal)

                  let postValUpdate = document.createElement("input")
                  postValUpdate.setAttribute("class", "postValInp")
                  postValUpdate.style.color = "black"
                  postValUpdate.style.backgroundColor = "white"
                  postValUpdate.placeholder = "Post a new feeling"
                  text.appendChild(postValUpdate)
    
                  let postDate = document.createElement("h7")
                  postDate.setAttribute("class", "postDate")
                  postDate.innerHTML = postRes.val().date
                  text.appendChild(postDate)

                  let postTime = document.createElement("h7")
                  postTime.setAttribute("class", "postTime")
                  postTime.innerHTML = postRes.val().time
                  text.appendChild(postTime)
    
                  container.appendChild(text)
    
                  let userPost = document.createElement("h4");
                  userPost.setAttribute("class", "userPost");
                  
                  let img = document.createElement("img")
                  img.setAttribute("class", "postImg")
                  img.setAttribute("src", postRes.val().ImgURL)
                  imgContainer.appendChild(img)
                  container.appendChild(imgContainer)
    
                  let reactDiv = document.createElement("div")
                  reactDiv.setAttribute("class", "reactDiv")
    
                  let likeBtn = document.createElement("i")
                  likeBtn.setAttribute("class" , "fa-solid fa-heart")
                  reactDiv.appendChild(likeBtn)

                  let likeTitle = document.createElement("h5")
                  likeTitle.setAttribute("class", "reactArray")
                  likeTitle.innerHTML = postRes.val().like
                  likeTitle.style.color = "black"
                  likeBtn.appendChild(likeTitle)

                  get(child(dbref, `likes/${postRes.val().postKey}/`)).then((res) => {
                    likeTitle.innerHTML = res.size
                  })

                  container.appendChild(reactDiv)

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

                  updatePost.addEventListener('click', function(){
                    update(refDB(db, "posts/" + postRes.val().postKey),{
                      postValue: postValUpdate.value,

                    }).then(() => {
                      alert("Updated")
                      location.reload()
                    })
                    console.log(postRes.val().postKey)
                  })

                  deletePost.addEventListener('click', function(){
                    remove(refDB(db, "posts/" + postRes.val().postKey)).then(() => {
                      alert("Deleted")
                      remove(refDB(db, "likes/" + postRes.val().postKey))
                      remove(refDB(db,`comments/${postRes.val().postKey}`))
                      location.reload()
                    })
                    console.log(postRes.val().postKey)
                  })
                  showposts.appendChild(container)
                }
              });
        })

    userDataBtn.onclick = function changeUserData(){
      if(inputDescription.value == "" && inputUsername.value == ""){
        alert("Nothing to update")
      }
      else if(inputDescription.value !== ""){
        update(refDB(db, `userAuthList/${uid}`),{
          Description: inputDescription.value
      })
        console.log("Done");
        location.reload()
      }

      else if(inputUsername.value !== ""){
        update(refDB(db, `userAuthList/${uid}`),{
          username: inputUsername.value,
      })
        console.log("Done");
        location.reload()
      }
    }
  });

  function getFileExt(file){
    var temp = file.name.split('.');
    var ext = temp.slice((temp.length-1), (temp.length));
    return '.'+ext[0]
  }
  
  function getFileName(file) {
    var temp = file.name.split(".")
    var fname = temp.slice(0,-1).join('.');
    return fname
  }
  
  async function changeCoverPic(e){
    files = e.target.files;
    var imgToUpload = files[0];
      fileName = getFileName(files[0])
      fileExt = getFileExt(files[0])
          var imgName = `${uid}/coverPic/${fileName}${fileExt}`;
          const metaData = {
              contentType: imgToUpload.type
          }
          const storage = getStorage()
          const storageRef = sRef(storage, `${uid} ${imgName}`)
          const UploadTask = uploadBytesResumable(storageRef, imgToUpload, metaData);
  
          UploadTask.on("state-changed", (snapshot) => {
              percentVal = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes)*100);
              console.log(percentVal);
          },
  
          (error) => {
                  console.log(error);
                  alert("error: image not uploaded")
          },
  
          () => {
              getDownloadURL(UploadTask.snapshot.ref).then((downloadURL) => {
                  saveCoverPicToRealtimeDB(downloadURL);    
              })    
          }            
        )
        console.log(files);
  }
  
  function saveCoverPicToRealtimeDB(URL) {
    console.log(URL);
    var d = new Date().toLocaleDateString();
    update(refDB(db, `userAuthList/${uid}`),{
        CoverPicture: URL
    })
    location.reload()
  }
  
  function changeProfilePic(e){
    files = e.target.files;
    var imgToUpload = files[0];
      fileName = getFileName(files[0])
      fileExt = getFileExt(files[0])
          var imgName = `${uid}/profilePic/${fileName}${fileExt}`;
          const metaData = {
              contentType: imgToUpload.type
          }
          const storage = getStorage()
          const storageRef = sRef(storage, `${uid} ${imgName}`)
          const UploadTask = uploadBytesResumable(storageRef, imgToUpload, metaData);
  
          UploadTask.on("state-changed", (snapshot) => {
              percentVal = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes)*100);
              console.log(percentVal);
          },
  
          (error) => {
                  console.log(error);
                  alert("error: image not uploaded")
          },
  
          () => {
              getDownloadURL(UploadTask.snapshot.ref).then((downloadURL) => {
                  saveProfilePicToRealtimeDB(downloadURL);    
              })    
          }            
        )
  }

  function saveProfilePicToRealtimeDB(URL) {
      console.log(URL);
      var d = new Date().toLocaleDateString();
      update(refDB(db, `userAuthList/${uid}`),{
          ProfilePicture: URL
      })
      location.reload()
    }

  inputUserWallpaper.onchange = changeCoverPic
  inputUserCover.onchange = changeProfilePic

  //post button
  postsshowbutton.addEventListener("click", () => {
    userdata.style.display = "none";
    currentuserpost.style.display = "block";
    description.style.display = "none"

    postsshowbutton.style.backgroundColor = "purple";
    postsshowbutton.style.color = "white";

    showuserprofilebutton.style.backgroundColor = "white";
    showuserprofilebutton.style.color = "black";
    document.getElementById("currentuserpostsdiv").style.display = "flex";
  });

  //show user btn
  showuserprofilebutton.addEventListener("click", () => {
    userdata.style.display = "block";
    currentuserpost.style.display = "none";
    description.style.display = "block"

    showuserprofilebutton.style.backgroundColor = "purple";
    showuserprofilebutton.style.color = "white";

    postsshowbutton.style.backgroundColor = "white";
    postsshowbutton.style.color = "black";
    document.getElementById("currentuserpostsdiv").style.display = "none";
  });

  let signOutBtn = document.getElementById("signOutBtn");
    let SignOut = () =>{
      signOut(auth).then(() => {
        window.location.href = "./login.html"
      })
    }
    signOutBtn.addEventListener('click', SignOut);
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, get, child, set, ref as refDB, update} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
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
var userdata = document.getElementById("editabledatadiv");
const messageData = userdata.message

let uid;
var files= [];
var fileName;
var fileExt;
var percentVal;
var reader = new FileReader()

onAuthStateChanged(auth,(user) => {
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
                  text.appendChild(postVal)
    
                  let postDate = document.createElement("h7")
                  postDate.setAttribute("class", "postDate")
                  postDate.innerHTML = postRes.val().date
                  text.appendChild(postDate)
    
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
                  
                  container.appendChild(reactDiv)
                  showposts.appendChild(container)
                }
              });
        })

    userDataBtn.onclick = function changeUserData(){
      if(inputUsername.value == ""){
        alert("Input something")
      }
  
      else if(inputUsername.value !== "" || inputDescription.value !== ""){
        update(refDB(db, `userAuthList/${uid}`),{
          username: inputUsername.value,
          Description: inputDescription.value
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

    postsshowbutton.style.backgroundColor = "purple";
    postsshowbutton.style.color = "white";

    showuserprofilebutton.style.backgroundColor = "black";
    showuserprofilebutton.style.color = "white";
    document.getElementById("currentuserpostsdiv").style.display = "flex";
  });

  //show user btn
  showuserprofilebutton.addEventListener("click", () => {
    userdata.style.display = "block";
    currentuserpost.style.display = "none";

    showuserprofilebutton.style.backgroundColor = "purple";
    showuserprofilebutton.style.color = "white";

    postsshowbutton.style.backgroundColor = "black";
    postsshowbutton.style.color = "white";
    document.getElementById("currentuserpostsdiv").style.display = "none";
  });

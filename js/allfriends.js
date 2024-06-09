import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, get, child, set, ref as refDB, update} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"
import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
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
          if(res.val().uid !== uid){
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

            let uid = document.createElement("h6");
            uid.setAttribute("class", "userUid")
            uid.innerHTML = res.val().uid
            uid.style.display = "none"
            nameDiv.appendChild(uid)

            let dropDown = document.createElement("div")
            nameDiv.appendChild(dropDown)
            dropDown.setAttribute("id", "dropDownDiv")
            
            let dropDownShow = document.createElement("i")
            dropDown.appendChild(dropDownShow)
            dropDownShow.setAttribute("class", "fa-solid fa-angle-down dropdownbuttons")
            dropDownShow.setAttribute("id", "dropDownShow")
            dropDownShow.style.color = "black"

            let dropDownHide = document.createElement("i")
            dropDown.appendChild(dropDownHide)
            dropDownHide.setAttribute("class" ,"fa-solid fa-angle-up dropdownbuttons")
            dropDownHide.setAttribute("id", "dropDownHide")
            dropDownHide.style.display = "none"
            dropDownHide.style.color = "black"


            let userProfDiv = document.createElement("div");
            userProfDiv.setAttribute("class", "userProfileDiv")
            userProfDiv.style.display = "none"
            nameDiv.appendChild(userProfDiv)

            let des = document.createElement("p")
            des.setAttribute("class", "description")
            userProfDiv.appendChild(des)
            if(res.val().Description == "" || res.val().Description == undefined){
              des.innerHTML = "No description"
              des.style.color = "black"
            }

            else if(res.val().Description !== ""){
              des.innerHTML = res.val().Description
              des.style.color = "black"
            }

            let date = document.createElement("h7")
            date.setAttribute("class", "date")
            date.innerHTML = res.val().date
            date.style.color = "black"
            userProfDiv.appendChild(date)

            dropDownShow.addEventListener("click",()=>{
              dropDownHide.style.display = "block"
              dropDownShow.style.display ="none"
              userProfDiv.style.display= "flex"
             })
  
             dropDownHide.addEventListener("click",()=>{
              dropDownHide.style.display = "none"
              dropDownShow.style.display ="block"
              userProfDiv.style.display= "none"
             })
            content.appendChild(container)
          }
        })
      })
    } else {
      window.location.assign("../html/login.html");
    }
})
let signOutBtn = document.getElementById("signOutBtn");
let SignOut = () =>{
  signOut(auth).then(() => {
    window.location.href = "./login.html"
  })
}
signOutBtn.addEventListener('click', SignOut);

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getStorage, ref as sRef ,uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js"
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getDatabase, get, child, set, ref as refDB } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"
const firebaseConfig = {
    apiKey: "AIzaSyApxMylzZxo4C_p_OAoUuh5B5RnBrUpBCs",
    authDomain: "firedb1-4914e.firebaseapp.com",
    projectId: "firedb1-4914e",
    storageBucket: "firedb1-4914e.appspot.com",
    messagingSenderId: "274355745795",
    appId: "1:274355745795:web:7bd9613bd9dcdb8f918a36"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const realdb = getDatabase();
const dbref = refDB(realdb)
const auth = getAuth()

const createPostBtn = document.getElementById("createPostIcon")
const uploadFilesBtn = document.getElementById("postFiles")

let postValue = document.getElementById("textarea")
let progressDiv = document.getElementById("progressDiv")
let progressBar = document.getElementById("progressBar")
let currentUser = ""
let url = ""
let fileType = ""
let done = document.getElementById("done")
let uid

let myImg = document.getElementById("myImg")
var extLab = document.getElementById("extLab");
var fileItem;
var fileText = document.getElementById("fileText")
var fileName;
var fileExt;
var percentVal;
var files= [];
var reader = new FileReader()

onAuthStateChanged(auth, (user) => {
    if (user) {
        if (user.emailVerified) {
            uid = user.uid
        }
        else {
            // login
            setTimeout(() => {
                window.location.assign("../html/login.html");
            }, 1000);
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

function getFile(e){
    files = e.target.files;
    fileName = getFileName(files[0])
    fileExt = getFileExt(files[0])
    fileText.innerHTML = fileName
    fileText.style.backgroundColor = "white"
    fileText.style.color = "black"
    extLab.innerHTML = fileExt
    extLab.style.backgroundColor = "white"
    extLab.style.color = "black"
    reader.readAsDataURL(files[0])
}

reader.onload = function () {
    myImg.src = reader.result
}

async function uploadImg(){
    var imgToUpload = files[0];
    fileName = getFileName(files[0])
    fileExt = getFileExt(files[0])
    if(!postValue.value || postValue.value == " "){
        alert("Input something for the post")
    }
    else if(postValue.value !== " "){
        var imgName = `${postValue.value}/${fileName}${fileExt}`;
        const metaData = {
            contentType: imgToUpload.type
        }
        const storage = getStorage()
        const storageRef = sRef(storage, "Posts/" + imgName)
        const UploadTask = uploadBytesResumable(storageRef, imgToUpload, metaData);

        UploadTask.on("state-changed", (snapshot) => {
            progressDiv.style.display = "block"
            percentVal = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes)*100);
            progressBar.style.color = "white"
            progressBar.style.width = `${percentVal}%`;
            progressBar.innerHTML = `${percentVal}%`

            if(progressBar.innerHTML == "100%"){
                done.style.display = "block"
                done.style.backgroundColor = "white"
                done.innerHTML = "DONE"
                progressDiv.style.display = "none"
            }
        },

        (error) => {
                console.log(error);
                alert("error: image not uploaded")
        },

        () => {
            getDownloadURL(UploadTask.snapshot.ref).then((downloadURL) => {
                saveURLtoRealTiemDB(downloadURL);    
            })    
        }            
        )
    }
}

function saveURLtoRealTiemDB(URL) {
    var name = fileText.innerHTML;  
    var ext = extLab.innerHTML;
    var hour = new Date().getHours()
    var min = new Date().getMinutes()
    var sec = new Date().getSeconds()
    var date = new Date().toLocaleDateString();
    set(refDB(realdb, `posts/` + postValue.value + name + hour + ":"+ min + ":" + sec),{
        userPost: uid,
        postValue: postValue.value,
        ImageName: (name+ext),
        ImgURL: URL,
        like: 0,
        dislikes: 0,
        comments: {},
        date: date,
    })
    console.log(uid);
}


    uploadFilesBtn.addEventListener("change", getFile)
    createPostBtn.addEventListener("click", uploadImg)

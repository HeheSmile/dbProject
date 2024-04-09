import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, get, child, set } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js"
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
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
const db = getDatabase();
const auth = getAuth(app)
const dbref = ref(db);

let postValue = document.getElementById("textarea")
let progressDiv = document.getElementById("progressDiv")
let progressBar = document.getElementById("progressBar")
let currentUser = ""
let url = ""
let fileType = ""
let done = document.getElementById("done")
let uid

onAuthStateChanged(auth, (user) => {
    if (user) {
        if (user.emailVerified) {
            setTimeout(() => {
                uid = user.uid
            }, 1000);
        }
        else {
            // login
            setTimeout(() => {
                window.location.assign("../html/login.html");
            }, 1000);
        }
    }
});

onAuthStateChanged(auth, (user) => {
    currentUser = user
})

const uploadimg = (event) => {
    fileType = event.target.files[0].type;
    const storage = getStorage();
    const uploadTask = storage().ref().child(`posts/${event.target.files[0]}`)

    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            var uploadPercentage = Math.round(progress)
            progressDiv.style.display = "block"
            progressBar.style.width = `${uploadPercentage}%`
            progressBar.innerHTML = `${uploadPercentage}%`
        },
        (error) => {
            console.log(error.message);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                url = downloadURL;
                done.style.display = "block"
                progressDiv.style.display = "none"
            });
        }
    );
}
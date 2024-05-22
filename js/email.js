import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, get, child, set, ref } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
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
const dbref = ref(db);
const auth = getAuth()
let id
let currentUser = ""

let email = document.getElementById("emailid");
let message = document.getElementById("message");
const reloadBtn = document.getElementById("reload");
const resendBtn = document.getElementById("resend");
onAuthStateChanged(auth,(user) => {
  if (user) {
    console.log(user);
    if (user.emailVerified) {
      window.location.assign("../html/home.html");
    } else {
      email.innerHTML = user.email;
    }
  } else {
    window.location.assign("../html/login.html");
  }
});
let resend = () => {
  sendEmailVerification(auth.currentUser)
      .then(() => {
        message.innerHTML =
          "A verification link has been send to your email account";
        message.style.color = "green";
        message.style.marginBottom = "15px";
      });
};

let reload = () => {
  location.reload();
};
reloadBtn.addEventListener("click", reload);
resendBtn.addEventListener("click", resend)
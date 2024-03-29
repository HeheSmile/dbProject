import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {getDatabase, ref, get, child}  from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"
import {
    getAuth, 
    signInWithEmailAndPassword, 
    signInAnonymously,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

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
const authEmail = getAuth(app)
const dbref = ref(db);
//ref
let nameBox = document.getElementById("nameBox");
let passBox = document.getElementById("passBox");
let emailBox = document.getElementById("emailBox");
let form = document.getElementById("form");

let signInUser = evt =>{
    evt.preventDefault();

signInWithEmailAndPassword(authEmail, emailBox.value, passBox.value)
    .then((credentials) => {
        get(child(dbref, 'userAuthList/' + credentials.user.uid)).then((snapshot) => {
            if(snapshot.exists){
                sessionStorage.setItem("user-info", JSON.stringify({
                    firstname: snapshot.val().firstname,
                    lastname: snapshot.val().lastname
                }))
                sessionStorage.setItem("user-creds", JSON.stringify(credentials.user));
                if(snapshot.val().roleNo == "0"){
                    window.location.href = ("./customer.html")
                }

                else if(snapshot.val().roleNo == "1"){
                    window.location.href = ("./admin.html")
                }
                
            }
        })
    })
    .catch((error) => {
        alert(error.message);
        console.log(error.code);
        console.log(error.message);
    })
}




//log in anonymous
const logInAnonBtn = document.getElementById("logInAnonBtn");
logInAnonBtn.addEventListener('click', event => {
    const auth = getAuth();
    signInAnonymously(auth)
    .then(() => {
        window.location.href = "../html/customer.html"
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
})

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    // ...
} else {
    // User is signed out
    // ...
}
console.log(user);
});

//assigns
form.addEventListener("submit", signInUser);
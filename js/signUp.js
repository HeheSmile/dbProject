import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {getDatabase, ref, set,} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, getDocs, setDoc, doc, collection, addDoc} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
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
const dbStore = getFirestore()
const auth = getAuth(app)

//ref
let fnameBox = document.getElementById("fnameBox");
let passBox = document.getElementById("passBox");
let emailBox = document.getElementById("emailBox");
let roleBox = document.getElementById("roleBox");
let form = document.getElementById("form");
let message = document.getElementById("message")

let RegisterUser = evt => {
    evt.preventDefault();
    createUserWithEmailAndPassword(auth, emailBox.value, passBox.value)
        .then((credentials) => {
            var d = new Date().toLocaleDateString();
            console.log("User Created, Credentails: " + credentials);
            set(ref(db, "userAuthList/" + credentials.user.uid), {
                username: fnameBox.value,
                email: emailBox.value,
                password: passBox.value,
                uid: credentials.user.uid,
                roleNo: roleBox.value,
                date: `${d}`,
                ProfilePicture: "",
                CoverPicture: "",
                Description: ""

            }).then(() =>{
                message.innerHTML = "Account was created successfully";
                message.style.color = "green";
                sendEmailVerification(auth.currentUser)
                            .then(() => {
                                setTimeout(()=>{
                                    window.location.assign("../html/login.html")
                                },1000)
                            })
            }) 
            
        })

        .catch((error) => {
            message.innerHTML = error.message;
            message.style.color = "red"
            console.log(error.message);
        })
}


//assigns
form.addEventListener("submit", RegisterUser);
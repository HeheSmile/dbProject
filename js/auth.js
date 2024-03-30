import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import {getDatabase, ref, get, child}  from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"
import {
    getAuth, 
    signInWithEmailAndPassword, 
    signInAnonymously,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut
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
                    window.location.href = ("../html/customer.html")
                }

                else if(snapshot.val().roleNo == "1"){
                    window.location.href = ("../html/admin.html")
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

//google sign in
const loginGoogleBtn = document.getElementById('logInGoogleBtn')
const provider = new GoogleAuthProvider(app);
const authGoogle = getAuth(app)
loginGoogleBtn.addEventListener('click', function(){
signInWithPopup(authGoogle, provider)
  .then((result, credentials) => {
    const user = result.user;
    sessionStorage.setItem("user-creds", JSON.stringify(user.email));
    sessionStorage.setItem("user-info", JSON.stringify(user.displayName))
    // const credential = GoogleAuthProvider.credentialFromResult(result);
    
    // window.location.href = ('../html/customer.html')
    
  }).
  catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
})

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



//assigns
form.addEventListener("submit", signInUser);
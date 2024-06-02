import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, get, child, set } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"
import {
    getAuth,
    signInWithEmailAndPassword,
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
const auth = getAuth(app)
const dbref = ref(db);
//ref
let passBox = document.getElementById("passBox");
let emailBox = document.getElementById("emailBox");
let form = document.getElementById("form");

let signInUser = evt => {
    evt.preventDefault();
    signInWithEmailAndPassword(auth, emailBox.value, passBox.value)
        .then((credentials) => {
            get(child(dbref, 'userAuthList/' + credentials.user.uid)).then((snapshot) => {
                if (snapshot.exists) {
                    sessionStorage.setItem("user-info", JSON.stringify(
                        snapshot.val().username
                    ))
                    sessionStorage.setItem("user-creds", JSON.stringify(credentials.user.email));
                    sessionStorage.setItem("user-uid", JSON.stringify(credentials.user.uid))
                    if (snapshot.val().roleNo == "0") {
                        window.location.href = ("../html/home.html")
                    }
                    

                    else if (snapshot.val().roleNo == "1") {
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
loginGoogleBtn.addEventListener('click', function () {
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            get(child(dbref, "userAuthList/" + user.providerData[0].uid)).then((snapshot) => {
                if(snapshot.exists){
                    sessionStorage.setItem("user-creds", JSON.stringify(user.email));
                    sessionStorage.setItem("user-info", JSON.stringify(user.displayName))
                    sessionStorage.setItem("user-uid", JSON.stringify(user.providerData[0].uid))

                    if (snapshot.val().roleNo == "0") {
                        window.location.href = ("../html/home.html")
                    }

                    else if (snapshot.val().roleNo == "1") {
                        window.location.href = ("../html/admin.html")
                    }
                }

                else{
                    set(ref(db, "userAuthList/" + user.providerData[0].uid), {
                        username: user.displayName,
                        email: user.email,
                        provider: user.providerData[0].providerId,
                        uid: user.providerData[0].uid,
                        roleNo: 0,
                        date: `${d}`,
                        profilePicture: "",
                        coverPicture: "",
                        description: ""
                    });
                    window.location.href = ('../html/home.html')
                }
            })
        })
        .catch((error) => {
            console.log(error);
        });
})

//log in anonymous
// const logInAnonBtn = document.getElementById("logInAnonBtn");
// logInAnonBtn.addEventListener('click', event => {
//     signInWithEmailAndPassword(auth, "anonymous@gmail.com", 123456)
//         .then((credentials) => {
//             get(child(dbref, 'userAuthList/' + credentials.user.uid))
//             .then((snapshot) => {
//                 if (snapshot.exists) {
//                     snapshot.emailVerified = true;
//                     sessionStorage.setItem("user-info", JSON.stringify(
//                         "Anonymous"
//                     ))
//                     sessionStorage.setItem("user-creds", JSON.stringify("Anonymous"));
//                     window.location.href = ("../html/home.html")
//                 }
//             })
//         })
//         .catch((error) => {
//             console.log(error.message);
//         });
// })



//assigns
form.addEventListener("submit", signInUser);
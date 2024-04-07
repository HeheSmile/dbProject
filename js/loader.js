import { getAuth, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
const auth = getAuth()
onAuthStateChanged(auth, (user) => {
    if (user) {
        if (user.emailVerified) {
            setTimeout(() => {
                window.location.assign("../html/home.html");
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
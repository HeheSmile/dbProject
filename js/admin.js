import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

    const firebaseConfig = {
      apiKey: "AIzaSyApxMylzZxo4C_p_OAoUuh5B5RnBrUpBCs",
      authDomain: "firedb1-4914e.firebaseapp.com",
      projectId: "firedb1-4914e",
      storageBucket: "firedb1-4914e.appspot.com",
      messagingSenderId: "274355745795",
      appId: "1:274355745795:web:7bd9613bd9dcdb8f918a36",
    };

    const app = initializeApp(firebaseConfig);
    import {getDatabase,ref,get,set,child,update,remove,} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

    const db = getDatabase();
    const auth = getAuth(app)
    //ref
    

    var userNo = 0;
    var tbody = document.getElementById("tbody1")

    function addItemToTable(username, roleNo, uid) {
      let trow = document.createElement("tr");
      let td1 = document.createElement("td");
      let td2 = document.createElement("td")
      let td3 = document.createElement("td")
      var role = document.createElement("h6")
      let td4 = document.createElement("td")
      let td5 = document.createElement("td")
      let changeRoleBtn = document.createElement("button")

      td1.innerHTML = ++userNo;
      td2.innerHTML = username;
      td4.innerHTML = uid;
      td5.innerHTML = provider;
      role.innerHTML = roleNo;
      td3.appendChild(role)

      changeRoleBtn.innerHTML = "Change Role?"
      changeRoleBtn.classList.add("change-button")
      td3.appendChild(changeRoleBtn)

      trow.appendChild(td1)
      trow.appendChild(td2)
      trow.appendChild(td3)
      trow.appendChild(td4)

      tbody.appendChild(trow)
    }

    function addItemOnce(user) {
      userNo = 0;
      tbody.innerHTML="";
      user.forEach(element => {
        addItemToTable(element.username, element.roleNo, element.uid);
      });
    } 

    function getAllData(){
      const dbref = ref(db)
      get(child(dbref, "userAuthList"))
      .then((snapshot)=>{
        var users = []
        snapshot.forEach(userSnapshot => {
          users.push(userSnapshot.val());
        })
        addItemOnce(users);
      })
    }

  tbody.addEventListener("click", function(event) {
    if (event.target.classList.contains("change-button")) {

      let userUid = event.target.closest("tr").querySelector("td:nth-child(4)").innerHTML;
      
      let currentRole = event.target.closest("td").querySelector("h6").innerHTML;

      if (currentRole !== null) {
        if(currentRole == 1){
          updateRole(userUid,0)
        }

        else if(currentRole == 0){
          updateRole(userUid,1)
        }
      }
    }
  });

  // Function to update role in the database
  function updateRole(userUid,newRole) {
    const dbref = ref(db);
      update(ref(db, "userAuthList/" + userUid),{
        roleNo: newRole
      })
      .then(() => {
        location.reload();
      })
      .catch((error) => {
        console.error("Error updating role: ", error);
      });
  }

  let signOutBtn = document.getElementById("signOutBtn");
    signOutBtn.addEventListener("click", function(){
      location.href = "./login.html";
  })

  const uploadProducts = () =>{
    
  }
//   onAuthStateChanged(auth, (user) => {
//     if (user) {
//         if (user.emailVerified) {
//             setTimeout(() => {
//                 uid = user.uid
//             }, 1000);
//         }
//         else {
//             // login
//             setTimeout(() => {
//                 window.location.assign("../html/login.html");
//             }, 1000);
//         }
//     }
// });

onAuthStateChanged(auth, (user) => {
    currentUser = user
})

    window.onload = getAllData;
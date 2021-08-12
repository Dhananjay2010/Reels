import { auth, signInWithGoogle, firestore } from "./firebase";
import { useContext, useEffect } from "react";
import { Redirect } from "react-router-dom";

import { AuthContext } from "./AuthProvider";

let Login = (props) => {
  let value = useContext(AuthContext);

  return (
    <div>
      {value ? <Redirect to="/home" /> : ""}

      <button onClick={signInWithGoogle}>Login With Google</button>
    </div>
  );
};

export default Login;




/*

let docRef = firestore.collection("users").doc(uid);

    ===> Agar users ya uid dono exist karte hain, to unka reference dega.
        Agar nhi exist karte hain to unka temporary reference dega.
        

        let document = await docRef.get();   // ==> .get() karne se bhi ek object dega promise resolve hone ke bad.


        if (!document.exits) { // ===> Document ke andar
          docRef.set({
            displayName,
            email,
            posts: [],
          });
        }
*/


/*
    Baat ye hai ki a auth.onAuthStateChanged ek subscription hai ,aur iski jaroorat login ko bhi hai  aur home ko bhi hai
    To hum isko unsubscribe nhi kar sakte login mai, isiliye humne iske liye alag se component banayenge jo ki parent hoga 
    Login  aur Home Dono Component ka. Taki is subscription ko dono use kar payein.
*/

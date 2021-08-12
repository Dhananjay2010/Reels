import { useState, createContext, useEffect } from "react";
import { auth, firestore } from "./firebase"; 

export const AuthContext=createContext();

let AuthProvider=({children})=>{

    let [currentUser, setcurrentUser]=useState(null);
    let [loading, setLoading]=useState(true); 


    useEffect(() => {
       let unsub= auth.onAuthStateChanged(async (user) => {
          if (user) {
            /*
                    If someone is signed in, the user has an object
                    but if there is no sign in, the user has value null.
                    */
            console.log(user);
            let { displayName, email, uid, photoURL } = user;
            // let uid = user.uid;
            // console.log(uid);
    
            let docRef = firestore.collection("users").doc(uid);
            let document = await docRef.get();
            if (!document.exits) {
              docRef.set({
                displayName,
                email,
                photoURL
              });
            }
    
            setcurrentUser({ displayName, email, uid, photoURL });
          } else {
            setcurrentUser(user); // => Agar login nhi hai to ye chalega
          }

          setLoading(false); // jaise he mera login ya logout wala kaam hojayega, loading ko false kardo.
        });

        return ()=>{
            unsub();
        }
      }, []);

    //   console.log(children); // ==> It gives array of objects of children of AuthProvider Component.

    
    return(

        <AuthContext.Provider value={currentUser}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;


/*
let {childeren} = props;
        or

let children= props.children;

props ko agar children milte hain to aise likhte hain.
Simple destructuring use kiya hai.


*/


/*
<AuthContext.Provider value={currentUser}>
            {!loading && children}
</AuthContext.Provider>


    AuthProvider component return karega ye AuthContext. Is AuthContext ke andar honge sare AuthProvider Component ke sare children.

    Ab AuthContext sare children ko apni value de payega. 


 Watch reels video-4 2:00:00;


*/
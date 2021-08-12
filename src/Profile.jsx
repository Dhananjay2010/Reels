import { AuthContext } from "./AuthProvider";
import { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { firestore } from "./firebase";
import "./Profile.css";

import {Link} from "react-router-dom";

let Profile = () => {
  let value = useContext(AuthContext);
  let [totalPosts, setTotalPosts]=useState(0);

  useEffect(() => {
    let f = async () => {
      let querySnapshot = await firestore
        .collection("posts")
        .where("username", "==", value.displayName)
        .get();

    console.log("size", querySnapshot.size); //==> Gives total no of posts of the particular user.

        setTotalPosts(querySnapshot.size);
    };
    f();
  }, []);

  return (
    <>
      {value ? (
        <div>
            <Link to="/home">
          <button>Back</button>

            </Link>
          <img className="image-profile" src={value.photoURL}></img>
          <p className="username-profile">{value.displayName}</p>
          <p className="ttpost">Total Posts: {totalPosts}</p>
        </div>
      ) : (
        <Redirect to="/login"></Redirect>
      )}
    </>
  );
};

export default Profile;

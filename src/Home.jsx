import { auth, storage, firestore } from "./firebase";
import { Redirect } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { useContext, useState, useEffect } from "react";
import VideoCard from "./VideoCard";
import "./Home.css";
import {Link} from "react-router-dom"; 

let Home = (props) => {
  let value = useContext(AuthContext);

  let [posts, setPosts] = useState([]);

  useEffect(() => {
    let unsubscription = firestore
      .collection("posts")
      .onSnapshot((querySnapshot) => {
        // Onsnapshot makes our database realTime

        setPosts(
          querySnapshot.docs.map((doc) => {
            // .doc gives us all the references of the documents.
            console.log(doc.data()); // This gives all the data of the posts collection.
            return { ...doc.data(), id: doc.id };
          })
        );
      });

    return () => {
      unsubscription(); // By this unsubscribed.
    };
  }, []);

  return (
    <div>
      {value ? (
        <>
          <div className="posts-container">
            {posts.map((post, i) => {
              return <VideoCard key={i} posts={post} />;
            })}
          </div>
          <button
            className="logout-btn"
            onClick={() => {
              auth.signOut();
            }}
          >
            Log out
          </button>
          <Link to="/profile">
            <button id="profile"><img src={value.photoURL}/></button>
          </Link>

          <input
            onClick={(e) => {
              e.target.value = null;
            }}
            onChange={(e) => {
              if (!e.target.files[0]) return;

              // console.log(e.target.files[0]); == > gives us an object regarding the details{ name, size, type etc } of the file uploaded.
              let { name, size, type } = e.target.files[0];

              let file = e.target.files[0];

              size = size / 1000000; //==> To convet the file size into MB.

              type = type.split("/")[0]; //==> Got the type of file.

              console.log(name, type, size);

              if (type != "video") {
                // If not a video, return directly
                alert("Please upload a video.");
                return;
              }

              if (size > 11) {
                // if size is greater than 11 MB, return
                alert("File is too big");
                return;
              }

              let f1 = (snapshot) => {
                // takes a snap shot of the process ( uploading ) as it is happening. Shows us the progress
                // console.log(snapshot.bytesTransferred); ==> Gives total bytes transferred.
                console.log(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100 + "%"
                );
              };

              let f2 = (error) => {
                // catches the errors
                console.log(error);
              };

              let f3 = () => {
                // provides us with the url of the video uploaded on firebase storage
                // Works only after the whole file is uploaded/
                uploadtask.snapshot.ref.getDownloadURL().then((url) => {
                  console.log(url);

                  firestore.collection("posts").add({
                    // created a posts collection which will contain all the posts of all the users.
                    username: value.displayName,
                    url,
                    likes: 0,
                    comments: [],
                  });
                });
              };

              let uploadtask = storage
                .ref(`/posts/${value.uid}/${Date.now() + name}`) // ==> Data.now() to make name unique.
                .put(file); //==> Is an async function and will upload our file at the given path.

              uploadtask.on("state_changed", f1, f2, f3);
              // Applied state changed event on the upload task which takes 3 function.
            }}
            className="upload-btn"
            type="file"
          />
        </>
      ) : (
        <Redirect to="/" />
      )}
    </div>
  );
};

export default Home;

/*
Redirect : Based on conditional rendering, hum kisi aur path pe redirect karwa dete hain
*/

/*
If you have created a subscription ( Talking realtime with the database like onSnapshot, onAuthStateChanged ) on a component and if you unmount the same component, so we should
unsubscribe before unmounting the component.

*/

import { useContext, useEffect, useState } from "react";
import { firestore } from "./firebase";

import { AuthContext } from "./AuthProvider";

let VideoCard = (props) => {
  let [boxOpen, setboxOpen] = useState(false);
  let [playing, setPlaying] = useState(false);
  let [currentUserComment, setCurrentUserComment] = useState("");
  let [allComments, setAllComments] = useState([]);

  let value = useContext(AuthContext);

  useEffect(() => {
    let f = async () => {
      let allCommentId = props.posts.comments; // Ispe humpe sare comments hain jo is post ke uski id's hai.
      let arr = [];

      for (let i = 0; i < allCommentId.length; i++) {
        let id = allCommentId[i];

        let doc = await firestore.collection("comments").doc(id).get();

        let commentData = { ...doc.data(), id: doc.id };
        arr.push(commentData);
      }
      setAllComments(arr);
      console.log(allComments);
    };

    f();
  }, [props]);
  return (
    <div className="video-card">
      <video
        onClick={(e) => {
          if (playing) {
            setPlaying(false);
            e.currentTarget.pause(); // Making our video pause
          } else {
            setPlaying(true);
            e.currentTarget.play(); // Making our video play
          }
        }}
        className="video"
        src={props.posts.url}
        loop
      ></video>
      <span class="material-icons-outlined like">favorite_border</span>
      <span
        class="material-icons-outlined comment"
        onClick={() => {
          if (!boxOpen) {
            setboxOpen(true);
          } else {
            setboxOpen(false);
          }
        }}
      >
        chat_bubble
      </span>
      <p className="username">
        <b>{props.posts.username}</b>
      </p>
      <p className="song">
        <span class="material-icons-outlined">music_note</span>
        <marquee>Jab tak hai Jaan</marquee>
      </p>
      {boxOpen ? (
        <div className="comment-box">
          <button
            className="comment-box-close-btn"
            onClick={() => {
              if (boxOpen) {
                setboxOpen(false);
              }
            }}
          >
            Close
          </button>
          <div className="all-comments">
            {allComments.map((comment, index) => {
              return (
                <div key={index}>
                  <div className="image-container">
                    <img src={comment.pic} />
                  </div>
                  
                  <div>
                    <p>
                      <b>{comment.username}</b>
                    </p>
                    <p className="inner-comment">{comment.comment}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="comment-form">
            <input
              type="text"
              value={currentUserComment}
              onChange={(e) => {
                setCurrentUserComment(e.currentTarget.value);
              }}
            ></input>
            <button
              onClick={() => {
                let p = firestore.collection("comments").add({
                  comment: currentUserComment,
                  username: value.displayName,
                  pic: value.photoURL,
                });

                setCurrentUserComment("");

                p.then((docRef) => {
                  return docRef.get();
                }).then((doc) => {
                  firestore
                    .collection("posts")
                    .doc(props.posts.id)
                    .update({
                      comments: [...props.posts.comments, doc.id],
                    });
                });
              }}
            >
              Post
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default VideoCard;

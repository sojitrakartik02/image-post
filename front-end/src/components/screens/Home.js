import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";

const Home = () => {
  const [allImages, setAllImages] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    if (state) {
      getImages();
    }
  }, [state]);

  const getImages = () => {
    fetch("/allposts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAllImages(data);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  };

  const like = (id) => {
    fetch("/like", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ postId: id }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = allImages.map((item) => {
          return item._id === result._id ? result : item;
        });
        setAllImages(newData);
      })
      .catch((error) => {
        console.error("Error liking post:", error);
      });
  };

  const unLike = (id) => {
    fetch("/unlike", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ postId: id }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = allImages.map((item) => {
          return item._id === result._id ? result : item;
        });
        setAllImages(newData);
      })
      .catch((error) => {
        console.error("Error unliking post:", error);
      });
  };

  const comment = () => {};

  return (
    <div className="home">
      {allImages.map((image) => (
        <div className="card home-card" key={image?._id}>
          <h5>{image.postedBy?.name}</h5>
          <img src={image?.photo} alt="Post" />
          <div className="card-content">
            {image.likes?.includes(state?._id) ? (
              <i onClick={() => unLike(image._id)} className="material-icons">
                thumb_down
              </i>
            ) : (
              <i onClick={() => like(image._id)} className="material-icons">
                thumb_up
              </i>
            )}
            <h6>{image.likes.length} likes</h6>
            <h6>{image.title}</h6>
            <p>{image.body}</p>
            <input type="text" placeholder="add a comment" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;


import { useState, useEffect } from "react";
// import axios from "axios";
import moment from "moment";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  doc,
  onSnapshot,
  serverTimestamp,
  orderBy,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";






function Home() {

  const db = getFirestore();
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);
  // const [isEditing,setIsEditing]=useState(null);
  // const [editingText,isEditingText]=useState("");
  
  const[editing,setEditing]=useState({

    editingId:null,
    editingText:""



  })


  useEffect(() => {
    //getting data without using realtime function start
    //     const getData=async()=>{
    //     const querySnapshot = await getDocs(collection(db, "posts"));
    //     querySnapshot.forEach((doc) => {
    //     console.log(`${doc.id} =>`, doc.data());

    //      setPosts((prev)=>{

    //       let newArr=[...prev,doc.data()];
    //       return newArr;
    //      })

    // });
    // }
    //   getData();
    //getting data without using realtime function end

    let unsubscribe = null;
    const getRealtimeData = async () => {
      const q = query(collection(db, "posts"), orderBy("createdOn", "desc"));
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {
          // posts.push(doc.data());
          let data = doc.data();
          data.id = doc.id;

          posts.push(data);
        });
        setPosts(posts);

        console.log("Posts: ", posts);
      });

      return () => {
        unsubscribe();
      };
    };

    getRealtimeData();
  }, []);

  const savePost = async (e) => {
    // axios.get("");
    e.preventDefault();
    console.log("Post text", postText);

    try {
      const docRef = await addDoc(collection(db, "posts"), {
        text: postText,
        createdOn: serverTimestamp(),
      });
      setPostText("");
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const deletePosts = async (postId) => {
    // console.log("post Id: ",postId);
    await deleteDoc(doc(db, "posts", postId));

  };

  const updatePost = async (e) => {
   
    // Set the "capital" field of the city 'DC'
    e.preventDefault();

    await updateDoc(doc(db, "posts", editing.editingId), {
      text: editing.editingText,
    });

    setEditing({
        editingId:null,
        editingText:""
    })

  };

  // const edit = (postId,Text)=>{

    // setIsEditing(postId)
    // setEditingText(Text)



    // const updatedState = posts.map((eachItem) => {
    //   if (eachItem.id === postId) {
    //     return { ...eachItem, isEditing: !eachItem.isEditing };
    //   } else {
    //     return eachItem;
    //   }
    // });

    // setPosts(updatedState);

  // }


  return (
    <div className="App">
      <form onSubmit={savePost}>
        <div className="wrap">
          <div className="search">
            <input
              id="cityName"
              value={postText}
              onChange={(e) => {
                setPostText(e.target.value);
              }}
              type="text"
              className="searchTerm"
              placeholder="What's in your mind..?"
            />
            <button type="submit" className="searchButton">
              Post
            </button>
          </div>
        </div>
      </form>

      <div className="allPosts">
        {posts.map((eachPost, i) => (
          <div className="post" key={i}>
            <h1>
              {(eachPost.id===editing.editingId)?
              <form onSubmit={updatePost}>
              <input 
              type="text" 
              value={editing.editingText}
              onChange={(e)=>{

                setEditing({...editing, editingText:e.target.value})
              }}
              placeholder="Enter updated text" /> 
              
              <button>Update</button>

              </form>
              : 
              eachPost?.text
              }
            </h1>

            <span>
              {moment(
                eachPost?.createdOn?.seconds
                  ? eachPost?.createdOn?.seconds * 1000
                  : undefined
              ).format("MMMM Do YYYY, h:mm a")}
            </span>
            <br />
            <button
              className="del"
              onClick={() => {
                deletePosts(eachPost?.id);
              }}
            >
              Delete
            </button>
            
          { (editing.editingId===eachPost?.id)? "" 
            :
            <button
              className="btn-read"
              onClick={() => {

                // edit(eachPost?.id,eachPost?.text);
              
                          
                setEditing({

                // ...editing,
                editingId:eachPost?.id,
                editingText:eachPost?.text

              })

              }}
            >
              Edit
            </button>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
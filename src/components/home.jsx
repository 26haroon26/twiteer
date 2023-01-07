import { useEffect, useState, useContext } from "react";
import "./home.css";
import axios from "axios";
import Search from "./search";
import { GlobalContext } from "../context/Context";
import { toast } from "react-toastify";

function Home() {
  let { state, dispatch } = useContext(GlobalContext);

  const [posttext, setposttext] = useState("");
  const [getData, setgetData] = useState();
  const [istrue, setistrue] = useState(false);
  const [isEdit, setisEdit] = useState(false);
  const [Editing, setEditing] = useState({
    editing_id: null,
    editingtext: "",
  });
  const Alltweet = async () => {
    try {
      const response = await axios
        .get(`${state.baseUrl}/tweetFeed`)
        .then((response) => {
          setgetData(response.data.data);
        });
    } catch (err) {
      console.log("err", err);
    }
  };

  const SavePost = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${state.baseUrl}/tweet`, {
        text: posttext,
      });
      setistrue(!istrue);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };
  const DeletePost = async (post_id) => {
    try {
      const response = await axios.delete(
        `${state.baseUrl}/tweet/${post_id}`,
        {}
      );
      setistrue(!istrue);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };
  const UpdatePost = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${state.baseUrl}/tweet/${Editing.editing_id}`,
        {
          text: Editing.editingtext,
        }
      );
      setistrue(!istrue);
      setisEdit(!isEdit);
      setEditing({
        editing_id: null,
        editingtext: "",
      });
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };
  useEffect(() => {
    Alltweet();
  }, [istrue]);
  return (
    <>
      <div>
        <form onSubmit={SavePost} className="form">
          <input
            className="input"
            type="text"
            placeholder="tweet text"
            onChange={(e) => {
              setposttext(e.target.value);
            }}
          />
          <input type="submit" className="button" value="SetPost" />
        </form>
        <div className="body">
          <div className="flex">
            {getData?.map((eachPost, i) => {
              return (
                <div className="post" key={i}>
                  <div className="postText">
                    <p className="overflow">
                      {isEdit && eachPost._id === Editing.editing_id
                        ? null
                        : `_id :` + eachPost?._id}
                    </p>

                    <h3 className="postDescr overflow">
                      {isEdit && eachPost._id === Editing.editing_id ? (
                        <form className="NextForm" onSubmit={UpdatePost}>
                          <input
                            type="text"
                            className="input"
                            defaultValue={eachPost.text}
                            onChange={(e) => {
                              setEditing({
                                ...Editing,
                                editingtext: e.target.value,
                              });
                            }}
                            placeholder="Please Enter Updated text"
                          />
                          <input
                            type="submit"
                            className="button next"
                            value="Update"
                          />
                        </form>
                      ) : (
                        `Text :` + eachPost?.text
                      )}
                    </h3>
                    <div style={{ margin: "10px auto" }}>
                      <button
                        className="button"
                        onClick={() => {
                          DeletePost(eachPost?._id);
                        }}
                      >
                        Delete
                      </button>
                      <button
                        className="button"
                        onClick={() => {
                          setEditing({
                            editing_id: eachPost?._id,
                            editingtext: eachPost?.name,
                          });
                          setisEdit(!isEdit);
                        }}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Search className="newcomponent" />
        </div>
      </div>
    </>
  );
}

export default Home;

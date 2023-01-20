import { useEffect, useState, useContext } from "react";
import "./home.css";
import axios from "axios";
import Search from "./search";
import { GlobalContext } from "../context/Context";
import { toast } from "react-toastify";
import InfiniteScroll from "react-infinite-scroller";

function Home() {
  let { state, dispatch } = useContext(GlobalContext);

  // const [posttext, setposttext] = useState("");
  const [preview, setPreview] = useState(null);
  const [getData, setgetData] = useState([]);
  const [istrue, setistrue] = useState(false);
  const [isEdit, setisEdit] = useState(false);
  const [eof, setEof] = useState(false);
  const [Editing, setEditing] = useState({
    editing_id: null,
    editingtext: "",
  });

  const Alltweet = async () => {
    if (eof) return;
    try {
      const response = await axios.get(
        `${state.baseUrl}/tweetFeed?page=${getData.length}`
      );

      if (response.data.data.length === 0) setEof(true);
      setgetData((prev) => {
        return [...prev, ...response.data.data];
      });
    } catch (err) {
      console.log("err", err);
    }
  };

  const SavePost = async (e) => {
    e.preventDefault();

    let fileInput = document.getElementById("image");
    let textInput = document.getElementById("text");
    console.log("fileInput: ", fileInput.files[0]);

    let formData = new FormData();

    formData.append("myFile", fileInput.files[0]);
    formData.append("text", textInput.value);
    console.log(textInput);
    console.log(fileInput.files[0]);

    console.log(formData.get("text"));

    axios({
      method: "post",
      url: `${state.baseUrl}/tweet`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        setistrue(!istrue);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
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
            name="text"
            id="text"
          />
          <input
            className="input"
            type="file"
            name="image"
            id="image"
            onChange={(e) => {
              var url = URL.createObjectURL(e.currentTarget.files[0]);
              setPreview(url);
            }}
          />

          <input type="submit" className="button" value="SetPost" />
        </form>
        <div style={{ textAlign: "center" }}>
          <img width={300} src={preview} alt="" />
        </div>
        <InfiniteScroll
          pageStart={0}
          loadMore={Alltweet}
          hasMore={!eof}
          loader={
            <div className="loader" key={0}>
              Loading ...
            </div>
          }
        >
          <div className="body">
            <div className="flex">
              {getData?.map((eachPost, i) => {
                return (
                  <div className="post" key={i}>
                    <div className="postText">
                      <p className="overflow">
                        {isEdit && eachPost._id === Editing.editing_id
                          ? null
                          : eachPost?.owner.firstName}
                      </p>
                      <p className="overflow">
                        {isEdit && eachPost._id === Editing.editing_id
                          ? null
                          : eachPost?.text}
                      </p>
                      <img src={eachPost.imageUrl} alt="" />
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
        </InfiniteScroll>
      </div>
    </>
  );
}

export default Home;

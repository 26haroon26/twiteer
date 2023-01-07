import { useEffect, useState, useContext } from "react";
import "./home.css";
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import Search from "./search";
import { GlobalContext } from "../context/Context";
import { toast } from "react-toastify";

function Profile() {
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
        .get(`${state.baseUrl}/tweets`)
        .then((response) => {
          // console.log(response.data);
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
      const response = await axios.delete(`${state.baseUrl}/tweet/${post_id}`);
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
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    console.log("aaaaaa");
  };
  const change_password = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    if (data.get("new_password") == data.get("confirm_password")) {
      try {
        let response = await axios.post(
          `${state.baseUrl}/change_password`,
          {
            current_password: data.get("current_password"),
            new_password: data.get("new_password"),
          },
          {
            withCredentials: true,
          }
        );
        toast.success(response.data.message)
      } catch (error) {
        toast.error(error.response.data.message);
        return;
      }
    } else {
      toast.error("password does'nt match");
      return;
    }

  }
  useEffect(() => {
    Alltweet();
    console.log("profile gaya");
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
                            defaultValue={Editing.editingtext}
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
      <Button variant="outlined" onClick={handleClickOpen}>
        Change Password
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        component={"form"}
        onSubmit={change_password}
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="current_password"
            name="current_password"
            label="Current Password"
            type="password"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="new_password"
            label="New Password"
            type="password"
            name="new_password"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="confirm_password"
            label="Confrim Password"
            type="password"
            name="confirm_password"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Change</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Profile;

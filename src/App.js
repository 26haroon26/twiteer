import "./App.css";
import { useEffect, useState, useContext } from "react";
import { GlobalContext } from "./context/Context";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./components/home";
import Profile from "./components/profile";
import ForgetPassword from "./components/forgetPassword";
import SignIn from "./components/signin";
import Signup from "./components/signup";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";


function App() {
  const [open, setOpen] = useState(false);
  let { state, dispatch } = useContext(GlobalContext);

  // const [fullName, setFullName] = useState("");

  const logoutHandler = async () => {
    try {
      let response = await axios.post(
        `${state.baseUrl}/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      dispatch({
        type: "USER_LOGOUT",
      });
    } catch (err) {
      console.log("error", err);
    }
  };

  const checkMyEmail = async () => {
    console.log("abcf");
    try {
      let response = await axios.post(
        `${state.baseUrl}/check_my_email`,
        { email: state?.user?.email },
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.log("error", err);
    }
  };
  
  useEffect(() => {
    const getProfile = async () => {
      try {
        let response = await axios.get(`${state.baseUrl}/profile`, {
          withCredentials: true,
        });
        dispatch({
          type: "USER_LOGIN",
          payload: response.data,
        }
        );
      
      } catch (error) {
        dispatch({
          type: "USER_LOGOUT",
        });
        // console.log("axios error: ", error);
      }
    };

    getProfile();
  }, []);

  // axios intercaption js se hr request me withCredentials true ho jae ga sb me alg alg nahi lgana pare ga

  useEffect(() => {
    // request me interceptors add kya he
    // jo ke request send hone se pehle add ho ga
    axios.interceptors.request.use(
      (config) => {
        config.withCredentials = true;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    // respone me interceptors add kya he
    // jo ke response aane ke bad add ho ga
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response.status === 401) {
          dispatch({
            type: "USER_LOGOUT",
          });
        }
        return Promise.reject(error);
      }
    );
  }, []);


  return (
    <div>
      {state?.isLogin === true ? (
        <ul className="navBar">
          <li>
            {" "}
            <Collapse in={open}>
              <Alert
                severity="error"
                action={
                  <IconButton
                    onClick={checkMyEmail}
                    aria-label="close"
                    color="inherit"
                    size="small"
                  >
                    verify
                  </IconButton>
                }
                sx={{ mb: 2 }}
              >
                Please verify your Email
              </Alert>
            </Collapse>
          </li>
          <li>
            {" "}
            <Link to={`/`}>Home</Link>{" "}
          </li>
          <li>
            {" "}
            <Link to={`/profile`}>Profile</Link>{" "}
          </li>
          <li>
            {state?.user?.firstName} {state?.user?.lastName}
            <button onClick={logoutHandler}>Logout</button>{" "}
          </li>
        </ul>
      ) : null}
      {state?.isLogin === false ? (
        <ul className="navBar">
          <li>
            {" "}
            <Link to={`/`}>Signin</Link>{" "}
          </li>
          <li>
            {" "}
            <Link to={`/signup`}>Signup</Link>{" "}
          </li>
        </ul>
      ) : null}

      {state?.isLogin === true ? (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
      ) : null}

      {state?.isLogin === false ? (
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgetPassword" element={<ForgetPassword />} />
          <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
      ) : null}

      {/* {state?.isLogin === null ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
        </div>
      ) : null} */}

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
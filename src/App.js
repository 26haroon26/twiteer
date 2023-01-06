import "./App.css";
import { useEffect, useContext } from "react";
import { GlobalContext } from "./context/Context";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./components/home";
import SignIn from "./components/signin";
import Signup from "./components/signup";
import axios from "axios";

function App() {
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
  useEffect(() => {
    const getProfile = async () => {
      try {
        let response = await axios.get(
          `${state.baseUrl}/profile`,
          {
            withCredentials: true,
          }
        );

        dispatch({
          type: "USER_LOGIN",
          payload: response.data,
        });
      } catch (error) {
        dispatch({
          type: "USER_LOGOUT",
        });
        console.log("axios error: ", error);
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

  // useEffect(() => {

  //   axios.get(`${state.baseUrl}/profile`, {
  //     withCredentials: true
  //   })
  //     .then((res) => {
  //       console.log("res: ", res.data);

  //       if (res.data.email) {

  //         dispatch({
  //           type: "USER_LOGIN",
  //           payload: {
  //             name: res.data.name,
  //             email: res.data.email,
  //             _id: res.data._id
  //           }
  //         })
  //       } else {
  //         dispatch({ type: "USER_LOGOUT" })
  //       }
  //     }).catch((e) => {
  //       dispatch({ type: "USER_LOGOUT" })
  //     })

  //   return () => {
  //   };
  // }, []);

  return (
    <div>
      {state?.isLogin === true ? (
        <ul className="navBar">
          <li>
            {" "}
            <Link to={`/`}>Home</Link>{" "}
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
          <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
      ) : null}

      {state?.isLogin === false ? (
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
      ) : null}

      {state?.isLogin === null ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
        </div>
      ) : null}
    </div>
  );
}

export default App;

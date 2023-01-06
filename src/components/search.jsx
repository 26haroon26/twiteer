import { useState ,useContext} from "react";
import "./home.css";
import axios from "axios";
import { GlobalContext } from "../context/Context";

function Search() {
    let {state , dispatch} = useContext(GlobalContext);

  const [istrue, setistrue] = useState(false);
  const [isEdit, setisEdit] = useState(false);
  const [ProductName, setProductName] = useState("");
  const [ProductNameData, setProductNameData] = useState();
  const [EditProductNameData, setEditProductNameData] = useState({
    EditProductIdId: null,
    EditProductIdName: "",
    EditProductIdPrice: "",
    EditProductIdDescription: "",
  });

  const Product = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${state.baseUrl}/product/${ProductName}`);
      // setgetData([response.data.data])
      setProductNameData(response.data.data);
      console.log(response.data.data);
      setistrue(!istrue);
    } catch (err) {
      console.log("err", err);
    }
  };
  return (
    <>
      <div className="flex b_bottom">
        <form className="newform" onSubmit={Product}>
          <input
            required
            type="text"
            className="input"
            onChange={(e) => {
              setProductName(e.target.value);
            }}
            placeholder="Please Enter Name"
          />
          <input type="submit" className="button" value="check" />
        </form>
        {ProductNameData?.map((eachpost, i) => {
          return (
            <div className="post" key={i}>
              <div className="postText">
                <p className="overflow">{`id :` + eachpost?._id}</p>

                <h3 className="postDescr overflow">
                  {`Name :` + eachpost?.name}
                </h3>

                <span className="overflow">{`Price :` + eachpost?.price}</span>
                <p className="overflow">
                  {`Description :` + eachpost?.description}
                </p>
                <div style={{ margin: "10px auto" }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Search;
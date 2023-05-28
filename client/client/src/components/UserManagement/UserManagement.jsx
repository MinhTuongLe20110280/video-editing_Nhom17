import { useEffect, useState } from "react";
import UserTable from "./UserTable";
import userApi from "../../api/user";
import RefreshIcon from "@mui/icons-material/Refresh";
import videoEditingApi from "../../api/video-editing";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [videos, setVideos] = useState([])
  const [images, setImages] = useState([])

  const getUsers = async () => {
    try {
      const response = await userApi.getAllUsers();
      setUsers(response);
    } catch (error) {
      console.log(error);
    }
  };

  const getVideos = async () => {
    try {
      const response = await videoEditingApi.getAllGalleries(1);
      const usernameArray = response.data.map((object) => object.username);
      
      setVideos(usernameArray)
    } catch (error) {
      console.log(error);
    }
  }; 
  
  const getImages = async () => {
    try {
      const response = await videoEditingApi.getAllGalleries(0);
      const usernameArray = response.data.map((object) => object.username);
      
      setImages(usernameArray)
    } catch (error) {
      console.log(error);
    }
  }; 

  useEffect(() => {
    getUsers();
    getVideos()
    getImages()
  }, []);

  return (
    <>
      <UserTable data={users} videos={videos} images={images}/>
      <div
        onClick={() => {
          window.location.reload();
        }}
        style={{
          cursor: "pointer",
          marginTop: "24px",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <span style={{ marginRight: "12px" }}>Click Here To Refresh Page</span>
        <RefreshIcon />
      </div>
    </>
  );
};

export default UserManagement;

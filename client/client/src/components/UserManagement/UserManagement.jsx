import { useEffect, useState } from "react";
import UserTable from "./UserTable";
import userApi from "../../api/user";
import RefreshIcon from "@mui/icons-material/Refresh";

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const response = await userApi.getAllUsers();
      setUsers(response);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <UserTable data={users} />
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

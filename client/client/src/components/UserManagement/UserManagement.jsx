import React from "react";
import { Table} from "antd";
import "../VideoInput/table-video.css";
import "antd/dist/antd.css";


const UserManagement = () => {



  const columns = [
    {
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "Fullname",
      dataIndex: "fullname",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Password",
      dataIndex: "password",
    },
    {
      title: "Phonenumber",
      dataIndex: "phonenumber",
    },
    {
      title: "EmailConfirmed",
      dataIndex: "matchName",
    },
    {
      title: "NoVideos",
      dataIndex: "matchName",
    },
    {
      title: "NoHighlights",
      dataIndex: "matchName",
    },
    {
      title: "NoGalleries",
      dataIndex: "matchName",
    },
    {
      title: "Lock/Unlock Account",
      dataIndex: "manage",
    }
  ];
  return (
    <Table
      bordered
      columns={columns}
    />
  );
};
export default UserManagement;

import React, { useRef, useState, useEffect } from "react";
import { Table, Input, Button, Space } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import "../VideoInput/table-video.css";
import "antd/dist/antd.css";

function UserTable(props) {
  const { data, videos, images } = props;
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState();
  const [searchedColumn, setSearchedColumn] = useState();
  const [users, setData] = useState([]);
<<<<<<< HEAD
  const [temp, setTemp] = useState({});
=======
>>>>>>> main

  useEffect(() => {
    // Set the initial users data when props.data changes
    setData(data);
  }, [data]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              setSelectedKeys([]);
              handleSearch([], confirm, dataIndex);
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : "unset" }} />
    ),
    onFilter: (value, record) => {
      return record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "";
    },
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  // end for search

  const columns = [
    {
      title: "Username",
      dataIndex: "userName",
      ...getColumnSearchProps("userName"),
    },
    {
      title: "Fullname",
      dataIndex: "fullName",
      ...getColumnSearchProps("fullName"),
    },
    {
      title: "Email",
      dataIndex: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Phonenumber",
      dataIndex: "phoneNumber",
      ...getColumnSearchProps("phoneNumber"),
    },
    {
      title: "NoVideos",
      dataIndex: "userName",
      render: (text, record) => {
        const matchingVideos = videos.reduce((acc, curr) => {
          if (curr === record.userName) {
            return acc + 1;
          }
          return acc;
        }, 0);
        return matchingVideos;
      },
    },
    {
      title: "NoImages",
      dataIndex: "userName",
      render: (text, record) => {
        const matchingImages = images.reduce((acc, curr) => {
          if (curr === record.userName) {
            return acc + 1;
          }
          return acc;
        }, 0);
        return matchingImages;
      },
    },
    {
      title: "IsAdmin",
      dataIndex: "userName",
      render: (text, record) => {
<<<<<<< HEAD
        const matchingUser = users.find(
          (user) => user.userName === record.userName
        );
        const isAdmin = matchingUser ? matchingUser.emailConfirmed : true;
=======
        const matchingUser = users.find((user) => user.userName === record.userName);
        const isAdmin = matchingUser ? matchingUser.emailConfirmed : false;
>>>>>>> main

        const handleCheckboxChange = () => {
          const newData = users.map((user) => {
            if (user.userName === record.userName) {
<<<<<<< HEAD
              const temp  = { ...user, emailConfirmed: !isAdmin }
              setTemp(temp)
              return temp
=======
              return { ...user, emailConfirmed: !isAdmin };
>>>>>>> main
            }
            return user;
          });

          setData(newData);
        };

        return (
          <div>
<<<<<<< HEAD
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginBottom: "4px",
              }}
            >
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={handleCheckboxChange}
              />
              <span>{isAdmin ? "true" : "false"}</span>
            </div>
            <Button
              variant="contained"
              onClick={handleSave}
              style={{
                backgroundColor: "#1565c0",
                color: "white",
                borderRadius: "5px",
              }}
            >
              Save
            </Button>
          </div>
        );
      },
    },
=======
            <span>{isAdmin ? "true" : "false"}</span>
            <br />
            <input
              type="checkbox"
              checked={isAdmin}
              onChange={handleCheckboxChange}
            />
          </div>
        );
      },
    }
>>>>>>> main
  ];

  const showTotal = (total) => {
    return `Total: ${total} users`;
  };

<<<<<<< HEAD
  const handleSave = () => {
    console.log(temp)
  }
=======
>>>>>>> main
  return (
    <Table
      bordered
      pagination={{ showTotal: showTotal, showSizeChanger: true }}
      columns={columns}
      dataSource={users.map((item, index) => ({ ...item, key: index }))}
    />
  );
}

export default UserTable;

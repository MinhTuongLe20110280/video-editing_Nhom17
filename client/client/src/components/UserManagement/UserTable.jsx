import React, { useEffect, useRef, useState } from "react";
import { Table, Input, Button, Space, DatePicker } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined, CalendarOutlined } from "@ant-design/icons";
import { Link } from "@mui/material";
import "../VideoInput/table-video.css";
import "antd/dist/antd.css";

function UserTable(props) {
//   const { data, titleSearch, handleResultClick } = props;
  const { data} = props;

  const [titleS, setTitleS] = useState();
//   useEffect(() => {
//     const temp = [...titleSearch];
//     const lstTemp = [];
//     temp.forEach((item) => {
//       lstTemp.push({ text: item.name, value: item.id });
//     });
//     setTitleS(lstTemp);
//   }, [titleSearch]);

  // for search
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState();
  const [searchedColumn, setSearchedColumn] = useState();

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
      dataIndex: "novideos",
      ...getColumnSearchProps("novideos"),
    },
    {
      title: "NoHighlights",
      dataIndex: "nohighlights",
      ...getColumnSearchProps("nohighlights"),
    },
    {
      title: "NoGalleries",
      dataIndex: "nogalleries",
      ...getColumnSearchProps("nogalleries"),
    }
  ];
  const showTotal = (total) => {
    return `Total: ${total} users`;
  };
  return (
    <Table
      bordered
      pagination={{ showTotal: showTotal, showSizeChanger: true }}
      columns={columns}
      dataSource={data}
    />
  );
}

export default UserTable;

import * as React from "react";
import "./index.css";
import "react-pro-sidebar/dist/css/styles.css";
import ReorderIcon from "@mui/icons-material/Reorder";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import Cookies from "js-cookie";
import LogoutIcon from "@mui/icons-material/Logout";
import imgBG from "./bg-signbar.jpg";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import MovieIcon from "@mui/icons-material/Movie";

import { Grid, Tooltip } from "@mui/material";

import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  MenuItem,
  ProSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SubMenu,
} from "react-pro-sidebar";

import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useEffect, useState } from "react";
import userApi from "../../api/user";

function ResponsiveDrawer(props) {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const response = await userApi.getAllUsers();
      setUsers(response.map((user) => ({
        userName: user.userName,
        isAdmin: user.isAdmin,
      })))
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const adminUsername = localStorage.getItem("username");
  var IsADMIN = false;
  users.forEach((user) => {
    if (user.userName === adminUsername) {
      if (user.isAdmin === true) {
        IsADMIN = true;
      }
    }
  })

  const [Fullname, setFullName] = useState(localStorage.getItem("fullName"));
  const handleLocalStorageChange = () => {
    const updatedFullName = localStorage.getItem("fullName");
    setFullName(updatedFullName);
  };
  useEffect(() => {
    window.addEventListener("storage", handleLocalStorageChange);
    return () => {
      window.removeEventListener("storage", handleLocalStorageChange);
    };
  }, []);
  const [collapsed, setCollapsed] = useState(true);
  const generateListItems = () => {
    const listItem = [
      {
        name: "Soccer",
        url: "/",
        icon: <SportsSoccerIcon />,
      },
      {
        name: "Highlight",
        url: "/highlight",
        icon: <MovieIcon />,
      },
      {
        name: "Gallery",
        url: "/gallery",
        icon: <CollectionsOutlinedIcon />,
      },
      {
        name: "Account Management",
        url: "/accountmanagement",
        icon: <ManageAccountsIcon />,
      },
    ];

    if (IsADMIN) {
      listItem.push({
        name: "User Management",
        url: "/usermanagement",
        icon: <SupervisorAccountIcon />,
      });
      listItem.push({
        name: "Match Management",
        url: "/matchmanagement",
        icon: <SmartDisplayIcon />,
      });
      listItem.push({
        name: "Chart",
        url: "/chart",
        icon: <BarChartIcon />,
      });
    }

    return listItem;
  };

  const listItem = generateListItems();
  let navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove("Token");
    localStorage.removeItem("fullName");
    localStorage.removeItem("userName");
    navigate("/login");
  };
  const handleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const iconCollapsed = {
    fontSize: "xx-large",
    margin: "20px 25px",
    cursor: "pointer",
  };

  const NavMenuu = (item) => {
    if (collapsed) {
      return (
        <SubMenu key={item.name} title={item.name} icon={item.icon}>
          <MenuItem key={item.name}>
            <NavLink key={item.url} to={item.url}>
              {item.name}
            </NavLink>
          </MenuItem>
        </SubMenu>
      );
    } else {
      return (
        <MenuItem key={item.name} icon={item.icon}>
          <NavLink key={item.url} to={item.url}>
            {item.name}
          </NavLink>
        </MenuItem>
      );
    }
  };

  return (
    <>
      <div className="app">
        <ProSidebar image={imgBG} collapsed={collapsed} breakPoint="md">
          <SidebarHeader>
            <span className={collapsed ? "" : "hidden"}>
              <ReorderIcon sx={iconCollapsed} onClick={handleCollapsed} />
            </span>
            <span className={collapsed ? "hidden" : ""}>
              <ArrowBackIosNewIcon
                sx={iconCollapsed}
                onClick={handleCollapsed}
              />
            </span>
          </SidebarHeader>
          <SidebarContent>
            <Menu iconShape="round">
              {listItem?.map((item) => {
                return NavMenuu(item);
              })}
            </Menu>
          </SidebarContent>
          <SidebarFooter style={{ textAlign: "center" }}>
            <div style={{ fontSize: 12, padding: 1, maxWidth: "100%" }}>
              WELCOME {Fullname}
            </div>
            <div>
              <Tooltip key={1} title="Logout" placement="right">
                <LogoutIcon sx={iconCollapsed} onClick={handleLogout} />
              </Tooltip>
            </div>
          </SidebarFooter>
        </ProSidebar>
        <main>
          <Grid container direction="row">
            <Grid item xs={12} style={{ width: "100%", padding: "2% 4%" }}>
              {props.children}
            </Grid>
          </Grid>
        </main>
      </div>
    </>
  );
}

export default ResponsiveDrawer;

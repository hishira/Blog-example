import React, { useState, useEffect } from "react";
import { Button, Menu, Icon, Input } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import { logout, checkLogin } from "../../api/authApi";
import { inject, observer } from "mobx-react";
import Loading from "../shared/loadingComponent";

function AppBar(props) {
  const [userToFind, setUserToFind] = useState("");
  const [loading, setLoading] = useState("false");
  const history = useHistory();
  const logouthandle = async () => {
    history.push("/");
    await logout();
    props.mainStore.setLogged(false);
    props.userStore.setLogedUser({});
    Cookies.remove("user");
  };
  const searchSumbitHandle = () => {
    console.log(userToFind);
    history.push(`/userfind/${userToFind}`);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        let dane = await checkLogin().then((response) => {
          if (response.status === 200) return response.json();
          return false;
        });
        if (dane === false) {
          props.mainStore.setLogged(false);
          props.userStore.setLogedUser({});
          Cookies.remove("user");
          setLoading("true");
        } else {
          Cookies.set("user", dane.user);
          console.log(dane.user);
          props.mainStore.setLogged(true);
          props.userStore.setLogedUser(dane.user);
          setLoading("true");
        }
      } catch (err) {
        setLoading("error");
      }
    };
    fetchData()
  }, []);
  return (
    <Menu fluid size='large'>
      <Menu.Item name="home" active onClick={() => history.push("/")} />
      <Menu.Item>
        <Input
          onChange={(e) => setUserToFind(e.target.value)}
          icon={
            <Icon name="search" link onClick={() => searchSumbitHandle()} />
          }
          placeholder="Find user, or post by tags"
        />
      </Menu.Item>
      <Menu.Menu position="right">
        {loading === "false" ? (
          <Loading />
        ) : loading === "error" ? (
          <div>Error</div>
        ) : (
          <Menu.Item>
            {props.mainStore.getLogStatus ? (
              <div>
                <Icon
                  name="user circle"
                  onClick={() => history.push("/user")}
                  size="big"
                  style={{ marginRight: "1rem", cursor: "pointer" }}
                />
                <Button primary onClick={() => logouthandle()}>
                  LogOut
                </Button>
              </div>
            ) : (
              <Button primary onClick={() => history.push("/login")}>
                Login
              </Button>
            )}
          </Menu.Item>
        )}
      </Menu.Menu>
    </Menu>
  );
}
export default inject((stores) => ({
  mainStore: stores.mainStore,
  userStore: stores.userStore,
}))(observer(AppBar));

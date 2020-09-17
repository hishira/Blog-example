import React, { useState, useEffect } from "react";
import { Modal,Container,List,Button } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import { getWatchedUser } from "../../api/userApi";
import Loading from "../shared/loadingComponent";
import { useHistory } from "react-router-dom";

function WatchedUsersModal({ user, mainStore }) {
  const [watchedUsers, setWatchedUsers] = useState({});
  const [loading, setLoading] = useState("false");
  const history = useHistory();
  useEffect(() => {
    let obj = { userID: user._id };
    const fetchData = async () => {
      try {
        let data = await getWatchedUser(obj).then((reponse) => {
          if (reponse.status === 200) return reponse.json();
          return null;
        });
        if (data === null) throw new Error("err");
        console.log(data)
        setWatchedUsers(data.watched);
        setLoading("yes");
      } catch (err) {
        setLoading("error");
      }
    };
    fetchData();
  }, [user]);
  return (
    <Modal
      dimmer="blurring"
      open={mainStore.watchedModal}
      onClose={() => mainStore.setWatchedUserModal(false)}
    >
        <Modal.Header>Watched users</Modal.Header>
        <Modal.Content>
      {loading === "false" ? (
        <Loading />
      ) : loading === "error" ? (
        <div>Error</div>
      ) : (
        <List divided relaxed>
             {watchedUsers.map((user) => (
            <List.Item
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "1rem",
                alignItems: "center",
              }}
            >
              <List.Icon name="user" size="large" verticalAlign="middle" />
              <List.Content
                style={{
                  display: "flex",
                  width: "25rem",
                  justifyContent: "space-between",
                  alignItems:"center",
                  marginLeft: "2rem",
                }}
              >
                <List.Header as="h4">{user.username}</List.Header>
                <Button icon="user" onClick={()=>{
                  history.push(`/userprofile/${user._id}`);
                  mainStore.setWatchedUserModal(false)
                  }} />
              </List.Content>
            </List.Item>
          ))}
            
        </List>
      )}
      </Modal.Content>
    </Modal>
  );
}
export default inject((stores) => ({
  mainStore: stores.mainStore,
  userStore: stores.userStore,
}))(observer(WatchedUsersModal));

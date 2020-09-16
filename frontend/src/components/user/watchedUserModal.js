import React, { useState, useEffect } from "react";
import { Modal,Container,List } from "semantic-ui-react";
import { inject, observer } from "mobx-react";
import { getWatchedUser } from "../../api/userApi";
import Loading from "../shared/loadingComponent";
function WatchedUsersModal({ user, mainStore }) {
  const [watchedUsers, setWatchedUsers] = useState({});
  const [loading, setLoading] = useState("false");
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
            {watchedUsers.map(watch=><List.Item>
                <List.Content>
                    {watch.email}
                </List.Content>
            </List.Item>)}
            
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

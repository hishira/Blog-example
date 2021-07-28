import {
  addUserDescription,
  emailChange,
  passwordChange,
  getUserInfo,
  userFind,
  watchUser as watch,
  unwatchUser,
  getPublicUserInfo
} from "../api/userApi";

const checkDescriptionLength = (description, messageFunction) => {
  if (description.length > 250) {
    messageFunction("Description must have less than 250 characters");
    return false;
  }
  return true;
};

const changeUserDescription = async (description, messageFunction) => {
  if (!checkDescriptionLength(description)) return;
  const objectWithDescription = {
    description: description,
  };
  const response = await addUserDescription(objectWithDescription).then(
    (res) => {
      if (res.status === 200) return true;
      return false;
    }
  );
  if (response === false) {
    messageFunction("Something goes wrong with description change");
  }
  return response;
};

const changeEmail = async (email, messageFunction) => {
  const emailObject = { email: email };
  const response = await emailChange(emailObject).then((resp) => {
    if (resp.status === 200) return true;
    return false;
  });
  if (response === false) {
    messageFunction("Problem with email chainging");
  }
  return response;
};

const changePassword = async (
  newpassword,
  confirmPassword,
  messageFunction
) => {
  if (newpassword !== confirmPassword) {
    messageFunction("Password do not match with confirm password");
    return false;
  }
  const newPasswordObject = { password: newpassword };
  const response = await passwordChange(newPasswordObject).then((res) => {
    if (res.status === 200) return true;
    return false;
  });
  if (!response) messageFunction("Problem with password change");
  return response;
};

const GetUserProfileInfo = async () => {
  const responseUserInfo = await getUserInfo().then((resp) => {
    if (resp.status === 200) {
      return resp.json();
    }
    return null;
  });
  if (responseUserInfo === null) throw new Error("Err");
  return responseUserInfo;
};

const findUser = async (username) => {
  const usernameObject = {
    username: username,
  };
  const userwhichwefind = await userFind(usernameObject).then((resp) => {
    if (resp.status === 200) return resp.json();
    return null;
  });
  if (userwhichwefind === null) throw new Error("err");
  return userwhichwefind;
};

const watchUser = async (userid) => {
  const userObject = {
    userID: userid,
  };
  const responseStatus = watch(userObject).then((resp) => {
    if (resp.status === 200) return resp.json();
    return false;
  });
  return responseStatus;
};

const unWatchUser = async (userid)=>{
  const userToWatchObject = {
    userID:userid,
  }
  const responseStatus = await unwatchUser(userToWatchObject).then(resp=>{
    if(resp.status === 200)
      return resp.json();
    return false;
  })
  return responseStatus;
}

const GetPublicUserProfileInfo = async (userid)=>{
  const userInfo = await getPublicUserInfo(userid).then(resp=>{
    if(resp.status === 200)
      return resp.json();
    return null;
  })
  if(userInfo === null) throw new Error("problem");
  return userInfo;
}

export {
  changeUserDescription,
  changeEmail,
  changePassword,
  GetUserProfileInfo,
  findUser,
  watchUser,
  unWatchUser,
  GetPublicUserProfileInfo
};

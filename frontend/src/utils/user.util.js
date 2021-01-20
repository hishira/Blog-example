import {
  addUserDescription,
  emailChange,
  passwordChange,
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

export { changeUserDescription, changeEmail, changePassword };

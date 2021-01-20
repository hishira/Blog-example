import { addUserDescription } from "../api/userApi";

const checkDescriptionLength = (description,messageFunction)=>{
  if (description.length > 250) {
    messageFunction("Description must have less than 250 characters");
    return false;
  }
  return true;
}

const changeUserDescription = async (description,messageFunction) => {
  if(!checkDescriptionLength(description))
    return;
  const objectWithDescription = {
    description: description,
  };
  const response = await addUserDescription(objectWithDescription).then(res=>{
      if(res.status === 200)
        return true;
      return false;
  })
  if(response === false){
    messageFunction("Something goes wrong with description change");
  }
  return response;
};

export {changeUserDescription}

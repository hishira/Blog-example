import { addUserDescription } from "../api/userApi";

const changeUserDescription = async (description,messageFunction) => {
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

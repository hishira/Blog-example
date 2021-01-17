import Cookies from "js-cookie";
import { login } from "../api/authApi";
const loginUserFunction = async (email,password)=>{
    if (email === "" || password === ""){
        return null;
    }
    const loginobject = {
        email:email,
        password:password
    };
    const response = await login(loginobject).then(resp=>{
        if(resp.status === 200) return resp.json();
        return false;
    })
    if(response === false){
        return false
    }
    Cookies.set("user",response.user);
    return response;
}
export {loginUserFunction}
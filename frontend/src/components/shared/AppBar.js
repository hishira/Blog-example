import React,{useState} from 'react'
import {Button,Menu,Icon,Input} from 'semantic-ui-react'
import {useHistory} from 'react-router-dom'
import Cookies from 'js-cookie';
import {logout} from '../../api/authApi'
import {inject, observer} from "mobx-react";
function AppBar(props){
    const [userToFind,setUserToFind] = useState("")
    const history = useHistory()
    const logouthandle = async ()=>{
        await logout()
        props.mainStore.setLogged(false)
        props.userStore.setLogedUser({})
        Cookies.remove('user')
        history.push('/')
    }
    const searchSumbitHandle = ()=>{
        console.log(userToFind)
        history.push(`/userfind/${userToFind}`)
    }
    return(
        <Menu size="large">
            <Menu.Item
                name='home'
                active
                onClick={()=>history.push('/')}
            />
            <Menu.Item>
                <Input onChange={(e)=>setUserToFind(e.target.value)} icon={<Icon name='search' link onClick={()=>searchSumbitHandle()}/>} placeholder='Find user'/>
            </Menu.Item>
            <Menu.Menu position="right">
                <Menu.Item>
                    {
                        props.mainStore.getLogStatus?
                        (
                        <div>
                        <Icon name='user circle' onClick={()=>history.push('/user')}  size='big' style={{marginRight:"1rem",cursor:"pointer"}} />
                        <Button primary onClick={()=> logouthandle()}>
                            LogOut
                        </Button>
                    </div>):
                    (<Button primary
                        onClick={()=> history.push('/login')}
                    >Login</Button>)
                    }
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    )
}
export default inject(stores => ({
    mainStore: stores.mainStore,
    userStore: stores.userStore
}))(observer(AppBar))
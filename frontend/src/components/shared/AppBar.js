import React from 'react'
import {Button,Menu,Icon} from 'semantic-ui-react'
import {useHistory} from 'react-router-dom'
import Cookies from 'js-cookie';
import {logout} from '../../api/authApi'
import {inject, observer} from "mobx-react";
function AppBar(props){
    const history = useHistory()
    const logouthandle = async ()=>{
        await logout()
        props.mainStore.setLogged(false)
        Cookies.remove('user')
        history.push('/')
    }
    return(
        <Menu size="large">
            <Menu.Item
                name='home'
                active
                onClick={()=>history.push('/')}
            />
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
    mainStore: stores.mainStore
}))(observer(AppBar))
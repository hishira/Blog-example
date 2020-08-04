import  React  from 'react'
import {inject,observer} from 'mobx-react'
import {Route,Redirect} from 'react-router-dom'
function privateRoute({component:Component,...rest}){
    return(
        <Route {...rest} render={(props)=>
            rest.mainStore.getLogStatus?(<Component {...props}/>):(<Redirect to='/login' />)
        }/>
    )
}
export default inject(stores => ({
    mainStore: stores.mainStore
}))(observer(privateRoute))

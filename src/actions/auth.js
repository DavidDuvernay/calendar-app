import Swal from "sweetalert2";
import { fetchWithoutToken, fetchWithToken } from "../helpers/fetch";
import { types } from "../types/types";
import { eventLogout } from "./events";


export const startLogin = (email, password) => {

    return async(dispatch) => {
        
        const resp = await fetchWithoutToken('auth', { email, password}, 'POST');
        const body = await resp.json()
        
        if(body.ok){
            localStorage.setItem('token', body.token)
            localStorage.setItem('token-init-date', new Date().getTime())

            dispatch(login({
                uid: body.uid,
                name: body.name
            }))
        } else {

            Swal.fire('Error', 'Wrong email or password', 'error')
        }
    }
};

export const startRegister = (email, password, name) => {

    return async(dispatch)=> {
        
        const resp = await fetchWithoutToken('auth/new', {email, password, name}, 'POST');
        const body = await resp.json()

        if(body.ok){

            localStorage.setItem('token', body.token );
            localStorage.setItem('token-init-date', new Date().getTime() );

            dispatch(login({
                uid: body.uid,
                name: body.name
            }))

        } else {
            
            return Swal.fire('Error', 'Failed to create user', 'error')
        }
    }
};

export const startChecking = () => {

    return async(dispatch) => {
        const resp = await fetchWithToken('auth/renew');
        const body = await resp.json()

        if(body.ok){
            localStorage.setItem('token', body.token)
            localStorage.setItem('token-init-date', new Date().getTime())

            dispatch(login({
                uid: body.uid,
                name: body.name
            }))

        } else {
            dispatch(checkingFinish)
        }
    }  
};

export const startLogout = () => {
        
    return (dispatch) => {

        localStorage.clear()
        dispatch(eventLogout())
        dispatch(logout())
    }
}

const login = (user) => ({
    type: types.authLogin,
    payload: user
});

const checkingFinish = () => ({type: types.authCheckingFinish});

const logout = () => ({type: types.authLogout})
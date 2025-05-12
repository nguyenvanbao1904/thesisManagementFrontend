import { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import MySpinner from "./layouts/MySpinner";
import { useNavigate } from "react-router-dom";
import Apis, { authApis, endpoints } from "../configs/Apis";
import cookie from 'react-cookies'
import { MyDispatchContext } from "../configs/Context";

const Login = () =>{
    const info = [{
        label: "Ten dang nhap",
        field: "username",
        type: "text"
    },
    {
        label: "Mat khau",
        field: "password",
        type: "password"
    }]
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const dispatch = useContext(MyDispatchContext);

    const login = async (e) =>{
        e.preventDefault()
        try{
            setLoading(true);
            let res = await Apis.post(endpoints["login"], {...user});
            cookie.save("token", res.data.token)
            let u = await authApis().get(endpoints['current-user']);
            dispatch({
                "type": "login",
                "payload": u.data   
            })
            console.log(u.data);
            
            nav("/")
        }catch(ex){
            console.error(ex)
        }finally{
            setLoading(false);
        }
    }
    return (
        <>
            <h1 className="text-center text-info mt-1">Đăng nhập</h1>
            <Form onSubmit={login}>
                <Form.Group className="mb-3">
                    {info.map(i => <Form.Control key={i.field} value={user[i.field]} onChange={e => setUser({...user, [i.field]: e.target.value})} type={i.type} placeholder={i.label} required className="mt-2"/>)}
                </Form.Group>

                <Form.Group className="mb-3">
                    {loading === true?<MySpinner></MySpinner>:<Button className="mb-2" type="submit">Đăng nhập</Button>}
                </Form.Group>
            </Form>
        </>
    )
}

export default Login;
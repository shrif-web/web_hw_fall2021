import { Form, Input, Button, Row, Col, Checkbox, Card, Spin, message } from 'antd';
import React, { useRef, memo, useState, useCallback, } from 'react';
import Parse from 'parse'
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
  } from 'recoil';

const stateVar = atom({
  key: 'stateVar', // unique ID (with respect to other atoms/selectors)
  default: { phase:'Phone', phone: '', OTP: '', user: '' }, // default value (aka initial value)
});

const dbsignup = selector({
    key: 'dbsignup', // unique ID (with respect to other atoms/selectors)
    get: async ({get}) => {
        const state = get(stateVar);
        const user = new Parse.User();
        user.set("username", state.user);
        user.set("password", state.OTP);
        try {
            await user.signUp();
            console.log('Success');
        } catch (error) {
            console.log("Error: " + error.code + " " + error.message);
        }
        return user.getUsername();
    },
});

/*const useLogin = async function() {
    //const [state, updateState] = useState({ phase:'Phone', phone: '', OTP: '', user: '' });
    const state = useRecoilValue(stateVar);
    console.log(state);
    if(state.phase === 'Submit'){
        const user = new Parse.User();
        user.set("username", state.user);
        user.set("password", state.OTP);
        try {
            await user.signUp();
            console.log('Success');
        } catch (error) {
            console.log("Error: " + error.code + " " + error.message);
        }
    }
};*/

const Signup = () => {
    const { phase } = useRecoilValue(stateVar);
    console.log(phase);

    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <Row>
                <Col span="12" offset="6">
                { phase==='Phone' && (<Phone/>) }
                { phase==='OTP' && (<OTP />) }
                { phase==='USER' && (<USER />) }
                { phase==='Submit' && (<ShowRes />) }
                </Col>
            </Row>
        </React.Suspense>
    );
}
const Phone = () => {
    const onClick = useSetRecoilState(stateVar);
    const inputEl = useRef(null);

    return (
        <Card size="small" title="phone" style={{marginTop: 10}} >
            <Input ref={inputEl} type="text" />
            <Button type="primary" onClick={
                () => onClick((s)=> ({...s, phone: inputEl.current.state.value, phase: 'OTP'})) 
            }>OTP</Button>
        </Card>
    );
}
const OTP = () => {
    const onClick = useSetRecoilState(stateVar);
    const inputEl = useRef(null);

    return (
        <Card size="small" title="OTP" style={{marginTop: 10}} >
            <Input ref={inputEl} type="text" />
            <Button type="primary" onClick={
                () => onClick((s)=> ({...s, OTP: inputEl.current.state.value, phase: 'USER'})) 
            }>User</Button>
        </Card>
    );
}
const USER = () => {
    const onClick = useSetRecoilState(stateVar);
    const inputEl = useRef(null);

    return (
        <Card size="small" title="User" style={{marginTop: 10}} >
            <Input ref={inputEl} type="text" />
            <Button type="primary" onClick={
                () => onClick((s)=> ({...s, user: inputEl.current.state.value, phase: 'Submit'})) 
            }>Submit</Button>
        </Card>
    );
}

const ShowRes = () => {
    const res = useRecoilValue(dbsignup);
    return (
        <div>{res}</div>
    );
}

export default React.memo(Signup)
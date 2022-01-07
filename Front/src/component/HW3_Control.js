import { Form, Input, Button, Row, Col, Checkbox, Card, Spin, message } from 'antd';
import React, { Component, useRef, memo, useState, useCallback, } from 'react';
import Parse from 'parse'
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
  } from 'recoil';

const message1 = atom({
  key: 'message1', // unique ID (with respect to other atoms/selectors)
  default: { M1:'', M2:'', M3:'', M4:'' }
}); 

const { TextArea } = Input;

/* const stateVar = atom({
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
}); */

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

const HW3_Control = () => {
    const { M1, M2, M3, M4 } = useRecoilValue(message1);
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <Row>
                <Col span="12" offset="6">
                    <CreateText />
                </Col>
                <div>{M1}</div>
            </Row>
            <Row>
                <Col span="12" offset="6">
                    <GetText />
                </Col>
                <div>{M2}</div>
            </Row>
            <Row>
                <Col span="12" offset="6">
                    <UpdateText />
                </Col>
                <div>{M3}</div>
            </Row>
            <Row>
                <Col span="12" offset="6">
                    <DeleteText />
                </Col>
                <div>{M4}</div>
            </Row>
        </React.Suspense>
    );
}

const CreateText = () => {
    let val;
    const onClick = useSetRecoilState(message1);
    const inputEl = useRef(null);
    return (
        <Card size="default" title="Create Text" style={{marginTop: 10}} >
            <TextArea ref={inputEl} />
            <Button type="primary" style={{marginTop:10}} onClick={
                () => onClick( (s) => {
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            title: 'Create',
                            text: inputEl.current.resizableTextArea.props.value
                        })
                    };
                    fetch('https://reqres.in/api/posts', requestOptions)
                        .then(val = {...s, M1: inputEl.current.resizableTextArea.props.value});
                    console.log(inputEl);
                    return val;
                } )
            }>Submit</Button>
        </Card>
    );
}


const GetText = () => {
    let val;
    const onClick = useSetRecoilState(message1);
    const inputEl = useRef(null);
    return (
        <Card size="default" title="Get Text" style={{marginTop: 10}} >
            <TextArea ref={inputEl} />
            <Button type="primary" style={{marginTop:10}} onClick={
                () => onClick( (s) => {
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            title: 'Create',
                            text: inputEl.current.resizableTextArea.props.value
                        })
                    };
                    fetch('https://reqres.in/api/posts', requestOptions)
                        .then(val = {...s, M1: inputEl.current.resizableTextArea.props.value});
                    console.log(inputEl);
                    return val;
                } )
            }>Submit</Button>
        </Card>
    );
}


const UpdateText = () => {
    let val;
    const onClick = useSetRecoilState(message1);
    const inputEl = useRef(null);
    return (
        <Card size="default" title="Update Text" style={{marginTop: 10}} >
            <TextArea ref={inputEl} />
            <Button type="primary" style={{marginTop:10}} onClick={
                () => onClick( (s) => {
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            title: 'Create',
                            text: inputEl.current.resizableTextArea.props.value
                        })
                    };
                    fetch('https://reqres.in/api/posts', requestOptions)
                        .then(val = {...s, M1: inputEl.current.resizableTextArea.props.value});
                    console.log(inputEl);
                    return val;
                } )
            }>Submit</Button>
        </Card>
    );
}


const DeleteText = () => {
    let val;
    const onClick = useSetRecoilState(message1);
    const inputEl = useRef(null);
    return (
        <Card size="default" title="Delete Text" style={{marginTop: 10}} >
            <TextArea ref={inputEl} />
            <Button type="primary" style={{marginTop:10}} onClick={
                () => onClick( (s) => {
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            title: 'Create',
                            text: inputEl.current.resizableTextArea.props.value
                        })
                    };
                    fetch('https://reqres.in/api/posts', requestOptions)
                        .then(val = {...s, M1: inputEl.current.resizableTextArea.props.value});
                    console.log(inputEl);
                    return val;
                } )
            }>Submit</Button>
        </Card>
    );
}


export default React.memo(HW3_Control)
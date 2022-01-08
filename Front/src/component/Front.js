import { Form, Input, Button, Checkbox, Card, Spin, message } from 'antd';
import React, { memo, useState, useCallback, } from 'react';
import Login from './Login.js'
import Signup from './Signup.js'
import Parse from 'parse'
import {
    RecoilRoot,
    atom,
    selector,
    useRecoilState,
    useRecoilValue,
    useSetRecoilState,
} from 'recoil';

const state = atom({
    key: 'state', // unique ID (with respect to other atoms/selectors)
    default: 'Signup'
});

const Front = () => {
    let stateval = useRecoilValue(state);
    console.log(stateval)
    return (
        <>
            {stateval == 'Login' && <Login />}
            {stateval == 'Signup' && <Signup />}
        </>
    );
};

export default React.memo(Front)
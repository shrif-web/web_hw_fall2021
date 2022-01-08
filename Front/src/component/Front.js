import { Form, Input, Button, Checkbox, Card, Spin, message } from 'antd';
import React, { memo, useState, useCallback, } from 'react';
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

const token = atom({
    key: 'token', // unique ID (with respect to other atoms/selectors)
    default: ''
});

const textState = atom({
    key: 'textState', // unique ID (with respect to other atoms/selectors)
    default: 'Fill the form please'
});

const Front = () => {
    const [stateval, setState] = useRecoilState(state);
    console.log(stateval)
    return (
        <>
            {stateval == 'Login' && <Login />}
            {stateval == 'Signup' && <Signup />}
            {stateval == 'Text' && <Text />}
        </>
    );
};

const Text = () => {
    return (
        <div style={{ display: 'flex' }}>
            <CreateText />
            <SeeTexts />
            <UpdateTexts />
        </div>
    );
};

const { TextArea } = Input;
const CreateText = () => {
    const onClick = useSetRecoilState(state);
    const [tokenval, tokenupdater] = useRecoilState(token);
    const [prog, updateprog] = useState(false);
    const onFinish = async (values) => {
        console.log('Success:', values);
        updateprog(true);
        const { text } = values;
        let ans = await fetch('http://localhost:3030/Create?text=' + text + '&token=' + tokenval);
        ans = await ans.json();
        console.log(ans);
        if (ans.message != 'Done!')
            message.error(ans.message);
        else {
            message.warning('Text is submitted.')
        }
        console.log(token)
        updateprog(false)
    };

    const onFinishFailed = useCallback((errorInfo) => {
        console.log('Failed:', errorInfo);
    }, []);
    return (
        <Card title="Create Text" style={{ width: "30%", margin: "auto", marginTop: 30 }}>
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Text"
                    name="text"
                >
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button htmlType="submit">
                        <Spin style={{ marginRight: 8, alignSelf: 'stretch' }} spinning={prog} /> Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

const SeeTexts = () => {
    const onClick = useSetRecoilState(state);
    const [tokenval, tokenupdater] = useRecoilState(token);
    const [prog, updateprog] = useState(false);
    const [a, aUpd] = useRecoilState(textState);
    const onFinish = async (values) => {
        console.log('Success:', values);
        updateprog(true);
        const { num } = values;
        let ans = await fetch('http://localhost:3030/See?num=' + num + '&token=' + tokenval);
        ans = await ans.json();
        console.log(ans);
        // if (ans.message != 'Done!')
        //     message.error(ans.message);
        // else {
        message.warning('Printed')
        // }
        aUpd(ans.message);
        console.log(a);
        updateprog(false)
    };

    const onFinishFailed = useCallback((errorInfo) => {
        console.log('Failed:', errorInfo);
    }, []);
    return (
        <Card title="See Notes" style={{ width: "30%", margin: "auto", marginTop: 30 }}>
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Which Note!?"
                    name="num"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Text"
                    name="text"
                >
                    <div>
                        {a}
                    </div>
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button htmlType="submit">
                        <Spin style={{ marginRight: 8, alignSelf: 'stretch' }} spinning={prog} /> Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

const UpdateTexts = () => {
    const [tokenval, tokenupdater] = useRecoilState(token);
    const [prog, updateprog] = useState(false);
    const [a, aUpd] = useRecoilState(textState);
    let t = a;
    const onFinish = async (values) => {
        console.log('Success:', values);
        updateprog(true);
        const { text } = values;
        console.log(t)
        let ans = await fetch('http://localhost:3030/Update?oldtext=' + t + '&newtext=' + text + '&token=' + tokenval);
        ans = await ans.json();
        console.log(ans);
        // if (ans.message != 'Done!')
        //     message.error(ans.message);
        // else {
        message.warning('Printed')
        aUpd(text)
        // }
        console.log(t);
        updateprog(false)
    };

    const onFinishFailed = useCallback((errorInfo) => {
        console.log('Failed:', errorInfo);
    }, []);
    return (
        <Card title="See Notes" style={{ width: "30%", margin: "auto", marginTop: 30 }}>
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="New Text"
                    name="text"
                >
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button htmlType="submit">
                        <Spin style={{ marginRight: 8, alignSelf: 'stretch' }} spinning={prog} /> Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};
const Login = () => {
    const onClick = useSetRecoilState(state);
    const [tokenval, tokenupdater] = useRecoilState(token);
    const [prog, updateprog] = useState(false);
    const onFinish = useCallback(async (values) => {
        console.log('Success:', values);
        updateprog(true);
        const { username, password } = values;
        // setTimeout(() => updateprog(false), 1000)

        /* Send Get Req */
        let ans = await fetch('http://localhost:3030/Login?user=' + username + '&pass=' + password);
        ans = await ans.json();
        console.log(ans);
        if (ans.message != 'Valid')
            message.error(ans.message);
        else {
            tokenupdater(ans.token)
            onClick('Text')
            message.warning('Token is received')
        }
        console.log(token)
        updateprog(false)
    }, []);

    const onFinishFailed = useCallback((errorInfo) => {
        console.log('Failed:', errorInfo);
    }, []);

    return (
        <Card title="Login" style={{ width: "30%", margin: "auto", marginTop: 30 }}>
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button htmlType="submit">
                        <Spin style={{ marginRight: 8 }} spinning={prog} /> Submit
                    </Button>
                    <Button onClick={() => { onClick('Signup') }}>
                        Signup
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

const Signup = () => {
    const onClick = useSetRecoilState(state);
    const [prog, updateprog] = useState(false);
    const onFinish = useCallback(async (values) => {
        console.log('Success:', values);
        updateprog(true);
        const { username, password } = values;
        // setTimeout(() => updateprog(false), 1000)

        /* Send Get Req */
        let ans = await fetch('http://localhost:3030/Signup?user=' + username + '&pass=' + password);
        ans = await ans.json();
        console.log(ans);
        if (ans.message != 'Done!')
            message.error(ans.message);
        else {
            message.warning('Created')
        }
        updateprog(false)
    }, []);

    const onFinishFailed = useCallback((errorInfo) => {
        console.log('Failed:', errorInfo);
    }, []);

    return (
        <Card title="Signup" style={{ width: "30%", margin: "auto", marginTop: 30 }}>
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button htmlType="submit">
                        <Spin style={{ marginRight: 8 }} spinning={prog} /> Submit
                    </Button>
                    <Button onClick={() => onClick('Login')}>
                        <Spin style={{ marginRight: 8 }} spinning={prog} /> Login
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};


export default React.memo(Front)
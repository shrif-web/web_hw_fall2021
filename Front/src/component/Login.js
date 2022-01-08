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

const token = atom({
  key: 'token', // unique ID (with respect to other atoms/selectors)
  default: ''
});

const Login = () => {
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
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Checkbox>Remember me</Checkbox>
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
          {/* <Button onClick={()=>{stateupd('Signup')}}>
            Signup
          </Button> */}
        </Form.Item>
      </Form>
    </Card>
  );
};

export default React.memo(Login)
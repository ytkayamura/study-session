import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Input } from 'react-native-elements';
import axios from 'axios';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});

const Hello = () => (
  <div>
    <Text>Hello React Native Elements!</Text>
  </div>
);
const App = () => {
  const [mail, setMail] = useState('');
  const [pass, setPass] = useState('');
  const [mailError, setMailError] = useState('');
  const [passError, setPassError] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  // login
  const onPressLogin = async () => {
    // 入力チェック
    const mailErrorMsg = mail ? '' : 'Mail is Empty.';
    const passErrorMsg = pass ? '' : 'Pass  is Empty.';
    setMailError(mailErrorMsg);
    setPassError(passErrorMsg);
    if(!mail || !pass) {
      return;
    }
    // チェックOK
    try {
      const res = await axios.post('/api/login', { mail, pass });
      console.log('login', res.data);
    } catch(err) {
      console.log(err.message);
      console.log(err.response.data.message);
    }
    checkLogin()
  };

  // logout
  const onPressLogout = async () => {
    try {
      const res = await axios.post('/api/logout');
      console.log('logout', res.data);
    } catch(err) {
      console.error(err);
    }
    checkLogin()
  };

  // check_login
  const checkLogin = async () => {
    try {
      const res = await axios.get('/api/check-login');
      console.log('check-login', res.data);
      setAuthenticated(res.data.authenticated);
    } catch(err) {
      console.error(err);
      setAuthenticated(false);
    }
  };

  // SetSessionValue
  const onPressSetSessionValue = async () => {
    try {
      const res = await axios.post('/api/set-session-value', { mail, pass });
      console.log('set-session-value', res.data);
    } catch(err) {
      console.log(err.message);
      console.log(err.response.data.message);
    }
    checkLogin()
  };

  const onMailChange = (e) => {
    setMail(e.target.value)
  };
  const onPassChange = (e) => {
    setPass(e.target.value)
  };
  const login = (<Text>Logging in</Text>);
  return (
    <div>
      <View style={styles.container}>
        {authenticated ? login : null}
        <Input
          label="メールアドレス"
          placeholder="mail address"
          containerStyle={{ width: 450, marginTop: 16 }}
          value={mail}
          onChange={onMailChange}
          errorMessage={mailError}
        />
        <Input
          label="パスワード"
          placeholder="password"
          containerStyle={{ width: 450, marginTop: 16 }}
          secureTextEntry={true}
          value={pass}
          onChange={onPassChange}
          errorMessage={passError}
        />
        <View style={{ flexDirection: 'row' }} >
          <Button title="Log in" containerStyle={{ marginTop: 16 }} onPress={onPressLogin}/>
          <Button title="Log out" containerStyle={{ marginTop: 16, marginLeft: 8 }} onPress={onPressLogout}/>
        </View>
        <Button title="Check Log in" containerStyle={{ marginTop: 16 }} onPress={checkLogin}/>
        <Button title="Set Session value" containerStyle={{ marginTop: 16 }} onPress={onPressSetSessionValue}/>
      </View>
    </div>
  );
}

//ReactDOM.render(<CookiesProvider><App/></CookiesProvider>, document.getElementById('app'));
ReactDOM.render(<App/>, document.getElementById('app'));


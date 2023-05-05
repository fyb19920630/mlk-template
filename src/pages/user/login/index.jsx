/* eslint-disable @typescript-eslint/camelcase */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, message, Input, Form, Radio, Button } from 'antd';
import userLogin from '@/assets/passLogin.png';
import codeLogin from '@/assets/codeLogin.png';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { getCookie, setCookie, removeCookie } from '@/utils/cookie';
import { routerRedux } from 'dva/router';
import styles from './style.less';

const namespace = 'login';
const QRCode = require('qrcode.react');

const mapStateToProps = state => {
  const cardList = state[namespace].data;
  return {
    cardList,
  };
};

const mapDispatchToProps = dispatch => ({
  init: () => {},
  passLogin: (mobile, password, saveFlag) => {
    if (saveFlag) {
      setCookie('mobile', mobile, 7);
      setCookie('password', password, 7);
    } else {
      removeCookie('mobile');
      removeCookie('password');
    }
    dispatch(
      routerRedux.push({
        pathname: '/home',
      }),
    );
  },
});
@connect(
  mapStateToProps,
  mapDispatchToProps,
)
class loginPage extends Component {
  state = {
    status: 'user',
    loginErr: false,
    saveFlag: false,
  };

  componentDidMount() {
    this.props.init();
    this.props.form.setFieldsValue({
      mobile: getCookie('mobile'),
      passWord: getCookie('password'),
    });
    this.setState({
      saveFlag: getCookie('mobile') !== '',
    });
  }

  // 账户密码登录
  loginSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        if (!/^\S{7,20}$/.test(fieldsValue.passWord)) {
          message.error('请输入合法的密码');
          return;
        }
        this.props.passLogin(fieldsValue.mobile, fieldsValue.passWord, this.state.saveFlag);
      }
    });
  };

  saveSubmit = () => {
    const { saveFlag } = this.state;
    this.setState({
      saveFlag: !saveFlag,
    });
  };

  render() {
    const flag = navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
    );
    const { getFieldDecorator } = this.props.form;
    if (!flag) {
      return (
        <Modal
          visible
          footer={null}
          closable={false}
          mask={false}
          width={400}
          style={{ top: `${(window.innerHeight - 460) / 2}px` }}
          className={styles.loginModel}
        >
          <div style={{ display: this.state.status === 'code' ? 'block' : 'none' }}>
            <div className={styles.login_header}>
              <div
                className={styles.login_img1}
                onClick={() => {
                  this.setState({ status: 'user' });
                }}
              >
                <img style={{ width: 25 }} src={userLogin} alt="" />
              </div>
              <span>账号密码登录</span>
            </div>

            {this.props.cardList.data ? (
              <iframe
                title="eqCode"
                className={styles.loginIframe}
                frameBorder="0"
                sandbox="allow-scripts allow-same-origin allow-top-navigation"
                scrolling="no"
                src={this.props.cardList.data.qrUrl}
              ></iframe>
            ) : (
              '二维码加载中'
            )}
          </div>

          <div style={{ display: this.state.status === 'user' ? 'block' : 'none' }}>
            <div className={styles.login_header}>
              <div
                className={styles.login_img2}
                onClick={() => {
                  this.setState({ status: 'code' });
                }}
              >
                <img style={{ width: 40 }} src={codeLogin} alt="" />
              </div>
              <span>微信扫码登录</span>
            </div>
            <div style={{ padding: '0 20px', overflow: 'hidden', marginTop: 25 }}>
              <Form>
                <Form.Item>
                  {getFieldDecorator('mobile', {
                    rules: [
                      (rule, value, callback) => {
                        const errors = [];
                        if (value) {
                          if (!/^1\d{10}$/.test(value)) {
                            errors.push(new Error('请输入正确的手机号码'));
                          }
                        } else {
                          errors.push(new Error('请输入手机号'));
                        }
                        callback(errors);
                      },
                    ],
                  })(
                    <Input
                      style={{ height: 40, fontSize: 16 }}
                      prefix={<UserOutlined />}
                      placeholder="11位手机号"
                      maxLength={11}
                    />,
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('passWord', {
                    rules: [
                      {
                        required: true,
                        message: '请输入密码',
                      },
                    ],
                    getValueFromEvent: event => event.target.value.replace(/\s+/g, ''),
                  })(
                    <Input
                      style={{ height: 40, fontSize: 16 }}
                      type="password"
                      prefix={<LockOutlined />}
                      placeholder="输入密码"
                    />,
                  )}
                </Form.Item>
              </Form>
              {this.state.loginErr ? <p style={{ color: 'red' }}>账号密码错误</p> : null}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 15 }}>
                <Radio onClick={this.saveSubmit} checked={this.state.saveFlag}>
                  记住我
                </Radio>
              </div>
              <Button
                onClick={this.loginSubmit}
                type="primary"
                style={{ height: 40, fontSize: 16, width: 150 }}
              >
                登录
              </Button>
            </div>
          </div>
        </Modal>
      );
    }
    return (
      <div className={styles.ct}>
        <QRCode className={styles.opts} value={this.props.cardList.data.qrUrl} />
      </div>
    );
  }
}
export default Form.create()(loginPage);

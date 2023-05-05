import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Row, Col, message, Select, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import styles from './style.less';

const namespace = 'registerInfo';
const { Option } = Select;
@connect(({ registerInfo }) => ({
  registerInfo,
}))
class loginPage extends Component {
  state = {
    loading: false,
    time: 60,
    siv: null,
  };

  componentDidMount() {
    this.getTeamInfo();
  }

  // 获取小组信息
  getTeamInfo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/orgList`,
      payload: {
        pageable: {
          page: 0,
          size: 100,
        },
      },
    });
  };

  // 注册
  register = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.verifyCode(values);
      }
    });
  };

  // 保存注册信息
  saveRegister = value => {
    const { dispatch } = this.props;
    // const wxUserInfo = JSON.parse(sessionStorage.getItem('wxUserInfo'));
    dispatch({
      type: `${namespace}/saveRegUserInfo`,
      payload: {
        mobile: value.mobile,
        realName: value.name,
        orgId: value.orgId,
        channelCode: 'pc_finance',
        // moduleCode: 'design',
        // nickName: wxUserInfo.nickname,
        // headUrl: wxUserInfo.headimgurl,
        // sex: wxUserInfo.sex,
        // unionid: wxUserInfo.unionid,
        // openId: wxUserInfo.openId,
      },
      callback: res => {
        message.info(res.msg);
        if (res.code === 200) {
          dispatch(
            routerRedux.push({
              pathname: 'check',
            }),
          );
        }
      },
    });
  };

  // 验证验证码是否正确
  verifyCode = values => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/verifyCode`,
      payload: {
        mobile: values.mobile,
        code: values.code,
      },
      callback: res => {
        if (res.data.errno === 200) {
          // 200-验证成功； 5001-验证码位数非法，非6位； 5101-验证码失效； 5006-验证码错误
          this.saveRegister(values);
        } else if (res.data.errno === 5101) {
          message.error('验证码失效，请重新获取！');
          this.clearTime();
        } else {
          message.error('验证码输入错误，请重新输入！');
        }
      },
    });
  };

  // 60s计时
  count = () => {
    const { time } = this.state;
    if (time === 1) {
      this.clearTime();
    } else {
      this.setState({
        loading: true,
        time: time - 1,
      });
      this.state.siv = setTimeout(() => this.count(), 1000);
    }
  };

  // 清除定时器
  clearTime = () => {
    this.setState({
      loading: false,
      time: 60,
    });
    clearTimeout(this.state.siv);
  };

  // 获取验证码
  getAuthCode = e => {
    e.preventDefault();
    const { dispatch } = this.props;
    this.props.form.validateFieldsAndScroll(['mobile'], (err, values) => {
      if (!err) {
        this.setState({
          loading: true,
        });
        dispatch({
          type: `${namespace}/checkMobile`,
          payload: {
            mobile: values.mobile,
          },
        });
        dispatch({
          type: `${namespace}/getCode`,
          payload: {
            mobile: values.mobile,
          },
        });
        this.count();
      }
    });
  };

  // 手机号规则验证
  validatePhone = (rule, value, callback) => {
    if (value && !/^1\d{10}$/.test(value)) {
      callback('请输入正确的手机号码!');
    } else {
      callback();
    }
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, time } = this.state;
    const {
      registerInfo: { orgList },
    } = this.props;
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
        <h3>您还不是美立刻财务人员，请先申请</h3>
        <Form onSubmit={this.handleSubmit} className={styles.loginForm}>
          <Form.Item>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入姓名' }],
            })(<Input style={{ height: 40, fontSize: 16 }} placeholder="姓名" />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('mobile', {
              rules: [
                {
                  required: true,
                  message: '请输入手机号!',
                },
                {
                  validator: this.validatePhone,
                },
              ],
            })(
              <Input
                style={{ height: 40, fontSize: 16 }}
                placeholder="11位手机号"
                maxLength={11}
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Row gutter={8}>
              <Col span={15}>
                {getFieldDecorator('code', {
                  rules: [{ required: true, message: '请输入验证码' }],
                  getValueFromEvent: event => event.target.value.replace(/\D/g, ''),
                })(
                  <Input
                    placeholder="输入验证码"
                    style={{ height: 40, fontSize: 16 }}
                    maxLength={6}
                  />,
                )}
              </Col>
              <Col span={6}>
                <Button
                  disabled={loading}
                  style={{
                    width: 110,
                    height: 40,
                    fontSize: 16,
                    background: loading ? '#eee' : null,
                  }}
                  onClick={e => this.getAuthCode(e)}
                >
                  {loading ? `${time}'秒'` : '获取验证码'}
                </Button>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('orgId', {
              rules: [{ required: true, message: '请选择所属小组' }],
            })(
              <Select
                placeholder="选择所属小组"
                defaultActiveFirstOption={false}
                className={styles.registerSelect}
                style={{ height: 40, fontSize: 16 }}
              >
                {orgList.length > 0
                  ? orgList.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.orgName}
                      </Option>
                    ))
                  : null}
              </Select>,
            )}
          </Form.Item>
          <Form.Item style={{ overflow: 'hidden' }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ height: 40, fontSize: 16, width: 150 }}
              onClick={e => this.register(e)}
            >
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
export default Form.create()(loginPage);

/* eslint-disable @typescript-eslint/camelcase */
import React, { Component } from 'react';
import { Modal } from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser,
});
@connect(mapStateToProps)
class checkPage extends Component {
  state = {};

  componentDidMount() {
    // const { dispatch } = this.props;
    // if (dispatch) {
    //   dispatch({
    //     type: 'user/fetchCurrent',
    //     payload: {
    //       unionid: sessionStorage.getItem('finance_unionid'),
    //       moduleCode: 'finance',
    //     },
    //   });
    // }
  }

  render() {
    // const { regStatusObj, designStatusObj } = this.state;
    const { location } = this.props;
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
        <div>
          {location.query.type === 1007 ? (
            <p>账户已禁用，如有问题请联系运营人员</p>
          ) : (
            <p>申请已提交，请联系运营人员审核通过</p>
          )}
        </div>
      </Modal>
    );
  }
}
export default checkPage;

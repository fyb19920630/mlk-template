import { Avatar, Button, Icon, Menu, Spin } from 'antd';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { routerRedux } from 'dva/router';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

class AvatarDropdown extends React.Component {
  onMenuClick = event => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }

    router.push(`/account/${key}`);
  };

  SignOutFun = () => {
    sessionStorage.clear();
    localStorage.clear();
    const { dispatch } = this.props;
    dispatch(
      routerRedux.push({
        pathname: '/user/login',
      }),
    );
  };

  render() {
    const { currentUser = {}, menu } = this.props;

    if (!menu) {
      return (
        <div>
          <span className={`${styles.action} ${styles.account}`}>
            <Avatar
              size="small"
              className={styles.avatar}
              src={currentUser.wxUserInfo ? currentUser.wxUserInfo.headUrl : ''}
              alt="avatar"
            />
            <span className={styles.name}>
              {currentUser.wxUserInfo
                ? currentUser.wxUserInfo.name || currentUser.wxUserInfo.nickName
                : ''}
            </span>
          </span>
          <Button
            shape="circle"
            icon="logout"
            size="small"
            style={{
              margin: ' 0 24px',
            }}
            onClick={this.SignOutFun}
          />
        </div>
      );
    }

    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="center">
          <Icon type="user" />
          account center
        </Menu.Item>
        <Menu.Item key="settings">
          <Icon type="setting" />
          account settings
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          logout
        </Menu.Item>
      </Menu>
    );
    return currentUser && currentUser.id ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={currentUser.headImg} alt="avatar" />
          <span className={styles.name}>{currentUser.realName}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);

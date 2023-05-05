import React from 'react';
import { connect } from 'dva';
import { Redirect } from 'umi';
import PageLoading from '@/components/PageLoading';

class SecurityLayout extends React.Component {
  state = {
    isReady: false,
  };

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const { dispatch, location } = this.props;
    if (location.query.loginToken) {
      sessionStorage.setItem('financeAuth_loginToken', location.query.loginToken);
    }
    if (location.query.unionid) sessionStorage.setItem('finance_unionid', location.query.unionid);
    // if (process.env.API_ENV === 'local') {
    //   sessionStorage.setItem('financeAuth_loginToken', '2dc8c582fde0cfa8ee1ab1561859ce6e');
    // }
    // if (sessionStorage.getItem('finance_unionid')) {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
        payload: {},
      });
    }
    // }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser } = this.props;
    const isRegister = currentUser && currentUser.regStatus === 1;
    // const isLogin = sessionStorage.getItem('financeAuth_loginToken');

    if ((!isRegister && loading) || !isReady) {
      return <PageLoading />;
    }

    // if (!isLogin) {
    //   return <Redirect to="/user/login"></Redirect>;
    // }
    //
    // if (!isRegister) {
    //   return <Redirect to="/user/register"></Redirect>;
    // }
    //
    // if (currentUser.accStatus !== 1 || currentUser.designStatus !== 1) {
    //   return <Redirect to="/user/check"></Redirect>;
    // }

    return children;
  }
}

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);

/* eslint-disable @typescript-eslint/camelcase */
import React, { Component } from 'react';
import { connect } from 'dva/index';

@connect(({ home, loading }) => ({
  home,
  loading: loading.models.home,
}))
class Home extends Component {
  state = {};

  componentDidMount() {
    // this.getInfo();
  }

  getInfo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/getInfo',
      payload: {},
    });
  };

  render() {
    return <h2 style={{ textAlign: 'center', margin: '20px 0' }}>欢迎登录-美立刻财务系统</h2>;
  }
}

export default Home;

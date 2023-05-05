/* eslint-disable @typescript-eslint/camelcase */
import { getMenuData, getPageTitle } from '@ant-design/pro-layout';
import DocumentTitle from 'react-document-title';
import React from 'react';
import { connect } from 'dva';
import styles from './UserLayout.less';

const UserLayout = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  if (location.query.loginToken) {
    sessionStorage.setItem('financeAuth_loginToken', location.query.loginToken);
  }
  if (location.query.unionid) sessionStorage.setItem('finance_unionid', location.query.unionid);
  const { breadcrumb } = getMenuData(routes);
  return (
    <DocumentTitle
      title={getPageTitle({
        breadcrumb,
        ...props,
      })}
    >
      <div className={styles.container}>
        <div className={styles.content}>{children}</div>
      </div>
    </DocumentTitle>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);

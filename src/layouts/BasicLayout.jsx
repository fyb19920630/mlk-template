/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import DocumentTitle from 'react-document-title';
import React, { useEffect } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import logo from '../assets/logo.png';
import logoLong from '../assets/logoLong.png';
import TabsNav from '@/components/TabsNav/TabsNav';

/**
 * use Authorized check all menu item
 */
const menuDataRender = menuList =>
  menuList.map(item => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null);
  });

// 公共底部脚本代码
const footerRender = () => (
  <DefaultFooter
    copyright="京ICP备17025264号-2"
    links={[
      {
        key: '北京美立刻医疗器械有限公司版权所有',
        title: '北京美立刻医疗器械有限公司版权所有',
        href: '',
        blankTarget: true,
      },
    ]}
  />
);
// 左上角logo、title的布局
const handleMenuHeaderRender = logoImg => <Link to="/businessLine">{logoImg}</Link>;
const BasicLayout = props => {
  const { dispatch, children, settings, collapsed } = props;
  /**
   * constructor
   */
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'settings/getSetting',
      });
    }
  }, []);
  /**
   * init variables菜单的折叠收起事件
   */
  const handleMenuCollapse = payload =>
    dispatch &&
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload,
    });
  return (
    <ProLayout
      logo={collapsed ? logo : logoLong}
      menuHeaderRender={handleMenuHeaderRender}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl) {
          return defaultDom;
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: '首页',
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={footerRender}
      menuDataRender={menuDataRender}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      {...props}
      {...settings}
    >
      <DocumentTitle title={settings.title}>
        <TabsNav propsList={props} />
      </DocumentTitle>
    </ProLayout>
  );
};

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);

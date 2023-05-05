import { Layout, Tabs, Dropdown, Button, Menu } from 'antd';
import React, { useState, useEffect } from 'react';
import { DownOutlined } from '@ant-design/icons';
const { Content } = Layout;
const { TabPane } = Tabs;

// export interface TabsNavType extends ProLayoutProps {}

//获取 router 数组
const getRouterArray = routes => {
  let newArray = [];
  routes.map(item => {
    //有子节点
    if (item.name) {
      if (item.routes && item.routes.length > 0) {
        newArray = [...newArray, ...getRouterArray(item.routes)];
      } else {
        newArray.push({
          path: item.path,
          name: item.name,
        });
      }
    }
  });
  return newArray;
};

const TabsNav = ({ propsList }) => {
  const {
    route,
    location: { pathname },
    children,
  } = propsList;

  //获取 router
  const routeArray = getRouterArray(route.routes);

  const routeItem = routeArray.find(item => pathname === item.path);
  //初始化 or 赋值
  const changePaneItem = routeItem
    ? [
        {
          path: pathname,
          children,
          name: routeItem.name,
        },
      ]
    : [];

  //设置 tab item
  const [pane, setPane] = useState(changePaneItem);

  //监听 propsList 传值变化
  useEffect(() => {
    const existPane = pane.some(item => item.path === pathname);
    const existDetail = pane.some(item => item.path === '/orderDetail');
    let noDetailPanes = pane;
    // 不存在的添加
    // 除了当前打开的之外，关闭所有详情页面，地址/expertReplies/detail；/patientDetail
    if (!existPane) {
      if (existDetail) {
        noDetailPanes = pane.filter(item => item.path !== '/orderDetail');
      }
      // setPane(noDetailPanes);
      setPane([...noDetailPanes, ...changePaneItem]);
    } else {
      if (existDetail) {
        noDetailPanes = pane.filter(item => item.path !== '/orderDetail');
      }
      setPane(noDetailPanes);
    }
  }, [propsList]);

  //删除tab item
  const onRemove = targetKey => {
    //不能删除最后一个节点
    if (pane.length === 1) return;

    //如果删除的节点 为现选中节点 , 则需要选中当前删除节点的前一兄弟节点
    if (pathname === targetKey) {
      //获取 删除节点的 前节点
      let previousIndex;
      pane.forEach((item, i) => {
        if (item.path === targetKey) {
          previousIndex = i - 1;
        }
      });
      onChange(pane[previousIndex].path);
    }

    const newpanes = pane.filter(item => item.path !== targetKey);

    setPane(newpanes);
  };

  //切换选项卡
  const onChange = activeKey => {
    propsList.history.push(activeKey);
  };

  //删除其他
  const onRemoveOther = () => {
    const newpanes = pane.filter(item => item.path === pathname);
    setPane(newpanes);
  };

  const onRemoveAll = () => {
    setPane([]);
  };

  return (
    <Layout className="tabs-layout">
      <Content>
        <Tabs
          hideAdd
          type="editable-card"
          className="tabs-content"
          activeKey={pathname}
          onEdit={onRemove}
          onChange={onChange}
          tabBarExtraContent={
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="close" onClick={() => onRemove(pathname)}>
                    关闭当前
                  </Menu.Item>
                  <Menu.Item key="closeother" onClick={onRemoveOther}>
                    关闭其它
                  </Menu.Item>
                  {/*<Menu.Item key="closeall">关闭所有</Menu.Item> */}
                </Menu>
              }
            >
              <Button type="primary" ghost>
                操作
                <DownOutlined />
              </Button>
            </Dropdown>
          }
        >
          {pane.map(item => (
            <TabPane key={item.path} tab={item.name}>
              {item.children}
            </TabPane>
          ))}
        </Tabs>
      </Content>
    </Layout>
  );
};

export default TabsNav;

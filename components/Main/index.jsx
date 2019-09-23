import React, { useState } from 'react';

import { Menu, Avatar, Layout } from 'antd';
import Link from 'next/link';

import { makeStyles } from '../../styles';
import custom from './styles.css';

const { Sider } = Layout;

const styles = makeStyles(custom);

const Navigation = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)}>
      <Menu theme="dark" mode="inline">
        <Menu.Item>
          <div className="anticon">
            <Avatar size="small">H</Avatar>
          </div>
          <span className={styles.link}>
            <Link href="/"><a>Home</a></Link>
          </span>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

const Main = {};

Main.Navigation = Navigation;

Navigation.whyDidYouRender = true;

export default Main;

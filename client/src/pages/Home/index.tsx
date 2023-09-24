import React, { useState } from "react";
import {
  DownOutlined,
  HighlightOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState, RootDispatch } from "../../store";
import type { MenuProps } from "antd";
import { Layout, Menu, theme, Dropdown, message } from "antd";

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getDataAsync } from "../../slice/language";
import { LanguageType, ContentType } from "../../type";

import './index.css'

const { Header, Content, Sider } = Layout;

export default function Home() {
  //获取store中的数据
  const language: LanguageType = useSelector(
    (state: RootState) => state.language
  );
  const { content }: { content: ContentType } = language;

  //全局展示操作反馈信息
  const [messageApi, contextHolder] = message.useMessage();

  const location = useLocation();

  //得到修改状态的方法dispatch
  const dispatch: RootDispatch = useDispatch();
  //侧边栏的点击
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();

  //侧边栏的菜单内容
  const navData: MenuProps["items"] = [
    {
      key: "data",
      icon: React.createElement(HighlightOutlined),
      label: content.nav[0],
    },
    {
      key: "tag",
      icon: React.createElement(ThunderboltOutlined),
      label: content.nav[1],
    },
  ];

  //获取主题颜色
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  //点击MenuItem的回调,实现嵌套路由的跳转
  const handleMenuItemClick: MenuProps["onClick"] = (e) => {
    //当点击 数据管理 路由跳转到 'home'
    //当点击 标签管理 路由跳转到 '/home/tagmanage'
    if (e.key === "data") {
      navigate("/home");
    } else {
      navigate("/home/tagmanage");
    }
  };
  //设置的切换语言的数据
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <button
          style={{ border: "none", backgroundColor: "inherit", fontSize: "18px" }}
          onClick={() => {
            console.log("切换语言为中文");
            messageApi.open({
              type: "success",
              content: "设置语言为中文",
            });
            dispatch(getDataAsync("zh-CN"));
          }}
        >
          简体中文
        </button>
      ),
    },
    {
      key: "2",
      label: (
        <button
          style={{ border: "none", backgroundColor: "inherit",  fontSize: "18px" }}
          onClick={() => {
            console.log("切换语言为英文");
            messageApi.open({
              type: "success",
              content: "The language has been switched to English",
            });
            dispatch(getDataAsync("English"));
          }}
        >
          English
        </button>
      ),
    },
  ];

  return (
    <div className="home" style={{ height: "100%" }}>
      {contextHolder}
      <Layout style={{height: '100%'}}>
        {/* 头部 */}
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: '64px'
          }}
        >
          <div style={{ color: "#fff", fontSize: "20px" }}>{content.theme}</div>
          <div>
            {/* 右侧设置语言 */}
            <Dropdown menu={{ items }}>
              <button
                style={{
                  color: "#fff",
                  fontSize: "20px", 
                  backgroundColor: "inherit",
                  border: "none",
                }}
              >
                {language.type === "zh-CN" ? "设置" : "Settings"}
                <DownOutlined />
              </button>
            </Dropdown>
          </div>
        </Header>
        {/* 中部导航以及内容区域 */}
        <Content style={{height: '100%'}}>
          <Layout style={{ background: colorBgContainer, height: '100%' }}>
            {/* 导航栏 */}
            <Sider
              style={{ background: colorBgContainer }}
              width={200}
              theme="dark"
              collapsible={true}
              collapsed={collapsed}
              onCollapse={(value) => setCollapsed(value)}
            >
              <Menu
                mode="inline"
                selectedKeys={
                  location.pathname === "/home/tagmanage" ? ["tag"] : ["data"]
                }
                style={{ height: "100%" }}
                items={navData}
                theme="dark"
                onClick={handleMenuItemClick}
              />
            </Sider>
            {/* 内容区  渲染嵌套路由界面 */}
            <Content style={{ padding: "0 24px", height: '100%'}}>
              <Outlet />
            </Content>
          </Layout>
        </Content>
      </Layout>
    </div>
  );
}

import { Navigate } from "react-router-dom";
import Home from "../pages/Home";
import DataManage from "../pages/DataManage";
import TagManage from "../pages/TagManage";


//路由表
const routes = [
  {
    //实现路由的重定向 使得默认页面为home
    path: '*',
    element: <Navigate to='/home'/>
  },
  {
    path: "/home",
    element: <Home />,
    children: [
      {
        //默认路由为数据管理
        path: '',
        element: <DataManage />
      },
      {
        path: 'tagmanage',
        element: <TagManage />
      }
    ]
  },
];

export default routes;
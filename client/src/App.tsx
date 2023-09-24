import React from "react";
import routes from "./routes";


import './App.css'
import { useRoutes } from "react-router-dom";


function App() {
  //注册路由
  const element = useRoutes(routes)

  return (
    <div className="App">
      {/* 注册路由 */}
      {element}
    </div>
  );
}

export default App;

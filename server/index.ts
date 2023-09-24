const Koa = require("koa");
const useStatic = require("koa-static");
const { koaBody } = require("koa-body");
const cors = require("@koa/cors");

import useRouter from "./router";
//创建koa实例对象
const app = new Koa();

app
  // .use(cors())
  .use(
    koaBody({
      multipart: true,
    })
  )
  .use(useRouter.routes())
  .use(useStatic('../client/build'), {});

app.listen(3001, () => {
  console.log("server is running at http://localhost:3001");
});

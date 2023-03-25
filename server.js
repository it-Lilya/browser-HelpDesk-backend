const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const Router = require('koa-router');
const router = new Router();

const app = new Koa();

let tickets = [];
let nextId = 1;

app.use(koaBody({
    urlencoded: true,
    multipart: true,
    json: true,
}));


app.use((ctx, next) => {
  if (ctx.request.method !== 'OPTIONS') {
    next();

    return;
  }

  ctx.response.set('Access-Control-Allow-Origin', '*');

  ctx.response.set('Access-Control-Allow-Methods', 'DELETE, PUT, PATCH, GET, POST');

  ctx.response.status = 204;
});


app.use(async (ctx, next) => {
  ctx.body = tickets;
    if (ctx.request.method !== 'POST') {
        next();
        return;
      }  
    ctx.response.set('Access-Control-Allow-Origin', '*');
    tickets.push({...JSON.parse(ctx.request.body), id: nextId++});
    ctx.request.body = 'OK';
    next();
});


app.use(async (ctx, next) => {
    if (ctx.request.method !== 'GET') {
        next();
        return;
    }  
    ctx.response.set('Access-Control-Allow-Origin', '*');

    ctx.request.body = tickets;
    const method = ctx.request.URL.pathname;

    if (method === '/allTickets') {
      ctx.response.body = tickets;
    } 
    next();      
});



app.use(async (ctx, next) => {  
    if (ctx.request.method !== 'DELETE') {
        next();
        return;
      }  
    const indx = +/\d+/.exec(ctx.request.url);

    ctx.response.set('Access-Control-Allow-Origin', '*');
    tickets.some(el => {
      if (el.id === indx) {
        tickets.splice(el, 1)
      }
    })
    next();
});



const server = http.createServer(app.callback());

const port = 4040;

server.listen(port, (err) => {
  if(err) {
    console.log(err);

    return;
  }

  console.log('Server is listening to ' + port);
});

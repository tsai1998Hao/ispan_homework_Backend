//要用某個js檔案，要先(匯入)import然後use


import "dotenv/config";
//引入之後可以讓我們找到其他檔案的變數?
//載入.env這個檔案的設定

import express from "express";
import session from "express-session";
import dayjs from "dayjs";
import moment from "moment-timezone";
import cors from "cors";
import mysql_session from "express-mysql-session";
import sales from "./data/sales.json" assert{ type:"json"};
//引入json


//上傳多圖?
import upload from "./utils/upload-imgs.js";
//上傳多圖?

import db from "./utils/connect-mysql.js"

//import multer from 'multer';
//引入要upload的multer，應該是上傳圖片用的
//第二次處理上傳圖片,多圖的 把這個註解掉了

//後來上傳圖片,把你註解掉....到底為何
//const upload=multer({ dest: "tmp_uploads/"});
//引入要upload的multer後要創立物件,什麼東東放在站存區,dest是標的destination的縮寫,



// 把資料夾routes的檔案import進來
import admin2Router from "./routes/admin2.js"
import addressBookRouter from "./routes/address-book.js"
import forumAddress from "./routes/forum-address.js"


// 把資料夾routes的檔案import進來


const app =express();
// 呼叫express


//設定ejs
// EJS(Embedded JavaScript templates)用於在Node.js中生成HTML。 讓我們可以將JavaScript嵌入到HTML中，從而可以根據資料動態生成HTML內容。
app.set('view engine','ejs');
//設定ejs，樣板引擎


//讓前後端分離?，之後可以正常顯示頁面資料了
app.use(cors());
//讓前後端分離?，之後可以正常顯示頁面資料了



//?????
//頂層的middleware要放在set後面，要盡量放前面，middleware是express的核心概念
//把middleware放最前面,變成top-level-middleware,因為只用一次，所以又魔改....
//都是body-parser(express裡面附的)的功能
//總共是兩個middleware
app.use(express.urlencoded({exrended: true}));//如果是true的話就會使用qs套件
app.use(express.json());
//總共是兩個middleware
//都是body-parser(express裡面附的)的功能
//把middleware放最前面,變成top-level-middleware,因為只用一次，所以又魔改....
//?????


const MysqlStore = mysql_session(session);
const sessionStore =new MysqlStore({}, db);

//存session,專題不能用session
app.use(
    session({
    saveUninitialized: false,
    resave: false,
    store:sessionStore,
    secret:"sdq0f9jn4fug9"//加密
})
);

//11-22,15:05 top middleware, 有next,自訂middleware
app.use((req, res, next)=>{
res.locals.title=`後端`;//網站最上面顯示
res.locals.pig=`fat`;
res.locals.pageName="";
res.locals.toDateString=(d)=> dayjs(d).format("YYYY-MM-DD");

res.locals.toDateTimeString=(d)=> dayjs(d).format("YYYY-MM-DD HH:mm:ss");


next();//往下傳遞的意思
})

// 設定在home的檔案中，name是 process.env.DB_NAME, jj是18cm

app.get("/",(req, res)=>{
    res.locals.title='首頁|'+res.locals.title;
    res.render("home",{ name: process.env.DB_NAME,jj: "18cm"});
});
// 設定在home的檔案中，name是 process.env.DB_NAME, jj是18cm



//express的requset跟express的response，定義路由，用get方法才能拜訪，post不行
//定義路由，順序很重要!!!!!連到json
// app.get("/json-sales",(req, res)=>{
//定義路由，順序很重要!!!!!連到json
//express的requset跟express的response，定義路由，用get方法才能拜訪，post不行
// res.locals.title='JSON資料|'+res.locals.title;
// res.locals.pageName="json-sales";
//  res.json(sales);
    // res.render("json-sales",{ sales });
    //for迴圈的sales是這裏來的?!!!
// 引入json

// 讓網頁顯示ejs(應該拉
    // res.render("home", {name:"87"});
// 讓網頁顯示ejs(應該拉


//可以res.send也可以res.end一個讓網頁顯示html，一個就是顯示文字
//res.send(`<h2>aassaa1a</h2>`);
//可以res.send也可以res.end一個讓網頁顯示html，一個就是顯示文字


//懂了!!res那裏就是回應.方式!!!!!
// });







//取得queryString?，應該就是得到網址打的東西
// app.get("/try-qs", (req, res) => {
//     res.json(req.query);

//     });
//取得queryString?，應該就是得到網址打的東西






app.post("/try-post", (req, res) => {
    console.log('啥鬼',req.body)
    res.json(req.body);
    });
//取得post資料?



app.get("/try-post-form", (req, res) => {
    res.render("try-post-form");
    });
//取得post資料?

app.post("/try-post-form", (req, res) => {
    res.render("try-post-form",req.body);
    // res.json(req.body);

});
//取得post資料?



//upload的咚咚，在有要上傳檔案的路由要放中間這個upload.single("avatar")
app.post("/try-upload", upload.single("avatar"),(req, res) => {
    res.json(req.file);//上傳的東西輸出成json並放在file==?
    });
//upload的咚咚
//上傳圖片


//upload的咚咚，在有要上傳檔案的路由要放中間這個upload.single("avatar")
app.post("/try-uploads", upload.array("photos"),(req, res) => {
    res.json(req.files);//上傳的東西輸出成json並放在file==?
    });
//upload的咚咚
//上傳多多多多多多多多多多多圖片




//regular expressoin設定路由,不知道聰三小的
app.get("/my-params1/hello", (req, res) => {
    res.json({hello: "bitch"});
    });

//一個特別的router?(較寬鬆的規則，因為會影響到前一個，所以要放後面)
app.get("/my-params1/:action?/:id?", (req, res) => {
    res.json(req.params);
    });

//手機號碼,然後...?
app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res) => {
    let u = req.url.slice(3).split('?')[0];
    u = u.split('-').join('');
    res.send({u});
    });
//routes資料夾裡面的
app.use("/forum-address", forumAddress);  
app.use("/address-book", addressBookRouter);  
app.use(admin2Router);
//routes資料夾裡面的

app.get("/try-sess", (req, res) => {      //session的東西
    req.session.n= req.session.n ||0;
    req.session.n++;
    res.json({
        n: req.session.n,
        session:req.session
    });
    });

    //time的東西
    app.get("/try-moment", (req, res) => { 
        const fm ="YYYY-MM-DD HH:mm:ss"     
        const m1=moment();
        const m2=moment("12-12-11");      
        const d1 =dayjs();
        const d2 =dayjs("2023-11-15");  //最快? 11/15 16:38
        const a1 =new Date();
        const a2 =new Date("2023-11-15");

        res.json({
            m1: m1.format(fm),
            m2: m1.format(fm),
            m1a:m1.tz("Europe/London").format(fm),
            d1: d1.format(fm),
            d2: d1.format(fm),           
            a1,
            a2,

        })
    });
    
app.get("/try-db", async(req, res)=>{
    const [results, fields]= await db.query(
        `SELECT * FROM \`forum_article\` LIMIT 3`);
        // 跳脫?

        
    // res.json({results, fields});
    res.json({results});

})






// 登入登出登入登出登入登出登入登出登入登出
app.get("/login", async(req, res)=>{
    
});
app.post("/login", async(req, res)=>{
    
});
app.get("/logout", async(req, res)=>{
    
});



// 登入登出登入登出登入登出登入登出登入登出


//設定靜態內容的資料夾
app.use(express.static("public"))

// 連bootstrap，jquery，太神奇了，在網址打>>>http://localhost:3002/bootstrap/css/bootstrap.css
app.use("/bootstrap",express.static("node_modules/bootstrap/dist"));
app.use("/jquery",express.static("node_modules/jquery/dist"));
// 連bootstrap，jquery，太神奇了，在網址打>>>http://localhost:3002/jquery/jquery.js


//連線bootstrap的當案，在網址打>>>http://localhost:3002/css/bootstrap.min.css
// app.use(express.static("node_modules/bootstrap/dist"))
//連線bootstrap的當案，在網址打>>>http://localhost:3002/css/bootstrap.min.css


//另一種連jquery，在網址打>>>http://localhost:3002/jquery.min.js
// app.use(express.static("node_modules/jquery/dist"))
//另一種連jquery，在網址打>>>http://localhost:3002/jquery.min.js

//設定靜態內容的資料夾




//創造404的頁面，use是所有方法的意思，所以要放get...等方法後面
app.use((req, res)=>{
    res.send('<h1>迷路了</h1>');
}
);
//創造404的頁面





const port =process.env.WEB_PORT || 3001;
//把.env檔案的設定import進來後，就可以拿來用

app.listen(port, ()=>{
    console.log(`express server 哈哈${port}`);
});
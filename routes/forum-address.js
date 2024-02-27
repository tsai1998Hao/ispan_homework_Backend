//這裡是路由，sql語法

//路由的基本架構
import express from "express"
import db from "./../utils/connect-mysql.js";
import upload from "./../utils/upload-imgs.js";
import dayjs from "dayjs";
const router= express.Router();
//路由的基本架構




router.get("/add", async(req, res)=>{
    res.render('forum-address/add');
});
















//應該是顯示頁數//應該是顯示頁數//應該是顯示頁數//應該是顯示頁數//應該是顯示頁數//應該是顯示頁數
const getListData =async(req)=>{
    const perPage=5;//每頁有幾筆
    let page= +req.query.page || 1;

//關鍵字查詢//關鍵字查詢//關鍵字查詢//關鍵字查詢//關鍵字查詢//關鍵字查詢//關鍵字查詢
    let keyword= (req.query.keyword && typeof req.query.keyword === 'string' ) ? req.query.keyword.trim() : '';
    let keyword_=db.escape(`%${keyword}%`);

    let qs ={};

//日期範圍查詢//日期範圍查詢//日期範圍查詢//日期範圍查詢p1 起始日期
    let startDate= req.query.startDate ? req.query.startDate.trim() : '';
    const startDateD=dayjs(startDate);
    if(startDateD.isValid()){
        startDate=startDateD.format('YYYY-MM-DD');
    } else{
        startDate='';
    }
//日期範圍查詢//日期範圍查詢//日期範圍查詢//日期範圍查詢p1 起始日期


//日期範圍查詢//日期範圍查詢//日期範圍查詢//日期範圍查詢 結束的日期
let endDate= req.query.endDate ? req.query.endDate.trim() : '';
const endDateD=dayjs(endDate);
if(endDateD.isValid()){
    endDate=endDateD.format('YYYY-MM-DD');
} else{
    endDate='';
}
//日期範圍查詢//日期範圍查詢//日期範圍查詢//日期範圍查詢 結束的日期



//多重查詢//多重查詢//多重查詢//多重查詢//多重查詢
    let where = `WHERE 1 `;//一定要有空白
    if (keyword){
        qs.keyword=keyword;
        where +=` AND (\`article_content\` LIKE ${keyword_} OR \`article_title_name\` LIKE ${keyword_} ) `;
    }
//多重查詢//多重查詢//多重查詢//多重查詢//多重查詢


//日期範圍查詢//日期範圍查詢//日期範圍查詢p2
if(startDate){
    qs.startDate= startDate;
    where += ` AND article_release_date >='${startDate}' `;
}
//日期範圍查詢//日期範圍查詢//日期範圍查詢p2

//日期範圍查詢//日期範圍查詢//日期範圍查詢 結束時間
if(endDate){
    qs.endDate= endDate;
    where += ` AND article_release_date <='${endDate}' `;
}
//日期範圍查詢//日期範圍查詢//日期範圍查詢 結束時間

//關鍵字查詢//關鍵字查詢//關鍵字查詢//關鍵字查詢//關鍵字查詢//關鍵字查詢//關鍵字查詢
let totalRows =0;
    let totalPages =0;
    let rows=[];
    let output={
        success: false,
        page,
        perPage,
        rows,
        totalRows,
        totalPages,
        qs,
        redirect:"",
        info:"",
    };





//如果有人手濺把頁數打負數//如果有人手濺把頁數打負數//如果有人手濺把頁數打負數
if(page<1){
        output.redirect = `?page=1`;
        output.info=`頁碼小於1`;
        return output;
    //方法一    return res.redirect(req.baseUrl);
    /*方法二   return res.redirect(`?page=1`);*/
    }
    const t_sql=`SELECT COUNT(1) totalRows From forum_article ${where}`;//${where} 是關鍵字查詢的
    [[{totalRows}]] =await db.query(t_sql);
    totalPages=Math.ceil(totalRows/perPage);

    if(totalRows>0){
        if(page>totalPages){
            output.redirect = `?page=${totalPages}`;
            output.info=`頁碼大於總頁數`;
            return {...output, totalRows, totalPages};
            // return res.redirect(`?page=${totalPages}`);
        }
//如果有人手濺把頁數打負數//如果有人手濺把頁數打負數//如果有人手濺把頁數打負數


// 資料顯示// 資料顯示// 資料顯示// 資料顯示// 資料顯示// 資料顯示// 資料顯示// 資料顯示// 資料顯示// 資料顯示// 資料顯示// 資料顯示
    const sql=`SELECT * From forum_article ${where} ORDER BY article_release_date DESC
    LIMIT ${(page - 1)* perPage}, ${perPage}`;//${where} 是關鍵字查詢的
    [rows] = await db.query(sql);
    output={... output, success: true, rows, totalRows, totalPages};

    }
return output;
// 資料顯示// 資料顯示// 資料顯示// 資料顯示// 資料顯示// 資料顯示// 資料顯示// 資料顯示// 資料顯示// 資料顯示// 資料顯示// 資料顯示

/*
 const sql ="SELECT * FROM forum_article ORDER BY article_id ASC LIMIT 5"
 const [rows] = await db.query(sql);
 res.json(rows);
 */
}

router.get("/list", async (req, res)=>{
    res.locals.pageName="ab-list";
       const output = await getListData(req);
    if(output.redirect){
        return res.redirect(output.redirect);
    }
    res.render("forum-address/list", output);
});

router.get("/api", async(req, res)=>{
    res.json(await getListData(req));
});
//應該是顯示頁數//應該是顯示頁數//應該是顯示頁數//應該是顯示頁數//應該是顯示頁數//應該是顯示頁數







//新增資料//新增資料//新增資料//新增資料//新增資料//新增資料//新增資料//新增資料//新增資料//新增資料//新增資料//新增資料//新增資料//新增資料

router.post("/add", upload.none(), async (req, res) => {

    const{ article_id, article_member_id, article_boardcategory_name,article_title_name,article_content,article_release_date,article_update_date,article_like_num,article_comment_num,pic}=req.body;

/*
    const sql="INSERT INTO `forum_article` (`article_id`, `article_id_post`, `member_id_post`, `board_category_CH`,`title`,`content`,`article_release_date`,`update_date`) VALUE(?, ?, ?, ?, ?, ?, NOW(), NOW())";

    const [result]= await db.query(sql,[article_id, article_id_post, member_id_post, board_category_CH, title,content,article_release_date, update_date])
*/
    const sql="INSERT INTO `forum_article` SET ?";
    req.body.article_release_date =new Date();
    req.body.article_member_id =777;

    const [result]= await db.query(sql,[req.body]);




    res.json(result);
    


});

//新增資料//新增資料//新增資料//新增資料//新增資料//新增資料//新增資料//新增資料//新增資料//新增資料//新增資料//新增資料//新增資料//新增資料









//自己嘗試檢視資料//自己嘗試檢視資料//自己嘗試檢視資料//自己嘗試檢視資料//自己嘗試檢視資料//自己嘗試檢視資料//自己嘗試檢視資料//自己嘗試檢視資料//自己嘗試檢視資料
router.get("/detail/:article_id", async(req, res)=>{
    const article_id=req.params.article_id;
    res.locals.title="詳細|"+ res.locals.title;
    const sql = `SELECT * FROM forum_article WHERE article_id=?`;
    const [rows]= await db.query(sql, [article_id]);
    if(!rows.length){
        return res.redirect(req.baseUrl);
    }
    const row =rows[0];
    res.render("forum-address/detail",rows[0]);
});


router.get("/api/detail/:article_id", async(req, res)=>{
    const article_id=req.params.article_id;
    const sql = `SELECT * FROM forum_article WHERE article_id=?`;
    const [rows]= await db.query(sql, [article_id]);
    if(!rows.length){
        return res.json({success: false});
    }
    const row =rows[0];
    // row.birthday
    // 我沒有生日的欄位
    res.json({success: true, row});
});

//自己嘗試檢視資料//自己嘗試檢視資料//自己嘗試檢視資料//自己嘗試檢視資料//自己嘗試檢視資料//自己嘗試檢視資料//自己嘗試檢視資料//自己嘗試檢視資料//自己嘗試檢視資料









//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料

router.get("/edit/:article_id", async(req, res)=>{
    const article_id=req.params.article_id;
    res.locals.title="編輯|"+ res.locals.title;
    const sql = `SELECT * FROM forum_article WHERE article_id=?`;
    const [rows]= await db.query(sql, [article_id]);
    if(!rows.length){
        return res.redirect(req.baseUrl);
    }
    const row =rows[0];
    // row.birthday
    // 我沒有生日的欄位
    res.render("forum-address/edit",rows[0]);
});

//12/20 前端資料編輯 又在來一次
//取得單筆資料
router.get("/api/edit/:article_id", async(req, res)=>{
    const article_id=req.params.article_id;
    const sql = `SELECT * FROM forum_article WHERE article_id=?`;
    const [rows]= await db.query(sql, [article_id]);
    if(!rows.length){
        return res.json({success: false});
    }
    const row =rows[0];
    // row.birthday
    // 我沒有生日的欄位
    res.json({success: true, row});
});
//取得單筆資料
//12/20 前端資料編輯 又在來一次



router.put("/edit/:article_id", async(req, res)=>{
    const output ={
        success:false,
        postData: req.body,
        result: null,
    };
    
    // 怎麼加了就不能動了
    // req.body.address=req.body.address.trim();//去除頭尾空白
    // 怎麼加了就不能動了
    const sql=`UPDATE forum_article SET? WHERE article_id=?`;
    const [result] =await db.query(sql, [req.body, req.body.article_id]);
    output.result = result;
    output.success=!! result.changedRows;
    res.json(output);
});
//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料//編輯資料







//刪除資料//刪除資料//刪除資料//刪除資料//刪除資料//刪除資料//刪除資料//刪除資料//刪除資料//刪除資料//刪除資料//刪除資料

    router.delete("/:article_id", async(req, res)=>{
        const output ={
            success: false,
            result: null,
        };
        const article_id = +req.params.article_id;
        if( !article_id || article_id<1 ){
            return res.json(output);
        }
        const sql =`DELETE FROM forum_article WHERE article_id=${article_id}`;
        const[result] =await db.query(sql);
        output.result =result;
        output.success =!! result.affectedRows;
        res.json(output);
       
    });

//刪除資料//刪除資料//刪除資料//刪除資料//刪除資料//刪除資料//刪除資料//刪除資料//刪除資料//刪除資料//刪除資料//刪除資料





export default router;//路由的基本架構



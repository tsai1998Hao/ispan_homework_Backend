import express from "express";
import db from "./../utils/connect-mysql.js";
import upload from "./../utils/upload-imgs.js"
const router =express.Router();

const getListData = async (req)=>{
    const perPage=20;
    let page = +req.query.page ||1 ;
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
        redirect: "",
        info:"",

    };





    if(page<1){
        output.redirect= `?page=1`;
        output.info = `頁碼值小於1,早餐好吃`;
        // return res.redirect(req.baseUrl)
        return output;
    }


    const t_sql="SELECT COUNT(1) totalRows From forum_article";
    [[{totalRows}]]= await db.query(t_sql);
    totalPages =Math.ceil(totalRows /perPage);
    if(totalRows > 0){
        if(page > totalPages){
            output.redirect= `?page=${totalPages}`;
            output.info = `頁碼值大於總頁數`;
            return {...output, totalRows,totalPages};
        }


        const sql =`SELECT * From forum_article ORDER BY article_release_date DESC LIMIT ${(page-1)*perPage}, ${perPage}`;
        [rows] = await db.query(sql);
        output = {...output, success: true, rows, totalRows, totalPages};

         
    }
    return output;
    // const sql ="SELECT * FROM forum_article ORDER BY article_release_date DESC LIMIT 5";
    // const [rows] =await db.query(sql); 
    // res.json(rows);

}

router.get("/list", async(req, res) =>{
    res.locals.pageName = 'ab-list';
    const output =await getListData(req);
    if (output.redirect){
        return res.redirect(output.redirect);
    }
 res.render('address-book/list', output);

});

router.get("/api", async(req, res) =>{
 res.json( await getListData(req));

});
router.get("/add", async(req, res) =>{
    res.render( 'address-book/add');
});   
router.post("/add", upload.none(), async(req, res) =>{
    const output ={
        success: false,
        postData: req.body,
    };

    //原本我自己寫的，可是錯
    // const {article_id , article_member_id, article_member_name, article_boardcategory_name, article_title_name, article_content, article_release_date, article_update_date, article_like_num, article_comment_num, pic}=req.body

    // const sql= "INSERT INTO `forum_article` (`article_id` , `article_member_id`, `article_member_name`, `article_boardcategory_name`, `article_title_name`, `article_content`, `article_release_date`, `article_update_date`, `article_like_num`, `article_comment_num`, `pic`,) VALUES(999, 99, 999, ?, ?, ?, NOW(), 999, 9, 9, NOW() )";

    // const [result] =await db.query(sql, [article_id , article_member_id, article_member_name, article_boardcategory_name, article_title_name, article_content, article_release_date, article_update_date, article_like_num, article_comment_num, pic])





    //chat gpt改的 對了
     const { article_id, article_member_id, article_member_name, article_boardcategory_name, article_title_name, article_content, article_release_date, article_update_date, article_like_num, article_comment_num, pic } = req.body;

     const sql = "INSERT INTO `forum_article` ( `article_member_id`, `article_member_name`, `article_boardcategory_name`, `article_title_name`, `article_content`, `article_release_date`, `article_update_date`, `article_like_num`, `article_comment_num`, `pic`) VALUES ( 99, 'xxx', ?, ?, ?, NOW(), 999, 9, 9, NOW())";
    //!!是轉換成布林值
    try{
        const [result] = await db.query(sql, [article_title_name, article_content, article_release_date]);
        output.result= result;
        output.success=!! result.affectedRows;
    }catch(ex){
    output.excetption=ex;
    }
    


    //方法二，避免要填寫的欄位太多
    //const sql ="INSERT INTO `forum_article` SET ?";
    //req.body.article_release_date= new Date();
    //const [result] =await db.query(sql, [req.body]);



    res.json(output);
});   




router.get("/edit/:article_id", async(req, res) =>{
    const article_id= +req.params.article_id;

    const sql =`SELECT * FROM forum_article WHERE article_id=?`;
    const [rows] =await db.query(sql, [article_id]);
    if(! rows.length){
        return res.redirect(req.baseUrl);
    }


    res.render("address-book/edit", rows[0]);
});
router.get("/api/edit/:article_id", async(req, res) =>{
    const article_id= +req.params.article_id;

    const sql =`SELECT * FROM forum_article WHERE article_id=?`;
    const [rows] =await db.query(sql, [article_id]);
    if(! rows.length){
        return res.json({success: false});
    }
    const row =rows[0];

    res.json({success: true, row});
});

router.put("/edit/:article_id", async(req, res) =>{
    const output ={
        success: false,
        postData : req.body,
        result: null,
    };
    //req.body.address = req.body.address.trim();
    //去除空白? 
    const sql = `UPDATE forum_article SET ? WHERE article_id=?`;
    const [result] =await db.query(sql, [req.body, req.body.article_id]);
    output.result= result;
    output.success= !! result.changedRows;

    res.json(output);
});










router.delete("/:article_id", async(req, res) =>{
    const output ={
        success:false,
        result: null,
    }
    const article_id = +req.params.article_id;
    if(! article_id || article_id< 1){
        return res.json(output);
    }

    const sql =  `DELETE FROM forum_article WHERE article_id=${article_id}`;
    const [result] = await db.query(sql);
    output.result= result;
    output.success = !! result.affectedRows;
    res.json(output);

});   

export default router;

import  express  from "express";

const router = express.Router();
router.get('/admin2/:p1?/:p2?',(req, res)=>{
    const{url, baseUrl, orignalUrl, params, params:{p1, p2},}= req;
    res.json({
        url,
        baseUrl,
        orignalUrl,
        p1,
        p2,
    })

})


export default router;
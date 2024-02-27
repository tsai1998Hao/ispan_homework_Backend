import multer from "multer";
//應該是上傳圖片用的
import{v4 as uuidv4} from "uuid";

const extMap={
    "image/jpeg":".jpg",
    "image/png":".png",
    "image/webp":".webp",

};
 


//cb是callback 涵式
const fileFilter=(req, file, cb)=>{
   cb(null, !!extMap[file.mimetype]);
    
};

const storage =multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/img");
    },
    filename: (req, file, cb) => {
        const main =uuidv4();
        const ext =extMap[file.mimetype];
        cb(null, main + ext);
    },

});
export default multer({fileFilter, storage});


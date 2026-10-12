import fs from "fs"
import path from  "path"
import multer from "multer"

const uploadDir = path.resolve('./temp')

if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir,{recursive:true})
}

const storage = multer.diskStorage({
    destinattion(req,file,cd){
        cd(null,uploadDir)
    },
    filename(req,file,cd){
        cd(null,`${Date.now()}-${file.originalname}`)
    }
})

const filterFile = (req,file,cd)=>{
if(file.mimetype == 'application/pdf' || file.mimetype.startsWith('image/')){
    cd(null,true)

}else{
    cd(new Error('Only PDF and Images are allowed.'))
}
}

export default multer({storage,filterFile,limits:{
    fileSize:20 * 1024 * 1024
}})
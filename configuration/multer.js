const multer  = require('multer')


//product image upload configuration 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'public/images/uploads/productImages')
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name)
    }
})
const upload = multer({ storage: storage })

// categoryImage upload configuration 
const storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'public/images/uploads/categoryImages')
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name)
    }
})
const upload1 = multer({ storage: storage1 })

module.exports = {upload,upload1}
 

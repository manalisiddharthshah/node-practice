const { Validator } = require('node-input-validator');

module.exports = function (Validation){
    return async function (req, res, next) {
        try{
            const validationObj={}

            for (const key of Validation) {
                validationObj[key] = "required";
            }
            
            const v = new Validator(req.body,validationObj);
            const matched = await v.check();

            if (!matched) {
                return res.status(400).json({success:false, message:"Validation error.",statusCode:400,data:v.errors});
            }
            next()
        }catch(err)
        {
            console.log("-----Validations Middleware err ----",err)
            return res.status(401).json({success:false, data:[], message: 'Please check Validation code',statusCode:400});
        }
    }
}
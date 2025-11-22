const {Validator} = require('jsonschema')

const v = new Validator();

// Valida o corpo da requisição (req.body) contra um Schema JSON definido, retornando erros formatados se houver
 const schemaValidator = (schema) => (req, res, next) =>{
    const result = v.validate(req.body, schema);
    if(!result.valid){
        const messageError = [];
        for (const item of result.errors) {
            messageError.push(item.message.replace('"', '').replace('"', ''));
        }

        return res.status(400).send({
            schemaError: messageError
        })

    }
    return next();
 }

 module.exports = schemaValidator;


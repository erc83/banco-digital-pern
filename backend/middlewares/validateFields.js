import { response } from 'express'
import { validationResult } from 'express-validator'

const validateFields = (req, res = response, next) => {

    const errors = validationResult( req );
    if ( !errors.isEmpty() ) {
        return res.status(400).json({   // si entra en el return no entra el next
            ok: false,
            errors: errors.mapped()
        })
    }
    next();    // sin errores, continua el controlador
}

export { validateFields }
import express from 'express'
import { newTransfer, getTransfers, getTransferDetail, getUserDetail } from '../controllers/dashboard.js';
import { validateJWT } from '../middlewares/validate-jwt.js';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validateFields.js';
import { validateRut } from '../helpers/validations.js';

const router  = express.Router();

router.use( validateJWT )

router.post('/transfer/:id', 
    [
        check('name', 'El nombre es obligatorio').notEmpty(),
        check('account', 'El numero de la cuenta es obligatoria').notEmpty(),
        check('rut', 'El RUT es obligatorio').notEmpty(),
        check('rut', 'El formato del rut no es valido (111111111-1)').custom(validateRut),
        check('email', 'El email es obligatorio').isEmail(),
        check('comment', 'debe llevar un comentario de la transferencia').notEmpty(),
        check('amount', 'El monto es obligatorio').notEmpty(),
        validateFields
    ],
    newTransfer
)

router.get('/', getTransfers);

router.get('/transfer-detail', getTransferDetail);

router.get('/perfil', getUserDetail)


export default router

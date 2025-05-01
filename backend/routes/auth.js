import express from 'express';
import { check } from 'express-validator';
import { validateFields } from '../middlewares/validateFields.js'
import { validateRut } from '../helpers/validations.js';
import { validateJWT } from '../middlewares/validate-jwt.js';

import { crearUsuario, loginUser, updateUser, deleteUser } from '../controllers/auth.js';

const router = express.Router()

router.post('/register', 
    [
        check('name', 'El nombre es obligatorio').notEmpty(),
        check('rut', 'El RUT es obligatorio').notEmpty(),
        check('rut', 'El formato del rut no es valido (111111111-1)').custom(validateRut),
        check('email', 'El email es obligatorio').isEmail(),
        check('address', 'La dirección obligatoria').notEmpty(),
        check('password', 'La contraseña es obligatoria').notEmpty(),
        check('password', 'La contraseña debe tener un mínimo de 6 digitos').isLength(6),
        validateFields
    ],  
    crearUsuario
);

router.post('/login', 
    [
        check('rut', 'El Rut es obligatorio').notEmpty(),
        check('rut', 'El formato del rut no es valido (111111111-1)').custom(validateRut),
        check('password', 'La contraseña es obligatoria').notEmpty(),
        check('password', 'La contraseña debe tener un mínimo de 6 digitos').isLength(6),
        validateFields
    ],
    loginUser
);

router.use( validateJWT )

router.put('/users/:id', 
    [
        check('name', 'El nombre es obligatorio').notEmpty(),
        check('rut', 'El RUT es obligatorio').notEmpty(),
        check('rut', 'El formato del rut no es valido (111111111-1)').custom(validateRut),
        check('email', 'El email es obligatorio').isEmail(),
        check('address', 'La dirección obligatoria').notEmpty(),
    ],
    updateUser
);

router.delete('/users/:id', deleteUser );

export default router;

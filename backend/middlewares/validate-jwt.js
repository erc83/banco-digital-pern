import { response } from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config'

export const validateJWT = ( req, res = response, next ) => {
    // x-token headers

    const token = req.header('x-token');

    if( !token ) {
        return res.status(401).json({
            ok: false,
            message: 'No hay token en la peticion'
        })
    }

    try {
        const { uid } = jwt.verify(
            token,
            process.env.SECRET_JWT
        );

        req.uid = uid;

    } catch (error) {
        return res.status(401).json({
            ok: false,
            message: 'Token no válido'
        })        
    }
    next()
} 


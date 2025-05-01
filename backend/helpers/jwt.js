import jwt from 'jsonwebtoken';

export const generateJWT = ( uid, rut ) => {
    return new Promise ( (resolve, reject ) => {
        const payload = { uid, rut };
        jwt.sign(
            payload, 
            process.env.SECRET_JWT, 
            {
                expiresIn: '2h'
            }, 
            ( error, token ) => {
                if( error ) {
                    console.log(error);
                    reject('No se pudo generar el token');
                }
                resolve( token );
            }
        );
    })
}
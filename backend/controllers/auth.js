import { response } from 'express';
import bcrypt from 'bcryptjs';

import { newUser }  from "../db/consultas.js";

const crearUsuario = async (req, res = response) => {
    
    try {
        let user = req.body;
        
        const salt = bcrypt.genSaltSync()
        user.password = bcrypt.hashSync( user.password, salt);

        const newUserValues = Object.values(user);

        const result = await newUser(newUserValues);

        const { password, ...userFront } = result

        // res.status(201).json(result)
        res.status(201).json({
            ok: true,
            ...userFront
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            ok: false,
            error: "500 Internal Server Error", 
            message: error.message});
    }
}

export { crearUsuario }


import { response } from 'express';
import bcrypt from 'bcryptjs';
import { newUser, login, updateUserDB, deleteUserDB }  from "../db/consultas.js";
import { generateJWT } from '../helpers/jwt.js';

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
            message: error.message
        });
    }
}


const loginUser = async (req, res = response ) => {
    const { rut, password } = req.body
    try {
        const user = await login(rut)
        if( !user ){
            return res.status(400).json({
                ok: false,
                message: `No existe un usuario con este rut`
            })
        }
        const validPassword = bcrypt.compareSync ( password, user.password );
        if( !validPassword ) {
            return res.status(400).json({
                ok: false,
                message: 'Password Incorrecto'
            })
        }

        const token = await generateJWT ( user.id, user.rut );

        return res.status(201).json({
            ok: true,
            uid: user.id,
            rut: user.rut,
            token
        })

    } catch (error ) {
        console.log(error)
        res.status(500).json({
            ok: false, 
            message: "Favor de hablar con el Administrador"

        })
    }
}

const updateUser = async (req, res = response ) => {
    const { id } = req.params;
    
    //const datos = Object.values(req.body);
    const { name, rut, email, address } = req.body

    const userValues = [name, rut, email, address]

    try {
        const result = await updateUserDB ( userValues, id );
        res.status(201).send(result)
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "500 Internal Server Error", message: error })
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params

    try {
      const rowCount = await deleteUserDB( id )

      if( rowCount == 0 ) throw "No existe un usuario con ese id";
      res.status(200).json({
        ok: true,
        message: `Usuario eliminado exitosamente`
      })

    } catch (error) {
    
    }

}


export { 
    crearUsuario, 
    loginUser, 
    updateUser,
    deleteUser
}


import { response } from 'express';
import { newTransferDB } from '../db/consultas.js';

const newTransfer = async (req, res = response ) => {
    
    const transfer = req.body;
    
    try {
        const { id }  = req.params

        const { id: id_to, ...user_to } = await newTransferDB( transfer, id );

        res.status(201).json({
            ok: true,
            message: `transferencia realizada con éxito`,
            user: user_to
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "500 Internal Server Error en la tranferencia"
        })
    }
}


export {
    newTransfer
}
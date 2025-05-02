import { response } from 'express';
import { newTransferDB, getTranfersDB } from '../db/consultas.js';

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

const getTransfers = async( req, res = response) => {
    const userId = req.uid;
    const { pag } = req.query;
    const page = parseInt(pag);
    const pageSize = 3;   // cantidad de tranferencias por pagina.
    try {
        let transfers = await getTranfersDB(userId);
        transfers.sort( (a , b ) => new Date( b.date ) - new Date( a.date));
        const total = transfers.length;
        const totalPages = Math.ceil( total / pageSize );

        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedTransfers = transfers.slice( start, end);

        res.status(201).json({
            ok: true,
            message: 'Transferencias recibidas correctamente',
            page,       
            totalPages,
            hasPrev: page > 1,
            hasNext: page < totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null, 
            transfers: paginatedTransfers,
        });
    } catch (error) {
        console.error("Error al obtener transferencias:", error);
        res.status(500).json({ 
            ok: false,
            message: 'Error al obtener las transferencias'
        });
    }
}

export {
    newTransfer,
    getTransfers
}
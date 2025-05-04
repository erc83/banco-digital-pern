import { response } from 'express';
import { newTransferDB, getTranfersDB, getTranferDetailDB, getUserDetailDB} from '../db/consultas.js';

const newTransfer = async (req, res = response ) => {
    
    const transfer = req.body;
    
    try {
        const { id: id_from }  = req.params

        const transferUser = await newTransferDB( transfer, id_from );

        res.status(201).json({
            ok: true,
            message: `transferencia realizada con éxito`,
            newTransfer: transferUser
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

const getTransferDetail = async (req, res = response ) => {
    const { id_to, amount, comment} = req.body;
    const userId = req.uid;
    
    try {
        let transfer = await getTranferDetailDB(userId, { id_to, amount, comment});
        res.status(201).json({
            ok: true,
            message: 'Consulta a transferencia correctamente',
            transfer
        });
    } catch (error) {
        console.error("Error al obtener transferencia:", error);
        res.status(500).json({ 
            ok: false,
            message: 'Error al obtener la transferencia'
        });
    }
}

const getUserDetail = async (req, res = response) => {
    const userId = req.uid
    try {
        let userPerfil = await getUserDetailDB(userId);
        res.status(201).json({
            ok: true,
            message: 'Consulta perfil correctamente',
            user: userPerfil
        });
    } catch (error) {
        console.error("Error al obtener transferencia:", error);
        res.status(500).json({ 
            ok: false,
            message: 'Error al obtener datos usuario'
        });
    }
}

export {
    newTransfer,
    getTransfers,
    getTransferDetail,
    getUserDetail,
}
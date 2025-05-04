import { Pool } from "pg";
import 'dotenv/config'

const pool = new Pool({
    // opt 1
    connectionString: process.env.PG_CONNECTION_STRING

    //opt 2
    /* user: process.env.PG_USER,
    host: process.env.PG_HOST,
    password: process.env.PG_PASS,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT, */
})


export const newUser = async (user) => {
    const account = Math.floor(Math.random() * (999999-0)) + 0;
    const balance = 100000          // valor inicial de 100000 para pruebas en la creacion de usuario y realizacion de transferencias

    const result = await pool.query(
        `INSERT INTO users (account, name, rut, email, address, password, balance) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [account, ...user, balance]
    );
    //console.log(result.rows[0]);
    return result.rows[0];
}

export const login = async (rut) => {
    const result = await pool.query(
        `SELECT id, rut, password FROM users WHERE rut = $1`,
        [rut]
    );
    return result.rows[0];
}

export const updateUserDB = async( data, id ) => {
    const result = await pool.query(
        `UPDATE users SET name = $1, rut = $2, email = $3, address = $4 WHERE id = ${id} RETURNING *`,
        data
    );
    return result.rows[0];
}

export const deleteUserDB = async( id ) => {
    const result = await pool.query(
        `DELETE FROM users WHERE id = $1 RETURNING *`,
        [id]
    );
    return result.rowCount
}

//--------------------------
// Dashboard
//--------------------------

export const newTransferDB = async( { name, email, rut, comment, amount, account }, id ) => {   
    try {
        const resultDestino = await pool.query(
            //`SELECT * FROM users WHERE account = '${account}' AND email = '${email}' AND rut = '${rut}'`
            `SELECT id, account, name, email, rut FROM users WHERE account = $1 AND email = $2 AND rut = $3`,
            [account, email, rut]
        );
  
        if ( resultDestino.rowCount === 0 ) {
            throw "No se consiguio ningun usuario de destino con esos datos";
        }

        const destinatario = resultDestino.rows[0];
        const { id: id_to } = destinatario;
        if (id == id_to) throw "No puede transferirse a usted mismo";

        const resultOrigen = await pool.query(
            `SELECT balance FROM users WHERE id = $1`,
            [id]
        )
        const balanceOrigen = Number(resultOrigen.rows[0].balance);
        if(balanceOrigen < amount){
            throw "Saldo insuficiente para realizar la transferencia"
        }

        // Transferencia
        await pool.query(`BEGIN`);
        
        await pool.query(
            `UPDATE users SET balance = balance - $1 WHERE id = $2`,
            [Number(amount), id]
        );
        
        await pool.query(
            `UPDATE users SET balance = balance + $1 WHERE id = $2`,
            [Number(amount), id_to]
        );

        await pool.query(
            `INSERT INTO transfers (date, id_from, id_to, comment, amount) values ( now(), $1, $2, $3, $4)`,
            [id, id_to, comment, amount]
        );

        await pool.query(`COMMIT`);

        return {
            id_from: Number(id),
            id_to,
            amount,
            comment,
            name: destinatario.name,
            email: destinatario.email,
            rut: destinatario.rut
        }

    } catch (error) {
        await pool.query('ROLLBACK');
        console.error("Error en la transferencia:", error);
        throw error; 
    }
}

export const getTranfersDB = async ( id ) => {
    const result = await pool.query(
        `SELECT trs.id
            ,date
            ,id_from
            ,name
            ,comment
            ,trs.amount 
        FROM transfers AS trs 
        INNER JOIN users AS u 
        ON trs.id_to = u.id 
        WHERE trs.id_from = $1`,
        [id]
    );
    return result.rows;
}

export const getTranferDetailDB = async ( id, { id_to, amount, comment} ) => {
    const result = await pool.query(
        `SELECT trs.id
            ,date
            ,id_from
            ,name
            ,comment
            ,trs.amount 
        FROM transfers AS trs 
        INNER JOIN users AS u 
        ON trs.id_to = u.id 
        WHERE trs.id_from = $1 
        AND trs.id_to = $2 
        AND trs.amount = $3
        ORDER BY date DESC LIMIT 1`,
        [id ,id_to, amount]
    );
    return result.rows[0];
}

export const getUserDetailDB = async ( id ) => {
    const result = await pool.query(
        `SELECT id
            ,name
            ,email
            ,rut
            ,address
            ,account 
        FROM users
        WHERE id = $1`,
        [id]
    );
    return result.rows[0];
}


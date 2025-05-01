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
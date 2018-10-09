import { Pool } from 'pg'
const pool = new Pool()

pool.connect()

export default (text, params) => pool.query(text, params)

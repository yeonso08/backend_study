const pool = require('../db');
const bcrypt = require('bcrypt');

const userResolvers = {
    Query: {
        users: async () => {
            const result = await pool.query('SELECT * FROM users');
            return result.rows;
        },
        user: async (_, { id }) => {
            const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
            return result.rows[0];
        },
    },
    Mutation: {
        createUser: async (_, { name, email, password }) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await pool.query(
                'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
                [name, email, hashedPassword]
            );
            return result.rows[0];
        },
        updateUser: async (_, { id, name, age }, context) => {
            if (!context.user) throw new Error('로그인이 필요합니다');
            const result = await pool.query(
                'UPDATE users SET name = $1, age = $2 WHERE id = $3 RETURNING *',
                [name, age, id]
            );
            return result.rows[0];
        },
        deleteUser: async (_, { id }, context) => {
            if (!context.user) throw new Error('로그인이 필요합니다');
            await pool.query('DELETE FROM users WHERE id = $1', [id]);
            return '삭제 완료';
        }
    }
};

module.exports = userResolvers;
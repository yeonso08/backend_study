const pool = require('../db');

const resolvers = {
    Query: {
        // 전체 유저 조회
        users: async () => {
            const result = await pool.query('SELECT * FROM users');
            return result.rows;
        },
        // 특정 유저 조회
        user: async (_, { id }) => {
            const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
            return result.rows[0];
        },
        // 전체 게시글 조회
        posts: async () => {
            const result = await pool.query('SELECT * FROM posts');
            return result.rows;
        },
        // 특정 게시글 조회
        post: async (_, { id }) => {
            const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
            return result.rows[0];
        }
    },
    Mutation: {
        createPost: async (_, { title, content, user_id }) => {
            const result = await pool.query(
                'INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *',
                [title, content, user_id]
            );
            return result.rows[0];
        }
    }
};

module.exports = resolvers;
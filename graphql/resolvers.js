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
        createPost: async (_, { title, content }, context) => {
            if (!context.user) throw new Error('로그인이 필요합니다');

            const result = await pool.query(
                'INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *',
                [title, content, context.user.id]
            );
            return result.rows[0];
        },
        updatePost: async (_, { id, title, content }, context) => {
            if (!context.user) throw new Error('로그인이 필요합니다');

            const result = await pool.query(
                'UPDATE posts SET title = $1, content = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
                [title, content, id, context.user.id]
            );
            return result.rows[0];
        },
        deletePost: async (_, { id }, context) => {
            if (!context.user) throw new Error('로그인이 필요합니다');

            await pool.query('DELETE FROM posts WHERE id = $1 AND user_id = $2', [id, context.user.id]);
            return '삭제 완료';
        }
    },
    Post: {
        user: async (post) => {
            const result = await pool.query('SELECT * FROM users WHERE id = $1', [post.user_id]);
            return result.rows[0];
        }
    }
};

module.exports = resolvers;
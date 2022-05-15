module.exports = function(app) {
    const post = require('./postController');
    const jwtMiddleware = require("../../../config/jwtMiddleware");

    // 3.1 게시물 리스트 조회 API
    app.get('/posts', post.getPosts);


}
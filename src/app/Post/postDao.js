// 유저 게시물 조회
async function selectUserPosts(connection, userIdx) {
    const selectUserPostsQuery = `
        SELECT p.postIdx as postIdx,
            pi.imgUrl as postImgUrl
        FROM Post as p
            join PostImgUrl as pi on pi.postIdx = p.postIdx and pi.status = 'ACTIVE'
            join User as u on u.userIdx = p.userIdx
        WHERE p.status = 'ACTIVE' and u.userIdx = ?
        group by p.postIdx
        HAVING min(pi.postImgUrl)
        order by p.postIdx;  
    `;
    const [userPostsRows] = await connection.query(selectUserPostsQuery, userIdx);

    return userPostsRows;
}

// 게시물 정보 조회
async function selectPosts(connection, userIdx) {
    const selectPostsQuery = `
            SELECT p.postIdx as postIdx,
	            u.userIdx as userIdx,
	            u.nickName as nickName,
	            u.profileImgUrl as profileImgUrl,
	            p.content as content,
	            IF(postLikeCount is null, 0, postLikeCount) as postLikeCount,
	            IF(commentCount is null, 0, commentCount) as commentCount,
	            case
	                when timestampdiff(second, p.updatedAt, current_timestamp) < 60
	                    then concat(timestampdiff(second, p.updatedAt, current_timestamp), '초 전')
	                when timestampdiff(minute , p.updatedAt, current_timestamp) < 60
	                    then concat(timestampdiff(minute, p.updatedAt, current_timestamp), '분 전')
	                when timestampdiff(hour , p.updatedAt, current_timestamp) < 24
	                    then concat(timestampdiff(hour, p.updatedAt, current_timestamp), '시간 전')
	                when timestampdiff(day , p.updatedAt, current_timestamp) < 365
	                    then concat(timestampdiff(day, p.updatedAt, current_timestamp), '일 전')
	                else timestampdiff(year , p.updatedAt, current_timestamp)
	            end as uploadTime,
	            IF(pl.status = 'ACTIVE', 'Y', 'N') as likeOrNot
	        FROM Post as p
	            join User as u on u.userIdx = p.userIdx
	            left join (select postIdx, count(postLikeIdx) as postLikeCount from PostLike WHERE status = 'ACTIVE' group by postIdx) plc on plc.postIdx = p.postIdx
	            left join (select postIdx, count(commentIdx) as commentCount from Comment WHERE status = 'ACTIVE' group by postIdx) c on c.postIdx = p.postIdx
	            left join Follow as f on f.followeeIdx = p.userIdx and f.status = 'ACTIVE'
	            left join PostLike as pl on pl.userIdx = f.followerIdx and pl.postIdx = p.postIdx
	        WHERE f.followerIdx = ? and p.status = 'ACTIVE'
	        group by p.postIdx;
    `;

    const [postRows] = await connection.query(selectPostsQuery, userIdx);

    return postRows;
}

async function selectPostImgs(connection, postIdx) {
    const selectPostImgsQuery = `
        SELECT pi.postImgUrl,
            pi.imgUrl
        FROM PostImgUrl as pi
            join Post as p on p.postIdx = pi.postIdx
        WHERE pi.status = 'ACTIVE' and p.postIdx = ?;
    `;

    const [postImgRows] = await connection.query(selectPostImgsQuery, postIdx);

    return postImgRows;
}


module.exports = {
    selectUserPosts,
    selectPosts,
    selectPostImgs
}
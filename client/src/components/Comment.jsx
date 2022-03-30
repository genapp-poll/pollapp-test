import { connect } from "react-redux";
import React, { useState } from 'react';
import { comment as commentAction, like_comment } from '../store/actions';
import {FaHeart, FaRegHeart} from "react-icons/fa";
import {HiReply} from "react-icons/hi";

const Comment = ({comment, repliedTo, parent, commentAction, like_comment, poll, user, child=false}) => {
    const [isReplyin, setIsReplying] = useState(false);
    const [newComment, setNewComment] = useState("");
    const {_id:user_id, token} = user;
    const {_id, comment:commentText, user:comment_user, user_likes={}, likes, parent_comment} = comment;

    const {users=[], total} = user_likes;

    const liked = users.some((u) => u.token === token);
    console.log("liked", liked, users);

    const onPressReply = () => {
        setIsReplying(true);
    }

    const onPressCancelReply = () => {
        setIsReplying(false);
        setNewComment("");
    }

    const onPressSendReply = async () => {
        if(token){
            if(await commentAction(poll._id, {comment: newComment, token, parent_comment: parent_comment || _id, reply_to: _id})){
                setNewComment("");
                setIsReplying(false);
            }
        }
    }

    const onCommentChange = (e) => {
        setNewComment(e.target.value);
    }

    const onPressHeart = () => {
        like_comment(poll._id, _id, {token})
    }

    return (
        <div className='comment' style={{textAlign: "left", padding: 10, paddingTop: child?0:10}}>
            <small className='comment-user' style={{margin: 0}}>{comment_user}</small><br />

            {child && (repliedTo != parent) && <small className="reply-to-comment" style={{color: "grey"}}><HiReply color="grey" /> {repliedTo.comment.slice(0,50)+(repliedTo.comment.length>50?"...":"")}</small>}
            <p className='comment-body' style={{margin: 0}}>{commentText}</p>
            <p className='comment-likes' style={{margin: 0}}><span style={{cursor: "pointer"}} onClick={onPressHeart}>{liked?<FaHeart size={20} color="red" />:<FaRegHeart size={20} color="grey" />}</span> {likes}</p>
            {isReplyin && <div><textarea value={newComment} onChange={onCommentChange} /></div>}
            {!isReplyin && <button onClick={onPressReply}>reply</button>}
            {isReplyin && <button onClick={onPressCancelReply}>cancel</button>}
            {isReplyin && <button onClick={onPressSendReply}>send</button>}
        </div>
    );
}

function mapStateToProps({auth}){
    return {user: auth.user}
}
 
export default connect(mapStateToProps, {commentAction, like_comment})(Comment);
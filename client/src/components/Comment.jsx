import { connect } from "react-redux";
import React, { useState } from 'react';
import { comment as commentAction } from '../store/actions';

const Comment = ({comment, commentAction, poll, user, child=false}) => {
    const [isReplyin, setIsReplying] = useState(false);
    const [newComment, setNewComment] = useState("");
    const {token} = user;
    const {_id, comment:commentText, user:comment_user, likes, parent_comment} = comment;

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

    return (
        <div className='comment' style={{textAlign: "left", padding: 10, paddingTop: child?0:10}}>
            <p className='comment-user' style={{margin: 0}}>{comment_user}</p>
            <p className='comment-body' style={{margin: 0}}>{commentText}</p>
            <p className='comment-likes' style={{margin: 0}}>{likes}</p>
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
 
export default connect(mapStateToProps, {commentAction})(Comment);
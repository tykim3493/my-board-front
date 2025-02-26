import React, { useState } from "react";
import axios from 'axios';

const ChildCommentItem = ({
    setComments,
    name,
    childComment,
    setCommentUpdate,
}) => {
    const [childCommentModify, setChildCommentModify] = useState(false);
    const [childContent, setChildContent] = useState(childComment.content);

    // 각 인풋 값 저장
    const contentValueChange = (event) => {
        setChildContent(event.target.value);
    }

    // 댓글 수정
    const modifyComment = (id, content) => {
        const comment = {
            content: content,
        }
        axios.put(`http://localhost:3000/board/comment/modify/${id}`, comment)
            .then(() => {
                setCommentUpdate(prev => !prev);
            })
    }
    
    // 댓글 삭제
    const deleteComment = (id) => {
        axios.delete(`http://localhost:3000/board/comment/${id}`)    
            .then(() => {
                setComments((prevComments) => prevComments.filter(comment => comment.id !== id));
            })
    };

    return (
        <div className="w-full flex py-1 items-center">
            <div className="flex-1 flex items-center">
                <span className="text-md font-bold">
                    {childComment.writer}
                </span>
                <div className="items-center" style={name === childComment.writer ? { display: childCommentModify ? 'none' : 'flex' } : null}>
                    <span className="ml-5 text-md">
                        {childComment.content}
                    </span>
                    <span className="ml-5 text-sm text-gray-300">
                        {new Date(childComment.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                </div>
                {name === childComment.writer
                    ? (<div className="flex-1 mr-5" style={{ display: childCommentModify ? 'flex' : 'none' }}>
                        <input
                            className="w-full ml-5 px-1 rounded-lg outline-none"
                            value={childContent}
                            onChange={contentValueChange}
                        />
                    </div>) : null}
            </div>
            <div className="flex text-right">
                {name === childComment.writer
                    ? (<div className="flex">
                        <span
                            className="text-md text-blue-400 underline hover:cursor-pointer"
                            style={{ display: childCommentModify ? 'none' : 'flex' }}
                            onClick={() => setChildCommentModify(true)}
                        >
                        수정
                        </span>
                        <span
                            className="text-md text-blue-400 underline hover:cursor-pointer"
                            style={{ display: childCommentModify ? 'flex' : 'none' }}
                            onClick={() => {
                                setChildCommentModify(false);
                                modifyComment(childComment.id, childContent);
                            }}
                        >
                        완료
                        </span>
                        <span
                            className="ml-2 text-md text-red-400 underline hover:cursor-pointer"
                            onClick={() => deleteComment(childComment.id)}
                        >
                        삭제
                        </span>
                    </div>)
                    : null}
            </div>
        </div>
    )
}

export default ChildCommentItem;
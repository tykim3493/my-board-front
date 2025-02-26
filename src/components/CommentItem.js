import React, { useState } from "react";
import axios from 'axios';
import ChildCommentItem from "../components/ChildCommentItem";

const CommentItem = ({
    comments,
    boardId,
    setComments,
    name,
    parentComment,
    setCommentUpdate,
}) => {
    const [childCommentWrite, setChildCommentWrite] = useState({});
    const [childWriter, setChildWriter] = useState("");
    const [childContent, setChildContent] = useState("");
    const [commentModify, setCommentModify] = useState(false);
    const [parentContent, setParentContent] = useState(parentComment?.content || "");

    const childComments = comments
        .filter((comment) => comment.parent) // 대댓글만 필터링
        .reduce((acc, comment) => { // 부모 ID 별로 그룹화
            if (!acc[comment.parent]) acc[comment.parent] = [];
                acc[comment.parent].push(comment);
            return acc;
        }, {});

    // 대댓글 입력창 토글
    const childCommentWriteToggle = (id) => {
        setChildCommentWrite((prevState) => ({
            ...prevState,
            [id]: !(prevState[id] ?? false), // 해당 댓글만 토글
        }));
    };

    // 각 인풋 값 저장
    const writerValueChange = (event) => {
        setChildWriter(event.target.value);
    }
    const contentValueChange = (event) => {
        setChildContent(event.target.value);
    }
    const parentModityValueChange = (event) => {
        setParentContent(event.target.value);
    }

    // 대댓글 쓰기
    const newChildComment = (id) => {
        const childComment = {
            boardId: boardId,
            writer: name || childWriter,
            content: childContent,
            parent: id,
        }
        axios.post('http://localhost:3000/board/comment/write', childComment)
            .then((response) => {
                const newComment = response.data;
                const copyComments = [...comments];
                copyComments.push(newComment);
                setComments(copyComments);
                setChildWriter(name);
                setChildContent("");
            })
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
        <div>
            {/* 헤더 */}
            <div className="w-full flex px-4 py-3 rounded-2xl items-center bg-gray-200">
                <div className="flex-1 justify-left items-center">
                    <span className="text-md font-bold">{parentComment?.writer}</span>
                </div>
                <div className="text-right items-center">
                    <span className="text-md text-gray-400">{new Date(parentComment?.createdAt).toLocaleDateString('ko-KR')}</span>
                </div>
            </div>
            {/* 바디 */}
            <div className="flex px-4">
                <div
                    className="flex-1 py-3 rounded-2xl items-center"
                    style={name === parentComment?.writer ? { display: commentModify ? 'none' : 'flex' } : null}
                >
                    <span className="text-md">{parentComment?.content}</span>
                </div>
                {name === parentComment?.writer
                    ? (<div className="flex-1 items-center" style={{ display: commentModify ? 'flex' : 'none' }}>
                        <input
                            className="w-full h-8 mr-5 px-2 rounded-lg outline-none bg-gray-100"
                            value={parentContent}
                            onChange={parentModityValueChange}
                        />
                    </div>) : null}
                <div className="flex py-3 rounded-2xl items-center text-right">
                    <span
                        className="ml-2 text-md text-gray-400 underline hover:text-blue-400 hover:cursor-pointer"
                        onClick={() => childCommentWriteToggle(parentComment?.id)}>
                        대댓글
                    </span>
                    {name === parentComment?.writer
                        ? (<div className="flex">
                            <span
                                className="text-md text-blue-400 ml-3 underline hover:cursor-pointer"
                                style={{ display: commentModify ? 'none' : 'flex' }}
                                onClick={() => setCommentModify(true)}
                            >
                            수정
                            </span>
                            <span
                                className="text-md text-blue-400 ml-3 underline hover:cursor-pointer"
                                style={{ display: commentModify ? 'flex' : 'none' }}
                                onClick={() => {
                                    setCommentModify(false);
                                    modifyComment(parentComment.id, parentContent);
                                }}
                            >
                            완료
                            </span>
                            <span
                                className="ml-2 text-md text-red-400 ml-3 underline hover:cursor-pointer"
                                onClick={() => deleteComment(parentComment.id)}
                            >
                            삭제
                            </span>
                            </div>)
                        : null
                    }
                </div>
            </div>
            {/* 대댓글 작성 */}
            <div className="ml-12 pl-4 py-3 mb-3 items-center" style={{ display: childCommentWrite[parentComment?.id] ? 'flex' : 'none' }}>
                <div className="flex items-center mr-5">
                    <span className="w-16 text-md font-bold">작성자</span>
                        {name ? (name)
                        : (<input
                            className="w-full ml-4 px-3 py-2 rounded-xl border border-gray-300 outline-none"
                            value={childWriter}
                            onChange={writerValueChange}
                        />)}
                </div>
                <div className="flex-1 flex items-center">
                    <span className="w-8 ml-5 text-md font-bold">내용</span>
                    <input
                        className="w-full ml-4 px-3 py-2 rounded-xl border border-gray-300 outline-none"
                        value={childContent}
                        onChange={contentValueChange}
                    />
                </div>
                <div
                    className="ml-3 mr-1 px-3 py-2 bg-blue-400 rounded-lg hover:bg-blue-600 hover:cursor-pointer"
                    onClick={() => newChildComment(parentComment.id)}>
                        <span className="text-white font-bold">등록</span>
                </div>
            </div>
            {/* 대댓글 렌더링 */}
            {childComments[parentComment?.id] && childComments[parentComment?.id]
                .sort((a, b) => new Date(b.date) - new Date(a.date)) // 최신순 정렬
                .map((childComment) => (
                    <ul key={childComment.id}  className="ml-12 px-4 py-3 my-2 bg-yellow-100 rounded-2xl">
                        <li>
                            
                            <ChildCommentItem
                                comments={comments}
                                setComments={setComments}
                                name={name}
                                childComment={childComment}
                                setCommentUpdate={setCommentUpdate}
                            />  

                        </li>
                    </ul>
                ))
            }
        </div>
    )
}

export default CommentItem;
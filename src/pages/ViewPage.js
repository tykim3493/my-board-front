import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CommentItem from "../components/CommentItem";

function ViewPage() {

    // url에서 id 파라미터 가져오기
    const { id } = useParams("");
    const [article, setArticle] = useState([]);
    const [file, setFile] = useState([]);
    const [comments, setComments] = useState([]);
    const [commentLength, setCommentLength] = useState([]);
    const [name, setName] = useState(null);
    const [parentWriter, setParentWriter] = useState("");
    const [parentContent, setParentContent] = useState("");
    const [commentUpdate, setCommentUpdate] = useState(true);

    const parentComments = comments
    .filter((comment) => comment.parent === null || comment.parent === undefined) // 댓글만 필터링
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // 최신순 정렬

    useEffect(() => {
    const token = localStorage.getItem('token'); // 저장된 토큰 가져오기
    if (token) {
        axios.get("http://localhost:3000/members", {
            headers: { Authorization: `Bearer ${token}` }, // 헤더에 토큰 포함
        })
        .then((res) => {
            setName(res.data.name);
        })
    }
    }, []);

    // 서버 데이터 렌더링
    useEffect(() => {
        axios.get(`http://localhost:3000/board/${id}`)
        .then((response) => {
            setArticle(response.data.article);
            setFile(response.data.file);
            setCommentLength(response.data.comment);
        })
        axios.get(`http://localhost:3000/board/comment/${id}`)
        .then((response) => {
            setComments(response.data);
        })
    }, [id, commentUpdate]);

    // 게시물 삭제 버튼
    const deleteArticles = () => {
        if (window.confirm("게시물을 삭제하시겠습니까?")) {
            axios.delete(`http://localhost:3000/board/${id}`)
                .then(() => {
                    window.location.href = '/';
                })
        }
    };
 
    // 각 인풋 값 저장
    const writerValueChange = (event) => {
        setParentWriter(event.target.value);
    }
    const contentValueChange = (event) => {
        setParentContent(event.target.value);
    }

    // 부모 댓글 쓰기
    const newParentComment = () => {
        const parentComment = {
            boardId: id,
            writer: name || parentWriter,
            content: parentContent,
        }
        axios.post('http://localhost:3000/board/comment/write', parentComment)
            .then((response) => {
                const newComment = response.data;
                const copyComments = [...comments];
                copyComments.push(newComment);
                setComments(copyComments);
                setParentWriter("");
                setParentContent("");
            })
    }

    return (  
        <div className="p-12 bg-gray-100">
            <div className="rounded-2xl shadow-lg overflow-hidden bg-white">
                {/* 머리줄 */}
                <div className="flex px-8 py-5 bg-gray-600">
                    <div className="w-full">
                        <span className="text-md font-bold text-white">상세보기</span>
                    </div>
                </div>
                {/* 정보 */}
                <div className="p-3">
                    <div className="flex px-5 py-3">
                        <div className="flex-1 flex">
                            <div className="flex w-12 mr-5 justify-center items-center">
                                <span className="text-md font-bold">작성자</span>
                            </div>
                            <div className="flex-1 m-2">
                                <span id="viewWriterSpan">{article.writer}</span>
                            </div>
                        </div>
                        <div className="flex-1 flex justify-center">
                            <div className="flex w-20 mr-5 justify-center items-center">
                                <span className="text-md font-bold">작성일</span>
                            </div>
                            <div className="flex-1 m-2">
                                <span id="dateSpan" className="text-sm">{new Date(article.createdAt).toLocaleDateString('ko-KR')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex px-5 py-3">
                        <div className="flex-1 flex justify-center">
                            <div className="flex w-12 mr-5 justify-center items-center">
                                <span className="text-md font-bold">제목</span>
                            </div>
                            <div className="flex-1 m-2">
                                <span id="viewTitleSpan">{article.title}</span>
                            </div>
                        </div>
                        <div className="flex-1 flex justify-center">
                            <div className="flex w-20 mr-5 justify-center items-center">
                                <span className="text-md font-bold">카테고리</span>
                            </div>
                            <div className="flex-1 m-2">
                                {article.categoryId === "1"
                                    ? (
                                        <span className="rounded-full border border-sky-100 bg-sky-50 px-2 py-0.5 text-sky-400">
                                        {article.categoryName}
                                        </span>
                                    )
                                    : <span className="rounded-full border border-pink-100 bg-pink-50 px-2 py-0.5 text-pink-400">
                                        {article.categoryName}
                                        </span> 
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {/* 내용 */}
                <div className="p-3">
                    <div className="flex px-5 py-3 border-t border-gray-600 border-dotted">
                        <div className="flex w-12 mr-5 pt-5 justify-center items-center">
                            <span className="text-md font-bold">내용</span>
                        </div>
                        <div className="flex-1 m-2 pt-5 overflow-auto">
                            <span className="whitespace-pre-line">{article.description}</span>
                            <br />
                            {file && (
                                <p id="imgP" className="pt-3">
                                    <img src={`http://localhost:3000/${file.fileUrl}`} alt="" className="mt-2" /> 
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* 글쓰기 버튼 */}
            <div className="flex justify-end mt-7">
                {name === article.writer
                    ? (<div className="flex">
                        <div
                        className="px-3 py-2 bg-blue-400 rounded-lg hover:bg-blue-600 hover:cursor-pointer"
                        onClick={() => window.location.href = `/modify/${id}`}>
                            <span className="text-white font-bold">수정</span>
                        </div>
                        <div
                            className="ml-3 px-3 py-2 bg-red-400 rounded-lg hover:bg-red-600 hover:cursor-pointer"
                            onClick={deleteArticles}>
                            <span className="text-white font-bold">삭제</span>
                        </div>
                    </div>)
                    : null
                }
                <div className="ml-3 px-3 py-2 bg-gray-400 rounded-lg hover:bg-gray-600
                hover:cursor-pointer" onClick={() => window.location.href = '/'}>
                    <span className="text-white font-bold">목록</span>
                </div>
            </div>
            {/* 댓글 */}
            <div className="mt-7 rounded-2xl shadow-lg overflow-hidden bg-white">
                {/* 머리줄 */}
                <div className="flex px-8 py-5 bg-gray-600">
                    <div className="w-full">
                        <span className="text-md font-bold text-white">댓글</span>
                        <span className="ml-1 text-md text-white">[</span>
                        <span
                            className="text-lg font-bold text-white"
                            id="commentLengthSpan">{commentLength.length}</span>
                        <span className="text-md text-white">]</span>
                    </div>
                </div>
                {/* 입력 */}
                <div className="px-3 py-7">
                    <div className="flex px-5">
                        <div className="flex w-12 mr-5 justify-center items-center">
                            <span className="text-md font-bold">작성자</span>
                        </div>
                        <div className="flex-1">
                            {name ? (name)
                                : (<input
                                    className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none"
                                    value={parentWriter}
                                    onChange={writerValueChange}
                                />)}
                        </div>
                    </div>
                    <div className="flex px-5 pt-3">
                        <div className="flex w-12 mr-5 justify-center items-center">
                            <span className="text-md font-bold">내용</span>
                        </div>
                        <div className="flex-1">
                            <textarea
                                className="w-full h-36 px-3 py-2 rounded-2xl border border-gray-300 outline-none"
                                value={parentContent}
                                onChange={contentValueChange}>
                            </textarea>
                        </div>
                    </div>
                    <div className="flex justify-center px-5 pt-3">
                        <div
                            className="px-3 py-2 bg-blue-400 rounded-lg hover:bg-blue-600 hover:cursor-pointer"
                            onClick={newParentComment}>
                                <span className="text-white font-bold">등록</span>
                        </div>
                    </div>
                </div>
                {/* 댓글리스트 */}
                <ul className="px-3 pb-7">
                    {parentComments?.map((parentComment) => (
                        <li key={parentComment.id} className="px-5 pt-3">

                        <CommentItem
                            comments={comments}
                            boardId={id}
                            setComments={setComments}
                            name={name}
                            parentComment={parentComment}
                            commentUpdate={commentUpdate}
                            setCommentUpdate={setCommentUpdate}
                        />      

                        </li>
                    ))}
                </ul>    
            </div>
        </div>
    )
}

export default ViewPage;
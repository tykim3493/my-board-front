import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ModifyPage() {

    // url에서 id 파라미터 가져오기
    const { id } = useParams("");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [writer, setWriter] = useState("");
    const [title, setTitle] = useState("");
    const [isNotice, setIsNotice] = useState(false);
    const [content, setContent] = useState("");
    const [file, setFile] = useState([]);
    const [fileDiv, setFileDiv] = useState(false);
    
    // 서버 데이터 렌더링
    useEffect(() => {
        axios.get(`http://localhost:3000/board/${id}`)
        .then((response) => {
            setWriter(response.data.article.writer);
            setTitle(response.data.article.title);
            setSelectedCategory(response.data.article.categoryId);
            setIsNotice(response.data.article.isNotice || "");
            setContent(response.data.article.description);
            setFile(response.data.file);
        })
    }, [id]);

    // 카테고리 서버 데이터
    useEffect(() => {
        axios.get('http://localhost:3000/board/category/load')
        .then((response) => {
            setCategories(response.data);
        })
    }, []);

    // 각 인풋 값 저장
    const categoryOption = (event) => {
        setSelectedCategory(event.target.value);
    }
    const titleValueChange = (event) => {
        setTitle(event.target.value);
    }
    const isNoticeValueChange = (event) => {
        setIsNotice(!isNotice);
    }
    const contentValueChange = (event) => {
        setContent(event.target.value);
    }
    const fileValueChange = (event) => {
        setFile(event.target.files[0]);
    };

    // 파일 삭제 버튼
    const fileDelete = () => {
        axios.delete(`http://localhost:3000/board/filedelete/${id}`)
            .then(() => {
                setFileDiv(true);
            })
    };

    // 등록 버튼
    const updateBtn = () => {
        const updateDate = new Date().toISOString().split('T')[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('formWriter', writer);
        formData.append('formTitle', title);
        formData.append('formDescription', content);
        formData.append('formCategory', selectedCategory);
        formData.append('formNotice', isNotice ? 1 : 0);
        formData.append('formUpdatedate', updateDate);
        axios.put(`http://localhost:3000/board/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then(() => {
            window.location.href = `/view/${id}`
        })
    }
    
    return (  
        <div className="h-screen p-12 bg-gray-100">
            <div className="rounded-2xl shadow-lg overflow-hidden bg-white">
                {/* 머리줄 */}
                <div className="flex px-8 py-5 bg-gray-600">
                    <div className="w-full">
                        <span className="text-md font-bold text-white">수정하기</span>
                    </div>
                </div>
                {/* 정보 */}
                <div className="p-3">
                    <div className="flex px-5 py-3">
                        <div className="flex-1 flex">
                            <div className="flex w-12 mr-5 justify-center items-center">
                                <span className="text-md font-bold">작성자</span>
                            </div>
                            <div className="flex flex-1 m-2 items-center">
                                <span>{writer}</span>
                            </div>
                        </div>
                        <div className="flex-1 flex justify-center">
                            <div className="flex w-20 mr-5 justify-center items-center">
                                <span className="text-md font-bold">카테고리</span>
                            </div>
                            <div className="flex-1 m-2">
                                <select
                                    className="w-full p-3 border border-gray-300 rounded-2xl outline-none"
                                    value={selectedCategory}
                                    onChange={categoryOption}>
                                        {categories
                                            .filter((category) => category.categoryName !== selectedCategory)
                                            .map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.categoryName}
                                                </option>
                                            ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="flex px-5 py-3">
                        <div className="flex-1 flex justify-center">
                            <div className="flex w-12 mr-5 justify-center items-center">
                                <span className="text-md font-bold">제목</span>
                            </div>
                            <div className="flex-1 m-2">
                                <input
                                    className="w-full px-3 py-2 rounded-xl border border-gray-300 outline-none"
                                    value={title}
                                    onChange={titleValueChange} />
                            </div>
                        </div>
                        <div className="flex ml-12 mr-2">
                            <div className="flex mr-5 items-center">
                                <span className="text-md font-bold">공지글</span>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox"
                                    className="w-4 h-4"
                                    value={isNotice}
                                    onChange={isNoticeValueChange} />
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
                        <div className="flex-1 m-2 pt-5">
                            <textarea
                                className="w-full h-40 px-3 py-2 rounded-2xl border border-gray-300 outline-none"
                                value={content}
                                onChange={contentValueChange}>
                            </textarea>
                        </div>
                    </div>
                    <div className="flex-col">
                        <div className="flex px-5 pt-0 pb-3">
                            <div className="flex w-12 mr-5 pt-5 justify-center items-center">
                                <span className="text-md font-bold">파일</span>
                            </div>
                            <div className="flex-1 flex items-center m-2 pt-5">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-[200px]"
                                    onChange={fileValueChange}
                                />
                                <span id="fileName" className="text-md text-gray-400" style={{ display: fileDiv ? 'none' : '' }}>
                                    {file 
                                        ? (typeof file === "string" ? file.fileUrl.split('/').pop() : file.fileUrl) 
                                        : ''}
                                </span>
                                <span
                                    className="ml-2 text-md text-red-400 underline"
                                    onClick={fileDelete}
                                    style={{ display: fileDiv ? 'none' : '' }}
                                >
                                    {file && file.fileUrl ? ("삭제") : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* 글쓰기 버튼 */}
            <div className="flex justify-end mt-7">
                <div
                    className="px-3 py-2 bg-blue-400 rounded-lg hover:bg-blue-600 hover:cursor-pointer"
                    onClick={updateBtn}>
                    <span className="text-white font-bold">등록</span>
                </div>
                <div
                    className="ml-3 px-3 py-2 bg-gray-400 rounded-lg hover:bg-gray-600 hover:cursor-pointer"
                    onClick={() => window.location.href = '/'}>
                    <span className="text-white font-bold">목록</span>
                </div>
            </div>
        </div>
    )
}

export default ModifyPage;

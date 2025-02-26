import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import ArticleItem from "../components/ArticleItem";

function ListPage() {
    const navigate = useNavigate();
    const [name, setName] = useState(null);
    const [adminBtn, setAdminBtn] = useState(false);
    const [adminCol, setAdminCol] = useState(true);
    const [categories, setCategories] = useState([]);
    const [articles, setArticles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState("");
    const [totalArticles, setTotalArticles] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchText, setSearchText] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [placeholder, setPlaceholder] = useState("검색어를 입력하세요.");
    const [isFocused, setIsFocused] = useState(false);
    const [checkedIds, setCheckedIds] = useState([]);
    const [isLogged, setIsLogged] = useState(false);

    // 토큰체크
    useEffect(() => {
        const token = localStorage.getItem('token'); // 저장된 토큰 가져오기
        if (token) {
            axios.get("http://ec2-13-208-240-232.ap-northeast-3.compute.amazonaws.com:3000/members", {
                withCredentials: true, // 쿠키 cors 통신 설정
                headers: { Authorization: `Bearer ${token}` }, // 헤더에 토큰 포함
            })
            .then((res) => {
                setName(res.data.name);
                setIsLogged(true);
            })
        } else {
            setIsLogged(false);
        }
    }, []);

    // 로그아웃
    const logout = () => {
        localStorage.removeItem("token");
        setIsLogged(false);
    };

    // 서버데이터
    useEffect(() => {
        const limit = 7;
        let url = "";
        if (selectedCategory) {
            url = `http://ec2-13-208-240-232.ap-northeast-3.compute.amazonaws.com:3000/board/category?query=${selectedCategory}&page=${currentPage}&limit=${limit}`; // 카테고리
        } else if (searchText) {
            url = `http://ec2-13-208-240-232.ap-northeast-3.compute.amazonaws.com:3000/board/search?query=${searchText}&page=${currentPage}&limit=${limit}`; // 검색
        } else {
            url = `http://ec2-13-208-240-232.ap-northeast-3.compute.amazonaws.com:3000/board?page=${currentPage}&limit=${limit}`; // 일반
        }
        axios.get(url, {withCredentials: true})
            .then((response) => {
                const serverArticles = response.data.data.map((article) => ({ // 게시글
                    ...article,
                    isChecked: false,
                }));
                const totalArticles = response.data.total;
                const totalPages = response.data.totalPages;
                setArticles(serverArticles);
                setTotalArticles(totalArticles);
                setTotalPages(totalPages);
            })
        axios.get('http://localhost:3000/board/category/load') // 카테고리
            .then((response) => {
                setCategories(response.data);
            })
    }, [currentPage, searchText, selectedCategory, isLogged]);

    // 검색창
    const inputValueChange = (event) => {
        setInputValue(event.target.value);
    };
    const searchBtn = () => {
        setSearchText(inputValue);
    };
    const focusHandler = () => {
        setPlaceholder(isFocused ? "검색어를 입력하세요." : "");
        setIsFocused(prevState => !prevState);
    };
        
    // 카테고리 드롭다운 옵션 선택
    const categoryOption = (event) => {
        setSelectedCategory(event.target.value);
    }

    // 게시물 관리 버튼
    const adminBtnHandler = () => {
        setAdminCol(!adminCol);
        setAdminBtn(!adminBtn);
    }
    
    // 게시물 삭제 버튼
    const deleteArticles = () => {
        axios.post('http://localhost:3000/board/select/delete/', {checkedIds})    
            .then(() => {
                const liveTodos = articles.filter((article) => !checkedIds.includes(article.id));
                setArticles(liveTodos);
            })
            .then(() => {
                setCheckedIds([]);
                setAdminCol(true);
                setAdminBtn(false);
            })
    };

    // 게시물 쓰기 버튼
    const writeArticle = () => {
        navigate("/write", { state: { name: name } });
    };
    
    return (        
        <div className="h-screen p-12 bg-gray-100">
            <div className="flex ml-5 mr-5 mb-3">
                <div className="w-20 flex items-center">
                    <span className="text-md text-gray-500">글 수 :</span>
                    <span className="text-md ml-2 text-gray-500" id="articleCnt">{totalArticles}</span>
                </div>
                <div className="w-32 flex items-center">
                    <select
                        className="w-20 p-1 rounded-xl shadow-lg outline-none"
                        onChange={categoryOption}>
                        <option value="">전체</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.categoryName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex-1 flex justify-end items-center">
                    {isLogged
                    ? (
                        <div className="flex items-center">
                            <span className="ml-3 text-md text-gray-500"><b>{name}</b> 님 안녕하세요.</span>
                            <span
                                className="ml-3 rounded-full border border-pink-300 bg-pink-100 px-2 py-0.5 text-pink-400 hover:cursor-pointer"
                                onClick={logout}
                            >
                                로그아웃
                            </span>
                            <span className="ml-3 text-md text-gray-500">내 게시물 관리</span>
                            <input type="checkbox" className="ml-2 w-4 h-4" id="checkAdmin" onChange={adminBtnHandler} checked={adminBtn} />
                        </div>
                    ) : (
                        <span
                            className="ml-3 rounded-full border border-blue-300 bg-blue-100 px-2 py-0.5 text-blue-400 hover:cursor-pointer"
                            onClick={() => window.location.href = '/login'}
                        >
                            로그인
                        </span>
                    )}
                </div>
            </div>
            {/* 게시물 */}
            <div className="rounded-2xl shadow-lg overflow-hidden">
            {/* 머리줄 */}
            <div className="flex p-5 bg-gray-600">
                <div className="w-12 text-center" id="adminDivHeader" hidden={adminCol}>
                <span className="text-md font-bold text-white">관리</span>
                </div>
                <div className="w-12 text-center">
                <span className="text-md font-bold text-white">번호</span>
                </div>
                <div className="w-20 text-center">
                <span className="text-md font-bold text-white">카테고리</span>
                </div>
                <div className="flex-1 text-center">
                <span className="text-md font-bold text-white">제목</span>
                </div>
                <div className="w-24 text-center">
                <span className="text-md font-bold text-white">작성자</span>
                </div>
                <div className="w-32 text-center">
                <span className="text-md font-bold text-white">작성일</span>
                </div>
                <div className="w-32 text-center">
                <span className="text-md font-bold text-white">수정일</span>
                </div>
            </div>
            {/* 게시물 리스트 */}
            <ul id="articleUl">
                {articles.map((article, index) => (
                    <ArticleItem
                        key={index}
                        article={article}
                        adminCol={adminCol}
                        setCheckedIds={setCheckedIds}
                        name={name}
                    />
                ))}   
            </ul>
            </div>
            {/* 글쓰기 버튼 */}
            <div className="flex justify-end mt-7">
                {searchText && (
                    <div
                        className="ml-3 px-3 py-2 bg-gray-400 rounded-lg hover:bg-gray-600 hover:cursor-pointer"
                        onClick={() => window.location.href = '/'}>
                        <span className="text-white font-bold">목록</span>
                    </div>
                )}
                {adminBtn && (
                    <div
                        className="ml-3 px-3 py-2 bg-red-400 rounded-lg hover:bg-red-600 hover:cursor-pointer"
                        onClick={deleteArticles}>
                        <span className="text-white font-bold">삭제</span>
                    </div>
                )}
                <div
                    className="ml-3 px-3 py-2 bg-blue-400 rounded-lg hover:bg-blue-600 hover:cursor-pointer"
                    onClick={writeArticle}>
                    <span className="text-white font-bold">글쓰기</span>
                </div>
            </div>
            {/* 페이지네이션 */}
            <div className="flex justify-center mt-3" id="pagenation">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        className={`px-2 m-1 rounded ${
                            page === currentPage
                            ? "bg-blue-400 text-white"
                            : "text-black"
                        }`}
                        onClick={() => setCurrentPage(page)}
                        >
                        {page}
                    </button>
                ))}
            </div>
            {/* 검색 */}
            <div className="flex justify-center mt-10">
                <div className="w-48">
                    <input
                        className="w-full px-3 py-2 rounded-xl shadow-lg outline-none"
                        id="searchInput"
                        placeholder={placeholder}
                        onChange={inputValueChange}
                        onFocus={focusHandler}
                        onBlur={focusHandler}
                        style={{color: isFocused ? "black" : "gray"}}
                    />
                </div>
                <div
                    className="ml-3 px-3 py-2 bg-gray-400 rounded-lg hover:bg-gray-600 hover:cursor-pointer"
                    id="searchBtn"
                    onClick={searchBtn}    
                >
                    <span className="text-white font-bold">검색</span>
                </div>
            </div>
        </div>
    )
}

export default ListPage;

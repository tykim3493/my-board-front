import React, { useState } from "react";
import axios from 'axios';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const emailInputValueChange = (event) => {
        setEmail(event.target.value);
    };
    const passwordInputValueChange = (event) => {
        setPassword(event.target.value);
    };

    const doLogin = () => {
        axios.post('http://localhost:3000/auth/login', {
            email,
            password
        })
            .then((response) => {
            if (response.data.token) {
                localStorage.setItem("token", response.data.token)
                alert("로그인 되었습니다.");
                window.location.href = '/';
            } else {
                alert("아이디/비밀번호를 확인하세요.");
            }
            
        })
    }
    
    return (  
        <div className="flex w-[full] h-screen p-12 justify-center items-center bg-gray-100">
            <div>
                <div className="w-[400px] rounded-2xl shadow-lg overflow-hidden">
                    <div className="flex p-5 bg-gray-600 text-white font-bold justify-center">
                        <span>
                            Login
                        </span>
                    </div>
                    <form>
                        <div className="flex pt-8 px-5 bg-white">
                            <div className="flex w-20 px-3 justify-center items-center">
                                <span className="font-bold">이메일</span>
                            </div>
                            <div className="flex-1 px-3 justify-center items-center">
                                <input
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    className="w-full px-3 py-2 rounded-xl outline-none border"
                                    value={email}
                                    onChange={emailInputValueChange}
                                />
                            </div>
                        </div>
                        <div className="flex pb-8 p-5 bg-white">
                            <div className="flex w-20 px-3 justify-center items-center">
                                <span className="font-bold">비밀번호</span>
                            </div>
                            <div className="flex-1 px-3 justify-center items-center">
                                <input
                                    type="password"
                                    name="password"
                                    autoComplete="password"
                                    className="w-full px-3 py-2 rounded-xl outline-none border"
                                    value={password}
                                    onChange={passwordInputValueChange}
                                />
                            </div>
                        </div>
                    </form>
                </div>
                <div className="flex w-[400px] p-5">
                    <div className="flex flex-1 items-center">
                        <span
                            className="underline hover:cursor-pointer"
                            onClick={() => window.location.href = '/join'}
                            >
                            회원가입
                        </span>
                    </div>
                    <div className="flex flex-1 justify-end items-center">
                        <div
                            className="ml-3 px-3 py-2 bg-blue-400 rounded-lg hover:bg-blue-600 hover:cursor-pointer"
                            onClick={doLogin}
                        >
                            <span className="text-white font-bold">로그인</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;
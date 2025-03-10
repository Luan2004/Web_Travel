class MyHeader extends HTMLElement {
    connectedCallback() {
        const isHomePage = window.location.pathname.includes("home.html") || window.location.pathname === "/";
        const isLoggedIn = localStorage.getItem("token"); // Kiểm tra đăng nhập

        this.innerHTML = `
            <header id="main-header" class="top-0 left-0 w-full h-14 px-6 flex justify-between items-center transition-all duration-300 z-50 fixed bg-white text-black shadow-md">
                <style>
                    @keyframes shake {
                    0% { transform: rotate(0deg); }
                    25% { transform: rotate(20deg); }
                    50% { transform: rotate(-20deg); }
                    75% { transform: rotate(20deg); }
                    100% { transform: rotate(0deg); }
                }
                /* Lặp hiệu ứng lắc sau mỗi 3 giây */
                .animate-shake {
                    animation: shake 0.4s ease-in-out infinite alternate;
                }
                </style>
                <a href="home.html">
                <img src="img/logo.png" class="h-12 md:h-14 lg:h-24 w-32">
                </a>
                <nav class="flex-1 text-center mt-4">
                    <ul class="inline-flex space-x-6 text-lg font-semibold">
                        <li><a href="home.html" class="hover:underline">Trang chủ</a></li>
                        <li><a href="home.html#hot-tour" class="hover:underline">Tour</a></li>
                        <li><a href="contact.html" class="hover:underline">Liên hệ</a></li>
                    </ul>
                </nav>
                <!-- Tài khoản Dropdown -->
                <div class="relative group mt-4" style="margin-right: 100px;">
                    <button class="flex items-center space-x-2 group-hover:text-blue-500 transition-colors duration-300 ml-12">
                        <span class="inline-flex space-x-6 text-lg font-semibold cursor-pointer">Tài khoản</span>
                    </button>
                    <div class="absolute hidden group-hover:block bg-white text-black shadow-lg rounded-lg w-48 py-2 right+10"> 
                        ${isLoggedIn ? `
                            <a href="account.html" class="block w-full text-center bg-blue-600 text-white py-1 rounded-md font-semibold hover:bg-blue-700 transition duration-300">Tài khoản</a>
                            <a href="#" id="logoutButton" class="block px-4 py-2 text-center hover:bg-gray-200">Đăng xuất</a>
                        ` : `
                            <a href="login.html" class="block w-full text-center bg-blue-600 text-white py-1 rounded-md font-semibold hover:bg-blue-700 transition duration-300">Đăng nhập</a>
                            <a href="register.html" class="block px-4 py-2 text-center hover:bg-gray-200">Đăng ký</a>
                        `}
                        <div class="px-4 py-2 text-center">Tour yêu thích (0)</div>
                    </div>
                </div>
                <!-- Nút Zalo cố định ở góc phải màn hình -->
            <a href="https://id.zalo.me/account?continue=http%3A%2F%2Fzalo%2Eme%2F3142623259433794274"
    target="_blank" 
    class="fixed bottom-5 right-5 bg-white p-2 rounded-full shadow-lg border border-gray-300 hover:shadow-xl transition duration-300 animate-shake">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/120px-Icon_of_Zalo.svg.png" alt="Zalo" class="w-12 h-12">
            </a>

            </header>
        `;

        // Xử lý đăng xuất nếu đã đăng nhập
        if (isLoggedIn) {
            document.getElementById("logoutButton").addEventListener("click", function() {
                localStorage.removeItem("token"); // Xóa token
                window.location.reload(); // Tải lại trang
            });
        }

        // Nếu không phải trang chủ, giữ header luôn cố định
        
            document.getElementById("main-header").classList.add("fixed");
            document.body.style.paddingTop = "50px";
        
    }
}

customElements.define('my-header', MyHeader);

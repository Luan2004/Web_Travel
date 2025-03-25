class MyHeader extends HTMLElement {
    connectedCallback() {
        const isHomePage = window.location.pathname.includes("home.html") || window.location.pathname === "/";
        const isLoggedIn = localStorage.getItem("token"); // Kiểm tra đăng nhập

        this.innerHTML = `
            <header id="main-header" class="md:px-20 top-0 left-0 w-full h-14 px-6 flex justify-between items-center transition-all duration-300 z-50 fixed bg-white text-black shadow-md">
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
                    /* CSS cho modal */
                    .modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.5);
                        display: none; /* Ẩn mặc định */
                        justify-content: center;
                        align-items: center;
                        z-index: 1000;
                    }
                    .modal-overlay.show {
                        display: flex; /* Hiển thị khi có lớp show */
                    }
                    .modal-content {
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        text-align: center;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        width: 300px;
                    }
                    .modal-buttons {
                        margin-top: 20px;
                        display: flex;
                        justify-content: space-around;
                    }
                    .modal-buttons button {
                        padding: 8px 16px;
                        border-radius: 4px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: background-color 0.3s;
                    }
                    .modal-buttons .confirm {
                        background-color: #2563eb;
                        color: white;
                    }
                    .modal-buttons .confirm:hover {
                        background-color: #1d4ed8;
                    }
                    .modal-buttons .cancel {
                        background-color: #e5e7eb;
                        color: #374151;
                    }
                    .modal-buttons .cancel:hover {
                        background-color: #d1d5db;
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
                <!-- Modal xác nhận đăng xuất -->
                <div id="logoutModal" class="modal-overlay">
                    <div class="modal-content">
                        <p class="text-lg font-semibold mb-4">Bạn muốn đăng xuất ư?</p>
                        <div class="modal-buttons">
                            <button class="confirm" id="confirmLogout">Xác nhận</button>
                            <button class="cancel" id="cancelLogout">Không</button>
                        </div>
                    </div>
                </div>
            </header>
        `;

        // Xử lý đăng xuất nếu đã đăng nhập
        if (isLoggedIn) {
            const logoutButton = document.getElementById("logoutButton");
            const logoutModal = document.getElementById("logoutModal");
            const confirmLogout = document.getElementById("confirmLogout");
            const cancelLogout = document.getElementById("cancelLogout");

            // Khi nhấn nút "Đăng xuất", hiển thị modal
            logoutButton.addEventListener("click", function (e) {
                e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ <a>
                logoutModal.classList.add("show"); // Hiển thị modal
            });

            // Khi nhấn "Xác nhận", thực hiện đăng xuất và chuyển hướng về trang chủ
            confirmLogout.addEventListener("click", function () {
                localStorage.removeItem("token"); // Xóa token
                window.location.href = "home.html"; // Chuyển hướng về trang chủ
            });

            // Khi nhấn "Không", chỉ đóng modal
            cancelLogout.addEventListener("click", function () {
                logoutModal.classList.remove("show"); // Ẩn modal
            });
        }

        // Nếu không phải trang chủ, giữ header luôn cố định
        document.getElementById("main-header").classList.add("fixed");
        document.body.style.paddingTop = "50px";
    }
}

customElements.define('my-header', MyHeader);
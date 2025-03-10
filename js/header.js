class MyHeader extends HTMLElement {
    connectedCallback() {
        const isHomePage = window.location.pathname.includes("home.html") || window.location.pathname === "/";

        this.innerHTML = `
            <header id="main-header" class="top-0 left-0 w-full h-14 px-6 flex justify-between items-center transition-all duration-300 z-50
                ${isHomePage ? 'absolute text-white bg-transparent' : 'fixed bg-white text-black shadow-md'}">
                <a href="home.html">
                    <img src="img/logo.png" class="h-14 w-auto">
                </a>
                <nav class="flex-1 text-center mt-4">
                    <ul class="inline-flex space-x-6 text-lg font-semibold">
                        <li><a href="home.html" class="hover:underline">Trang chủ</a></li>
                        <li><a href="home.html#hot-tour" class="hover:underline">Tour</a></li>
                        <li><a href="#" class="hover:underline">Liên hệ</a></li>
                    </ul>
                </nav>
                <!-- Tài khoản Dropdown -->
                <div class="relative group mt-4" style="margin-right: 80px;">
                    <button class="flex items-center space-x-2 group-hover:text-blue-500 transition-colors duration-300 ml-12">
                        <span class="inline-flex space-x-6 text-lg font-semibold cursor-pointer">Tài khoản</span>
                    </button>
                    <div class="absolute hidden group-hover:block bg-white text-black shadow-lg rounded-lg w-48 py-2 right+5"> 
                        <a href="login.html" class="block w-full text-center bg-blue-600 text-white py-1 rounded-md font-semibold hover:bg-blue-700 transition duration-300">Đăng nhập</a>
                        <a href="register.html" class="block px-4 py-2 text-center hover:bg-gray-200">Đăng ký</a>
                        <div class="px-4 py-2 text-center">Tour yêu thích (0)</div>
                    </div>
                </div>
            </header>
        `;

        // Nếu không phải trang chủ, giữ header luôn cố định
        if (!isHomePage) {
            document.getElementById("main-header").classList.add("fixed");
            document.body.style.paddingTop = "50px";
        }

        // Xóa padding-top của body để header không tạo khoảng trống trên trang chủ
        if (isHomePage) {
            document.body.style.paddingTop = "0px";
            console.log("Trang chủ đã load, header đang hiển thị trên nền background");
            window.addEventListener("scroll", function() {
                const header = document.getElementById("main-header");
                if (window.scrollY > 50) {
                    header.classList.add("bg-white", "text-black", "shadow-md", "fixed");
                    header.classList.remove("bg-transparent", "text-white", "absolute");
                } else {
                    header.classList.remove("bg-white", "text-black", "shadow-md", "fixed");
                    header.classList.add("bg-transparent", "text-white", "absolute");
                }
            });
        }
    }
}
customElements.define('my-header', MyHeader);
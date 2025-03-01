class MyHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header class="bg-blue-600 text-white py-4 px-6 flex justify-between items-center">
                <h1 class="text-2xl font-bold">Book Tour Việt Nam</h1>
                <nav>
                    <ul class="flex space-x-6">
                        <li><a href="home.html" class="hover:underline">Trang chủ</a></li>
                        <li><a href="tours.html" class="hover:underline">Tours</a></li>
                        <li><a href="contact.html" class="hover:underline">Liên hệ</a></li>
                    </ul>
                </nav>
                <button onclick="window.location.href='login.html'" class="bg-white text-blue-600 px-4 py-2 rounded-lg border border-blue-600 hover:bg-blue-600 hover:text-white transition">
                    Đăng nhập
                </button>
            </header>
        `;
    }
}
customElements.define('my-header', MyHeader);
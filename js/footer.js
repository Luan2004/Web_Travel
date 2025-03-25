class MyFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <style>
            .footer {
                background-image: url("https://stradaeducation.org/wp-content/uploads/2020/09/Strada-Footer-Background.svg");
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                padding: 40px 0;
                color: white;
            }
            .footer h4 {
                font-size: 1.25rem;
                margin-bottom: 1rem;
                font-weight: bold;
            }
            .footer .social-icons img, .footer .app-links img, .footer .payment-methods img {
                width: 32px;
                margin-right: 10px;
                transition: transform 0.3s ease;
            }
            .footer .payment-methods img {
                width: 260px; /* Tăng kích thước lên 192px */
                height: 140px; /* Tăng chiều cao lên 96px */
                margin-top: -3.5rem; /* Ví dụ: 4px */
                object-fit: contain; /* Giữ tỷ lệ hình ảnh */
            } 
            .footer .app-links img {
                width: 120px; /* Tăng kích thước lên 192px */
                height: 80px; /* Tăng chiều cao lên 96px */
                margin-top: -1rem; /* Ví dụ: 4px */
                object-fit: contain; /* Giữ tỷ lệ hình ảnh */
            } 
            .footer .social-icons img:hover, .footer .app-links img:hover, .footer .payment-methods img:hover {
                transform: scale(1.1);
            }
            .footer .list-menu li a {
                display: block;
                padding: 8px 0;
                color: white;
                text-decoration: none;
                transition: color 0.3s ease;
            }
            .footer .list-menu li a:hover {
                color: #ff7f50;
            }
            .footer .grid {
                display: grid;
                grid-template-columns: repeat(1, 1fr);
                gap: 30px;
            }
              
            @media (min-width: 768px) {
                .footer .grid {
                    grid-template-columns: repeat(4, 1fr);
                }
            }
            .footer .container {
                margin-left: 40px; /* Lệch sang phải như yêu cầu trước */
            }
            .footer .payment-methods {
                display: flex;
                flex-wrap: wrap;
                gap: 8px; /* Khoảng cách giữa các hình ảnh */
            }
            .copyright {
                text-align: center;
                margin-top: 20px;
            }
        </style>
        <footer class="footer md:px-40">
            <div class="container">
                <div class="grid">
                    <div class="col-footer">
                        <h4>THÔNG TIN LIÊN HỆ</h4>
                        <p><strong>CÔNG TY CỔ PHẦN DU LỊCH CHÀO NGÀY MỚI</strong></p>
                        <p>Địa chỉ: Khu TM, 209 Đ. 30 Tháng 4, Xuân Khánh, Ninh Kiều, Cần Thơ</p>
                        <p><a href="tel:0902288296">Hỗ trợ: 0902288296</a></p>
                        <p>Giấy phép kinh doanh lữ hành số: 56-303/2024/TCDL-GP LHQT</p>
                    </div>
                    <div class="col-footer">
                        <h4>CHĂM SÓC KHÁCH HÀNG</h4>
                        <p>Thời gian hỗ trợ: 8H - 22H Hàng ngày</p>
                        <p><a href="tel:02586505986">Hotline: 0258 650 5986</a></p>
                    </div>
                    <div class="col-footer">
                        <h4>CHÍNH SÁCH</h4>
                        <ul class="list-menu">
                            <li><a href="/phuong-thuc-thanh-toan">Phương thức thanh toán</a></li>
                            <li><a href="/chinh-sach-bao-mat-thong-tin">Chính sách bảo mật thông tin</a></li>
                            <li><a href="/huong-dan-dat-tour">Hướng dẫn đặt tour</a></li>
                            <li><a href="/chinh-sach-thay-doi-va-hoan-huy">Chính sách thay đổi và hoàn hủy</a></li>
                            <li><a href="https://goodmorningtravel.vn/gioi-thieu">Giới thiệu về Goodmorning Travel</a></li>
                            <li><a href="https://goodmorningtravel.vn/apps/affiliate-v2">Đăng ký đối tác Affiliate</a></li>
                            <li><a href="/dieu-khoan-va-dieu-kien">Điều khoản và điều kiện</a></li>
                        </ul>
                    </div>
                    <div class="col-footer">
                        <h4>KẾT NỐI</h4>
                        <div class="social-icons">
                            <a href="https://twitter.com/DuLichNhaTrang"><img src="https://x.com/DuLichNhaTrang" alt="Twitter"></a>
                            <img src="facebook-icon.png" alt="Facebook">
                        </div>
                        <h4>TẢI ỨNG DỤNG</h4>
                        <div class="app-links flex flex-row space-x-4">
                            <a href="https://play.google.com/store/apps/details?id=com.traveloka.android&hl=vi" target="_blank">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1280px-Google_Play_Store_badge_EN.svg.png" alt="Google Play" class="h-10">
                            </a>
                            <a href="https://www.apple.com/vn/app-store/" target="_blank">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/1280px-Download_on_the_App_Store_Badge.svg.png" alt="App Store">
                            </a>
                        </div>
                        <h4 class="payment-title"> PHƯƠNG THỨC THANH TOÁN</h4>
                        <div class="payment-methods">
                            <img src="https://bizweb.dktcdn.net/100/342/038/themes/938346/assets/payment.png?1736742206107" alt="Phương thức thanh toán">
                        </div>
                    </div>
                </div>
                <div class="copyright">
                    © Bản quyền thuộc về CÔNG TY CỔ PHẦN DU LỊCH CHÀO NGÀY MỚI
                </div>
            </div>
        </footer>`;
    }
}
customElements.define('my-footer', MyFooter);
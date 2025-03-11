class MyFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer class="md:px-40 footer lazyload_bg loaded" data-src="//bizweb.dktcdn.net/100/342/038/themes/938346/assets/bg_footer.png?1736742206107" style="background-image: url(&quot;//bizweb.dktcdn.net/100/342/038/themes/938346/assets/bg_footer.png?1736742206107&quot;);">
                <div class="container px-6" bis_skin_checked="1">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="col-12 col-md-6 col-lg-3 col-footer col-info" bis_skin_checked="1">
                            <h4 class="text-xl font-bold mt-4">THÔNG TIN LIÊN HỆ</h4>
                            <div class="hidden-mobile" bis_skin_checked="1">
                                <span class="d-block mb-1">Tên công ty</span>
                                <p>CÔNG TY CỔ PHẦN DU LỊCH CHÀO NGÀY MỚI</p>
                                <span class="d-block mb-1">Địa chỉ</span>
                                <p> Khu TM, 209 Đ. 30 Tháng 4, Xuân Khánh, Ninh Kiều, Cần Thơ<br>
                                    <a href="tel:0902288296" class="d-block" title="0902288296">Hỗ trợ: 0902288296</a>
                                </p>
                                <span class="d-block mb-1">Giấy phép kinh doanh lữ hành số:</span>
                                <p>56-303/2024/TCDL-GP LHQT</p>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 col-lg-3 col-footer col-info">
                            <h4 class="text-xl font-bold mt-4">CHĂM SÓC KHÁCH HÀNG</h4>
                            <div class="hidden-mobile" bis_skin_checked="1">
                                <span class="d-block mb-1">Thời gian hỗ trợ</span>
                                <p>8H - 22H Hàng ngày</p>
                                <span class="d-block mb-1">Hotline</span>
                                <p><a href="tel:02586505986" title="0258 650 5986">0258 650 5986</a></p>
                            </div>
                        </div>
                        <div class="col-12 col-md-6 col-lg-3 col-footer col-menu">
                            <h4 class="text-xl font-bold mt-4">CHÍNH SÁCH</h4>
                            <ul class="list-menu hidden-mobile list-unstyled">
                                <li><a href="/phuong-thuc-thanh-toan" title="Phương thức thanh toán" class="d-block py-2">Phương thức thanh toán</a></li>
                                <li><a href="/chinh-sach-bao-mat-thong-tin" title="Chính sách bảo mật thông tin" class="d-block py-2">Chính sách bảo mật thông tin</a></li>
                                <li><a href="/huong-dan-dat-tour" title="Hướng dẫn đặt tour" class="d-block py-2">Hướng dẫn đặt tour</a></li>
                                <li><a href="/chinh-sach-thay-doi-va-hoan-huy" title="Chính sách thay đổi và hoàn hủy" class="d-block py-2">Chính sách thay đổi và hoàn hủy</a></li>
                                <li><a href="https://goodmorningtravel.vn/gioi-thieu" title="Giới thiệu về Goodmorning Travel" class="d-block py-2">Giới thiệu về Goodmorning Travel</a></li>
                                <li><a href="https://goodmorningtravel.vn/apps/affiliate-v2" title="Đăng ký đối tác Affiliate" class="d-block py-2">Đăng ký đối tác Affiliate</a></li>
                                <li><a href="/dieu-khoan-va-dieu-kien" title="Điều khoản và điều kiện" class="d-block py-2">Điều khoản và điều kiện</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="copyright d-md-flex align-items-center py-3" bis_skin_checked="1">
                        © Bản quyền thuộc về CÔNG TY CỔ PHẦN DU LỊCH CHÀO NGÀY MỚI
                    </div>
                </div>
            </footer>`;
    }
}
customElements.define('my-footer', MyFooter);
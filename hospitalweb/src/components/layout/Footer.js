import { Container, Row, Col } from "react-bootstrap";
import { Facebook, Youtube, Twitter } from "react-bootstrap-icons";

const Footer = () => {
    return (
        <footer className="bg-primary text-white mt-5">
            <Container className="py-4">
                <h5 className="fw-bold mb-4 text-center">HỆ THỐNG BỆNH VIỆN ĐA KHOA</h5>
                <Row>
                    <Col md={3} sm={6} className="mb-3">
                        <h6 className="bg-info text-white px-2 py-1 d-inline-block rounded">
                            BVĐK Hà Nội
                        </h6>
                        <p className="mb-1">📍 108 Phố Hoàng Như Tiếp, Long Biên, Hà Nội</p>
                        <p className="mb-1">📞 024 7106 6858</p>
                        <p className="mb-1">✉️ cskh@hospital.vn</p>
                    </Col>

                    <Col md={3} sm={6} className="mb-3">
                        <h6 className="bg-info text-white px-2 py-1 d-inline-block rounded">
                            BVĐK TP.HCM
                        </h6>
                        <p className="mb-1">📍 2B Phổ Quang, Tân Bình, TP.HCM</p>
                        <p className="mb-1">📞 0287 102 6789</p>
                        <p className="mb-1">✉️ cskh@hospital.vn</p>
                    </Col>

                    <Col md={3} sm={6} className="mb-3">
                        <h6 className="bg-info text-white px-2 py-1 d-inline-block rounded">
                            Phòng khám Q.7
                        </h6>
                        <p className="mb-1">📍 Sunrise City, Q.7, TP.HCM</p>
                        <p className="mb-1">📞 0287 102 6789</p>
                        <p className="mb-1">✉️ cskh@hospital.vn</p>
                    </Col>

                    <Col md={3} sm={6} className="mb-3">
                        <h6 className="bg-info text-white px-2 py-1 d-inline-block rounded">
                            BVĐK Q.8
                        </h6>
                        <p className="mb-1">📍 316C Phạm Hùng, Q.8, TP.HCM</p>
                        <p className="mb-1">📞 0287 102 6789</p>
                        <p className="mb-1">✉️ cskh@hospital.vn</p>
                    </Col>
                </Row>
            </Container>

            {/* copyright */}
            <div className="bg-dark text-center py-3">
                <p className="mb-2">
                    Copyright © 2025 General Hospital. All Rights Reserved.
                </p>
                <div className="d-flex justify-content-center gap-3">
                    <a href="https://facebook.com" className="text-white fs-4">
                        <Facebook />
                    </a>
                    <a href="https://youtube.com" className="text-white fs-4">
                        <Youtube />
                    </a>
                    <a href="https://twitter.com" className="text-white fs-4">
                        <Twitter />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;


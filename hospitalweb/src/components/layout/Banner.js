import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import Apis, { endpoints } from "../../configs/Apis";
import "../../css/Banner.css";

const Banner = () => {
    const [specialties, setSpecialties] = useState([]);

    useEffect(() => {
        const loadSpecialties = async () => {
            try {
                const res = await Apis.get(endpoints.specialties);
                setSpecialties(res.data || []);
            } catch (err) {
                console.error("Error loading specialties:", err);
            }
        };
        loadSpecialties();
    }, []);

    return (
        <div className="container my-4">
            {/* Banner lớn phía trên */}
            <div className="mb-4 banner-top">
                <img
                    src="https://tamanhhospital.vn/wp-content/uploads/2025/07/banner-bhyt.jpg"
                    alt="Banner BHYT"
                    className="img-fluid w-100"
                    style={{ maxHeight: "400px", objectFit: "cover", borderRadius: "8px" }}
                />
            </div>

            {/* Tiêu đề */}
            <div className="text-center mb-4">
                <h3 className="fw-bold text-primary">DANH SÁCH CHUYÊN KHOA</h3>
                <hr className="w-25 mx-auto" />
            </div>

            {/* Grid chuyên khoa */}
            <Row>
                {specialties.map((s) => (
                    <Col key={s.id} md={3} sm={6} className="mb-4">
                        <Card className="specialty-card shadow-sm h-100 text-center">
                            <Card.Img
                                variant="top"
                                src={s.image}
                                alt={s.name}
                                className="specialty-icon mx-auto mt-3"
                            />
                            <Card.Body>
                                <Card.Title className="fw-bold">{s.name}</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default Banner;


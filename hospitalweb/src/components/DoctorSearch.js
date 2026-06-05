import { useEffect, useState } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import Apis, { endpoints } from "../configs/Apis";
import { Link } from "react-router-dom";

const DoctorSearch = () => {
    const [name, setName] = useState("");
    const [specialtyId, setSpecialtyId] = useState("");
    const [hospitalId, setHospitalId] = useState("");
    const [doctors, setDoctors] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [specialties, setSpecialties] = useState([]);


    useEffect(() => {
        const loadDoctors = async () => {
            try {
                let res = await Apis.get(endpoints.doctors);
                setDoctors(res.data || []);
            } catch (err) {
                console.error("Error loading doctors:", err);
            }
        };
        loadDoctors();
    }, []);


    useEffect(() => {
        const loadHospitals = async () => {
            try {
                let res = await Apis.get(endpoints.hospitals);
                setHospitals(res.data || []);
            } catch (err) {
                console.error("Error loading hospitals:", err);
            }
        };
        loadHospitals();
    }, []);


    useEffect(() => {
        const loadSpecialties = async () => {
            try {
                let res = await Apis.get(endpoints.specialties);
                setSpecialties(res.data || []);
            } catch (err) {
                console.error("Error loading specialties:", err);
            }
        };
        loadSpecialties();
    }, []);

    // tìm kiếm bác sĩ
    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            let res = await Apis.get(endpoints.doctorsSearch, {
                params: { name, specialtyId, hospitalId },
            });
            setDoctors(res.data || []);
        } catch (err) {
            console.error("Error searching doctors:", err);
        }
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-3 text-primary fw-bold">Tìm kiếm bác sĩ</h3>

            {/* Form tìm kiếm */}
            <Form onSubmit={handleSearch} className="mb-4">
                <Row>
                    {/* Ô nhập tên bác sĩ */}
                    <Col md={4}>
                        <Form.Control
                            type="text"
                            placeholder="Tên bác sĩ..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Col>

                    {/* Dropdown chọn chuyên khoa */}
                    <Col md={3}>
                        <Form.Select
                            value={specialtyId}
                            onChange={(e) => setSpecialtyId(e.target.value)}
                        >
                            <option value="">-- Chọn chuyên khoa --</option>
                            {specialties.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>

                    {/* Dropdown chọn bệnh viện */}
                    <Col md={3}>
                        <Form.Select
                            value={hospitalId}
                            onChange={(e) => setHospitalId(e.target.value)}
                        >
                            <option value="">-- Chọn bệnh viện --</option>
                            {hospitals.map((h) => (
                                <option key={h.id} value={h.id}>
                                    {h.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Col>

                    <Col md={2}>
                        <Button type="submit" variant="primary" className="w-100">
                            Tìm kiếm
                        </Button>
                    </Col>
                </Row>
            </Form>

            {/* Danh sách bác sĩ */}
            <Row>
                {doctors.map((d) => (
                    <Col md={12} key={d.id} className="mb-3">
                        <Card className="shadow-sm p-3 doctor-card">
                            <Row>
                                {/* Ảnh bác sĩ */}
                                <Col md={3} className="text-center">
                                    <img
                                        src={d.image}
                                        alt={d.name}
                                        className="rounded-circle"
                                        style={{ width: "120px", height: "120px", objectFit: "cover" }}
                                    />
                                </Col>

                                {/* Thông tin bác sĩ */}
                                <Col md={9}>
                                    <h5 className="fw-bold text-primary">{d.name}</h5>
                                    <p className="mb-1 text-muted">{d.hospital?.name}</p>
                                    <p className="mb-2">{d.description}</p>
                                    <div className="d-flex gap-2">
                                        <Link to={`/doctors/${d.id}`} className="btn btn-outline-primary">
                                            XEM CHI TIẾT
                                        </Link>
                                        <Link to={`/DoctorCalendar/${d.id}`} className="btn btn-outline-primary">
                                            XEM LỊCH BÁC SĨ
                                        </Link>
                                    </div>


                                </Col>
                            </Row>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default DoctorSearch;




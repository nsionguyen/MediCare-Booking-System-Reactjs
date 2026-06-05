import { useContext, useEffect, useState } from "react";
import { Container, Form, Button, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import Apis, { authApis, endpoints } from "../configs/Apis";
import 'bootstrap/dist/css/bootstrap.min.css';

import { MyUserContext } from "../configs/MyContexts";

const Booking = () => {

    const [hospitals, setHospitals] = useState([]);
    const [specialties, setSpecialties] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [user, dispatch] = useContext(MyUserContext);

    const [selectedHospital, setSelectedHospital] = useState("");
    const [selectedSpecialty, setSelectedSpecialty] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedPatient, setSelectedPatient] = useState("");
    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");
    const [patientName, setPatientName] = useState("");
    const [symptoms, setSymptoms] = useState("");


    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);


    useEffect(() => {
        Apis.get(endpoints.hospitals)
            .then((res) => setHospitals(res.data || []))
            .catch((err) => console.error("Error loading hospitals:", err));

        Apis.get(endpoints.specialties)
            .then((res) => setSpecialties(res.data || []))
            .catch((err) => console.error("Error loading specialties:", err));

        authApis().get(endpoints["patients-booking"](user.id))
            .then((res) => setPatients(res.data || []))
            .catch((err) => console.error("Error loading patients:", err));
    }, []);


    useEffect(() => {
        if (selectedHospital && selectedSpecialty) {
            setLoadingDoctors(true); //  loading
            setSubmitStatus(null);
            Apis.get(endpoints["doctors-booking"], {
                params: {
                    hospitalId: selectedHospital,
                    specialtyId: selectedSpecialty,
                },
            })
                .then((res) => setDoctors(res.data || []))
                .catch((err) => console.error("Error loading doctors:", err))
                .finally(() => setLoadingDoctors(false)); // Dừng loading
        } else {
            setDoctors([]);
            setSelectedDoctor("");
        }
        console.log(user);
    }, [selectedHospital, selectedSpecialty]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus(null);

        const appointmentDateTime = `${appointmentDate}T${appointmentTime}`;
        const payload = {
            bookBy: user.id,
            specialty: selectedSpecialty,
            doctor: selectedDoctor,
            patient: selectedPatient,
            appointment_date: appointmentDateTime,
            symptoms: symptoms,

        };

        try {
            const res = await Apis.post(endpoints["appointmentSchedules"], payload);
            console.log(res.data);
            setSubmitStatus({ type: 'success', message: '✅ Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm.' });

            // Reset form
            setSelectedHospital("");
            setSelectedSpecialty("");
            setSelectedDoctor("");
            setSelectedPatient("");
            setAppointmentDate("");
            setAppointmentTime("");
            setPatientName("");
            setSymptoms("");
        } catch (error) {
            console.error("Booking failed:", error);
            setSubmitStatus({ type: 'danger', message: '❌ Đã có lỗi xảy ra. Vui lòng thử lại.' });
        }
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={8} lg={7}>
                    <Card className="shadow-sm">
                        <Card.Body className="p-4">
                            <h2 className="text-center mb-4 text-primary">Đặt Lịch Khám Bệnh 🗓️</h2>
                            <Form onSubmit={handleSubmit}>
                                {submitStatus && (
                                    <Alert variant={submitStatus.type}>{submitStatus.message}</Alert>
                                )}

                                <Row className="mb-3">
                                    <Form.Group as={Col} md="6" controlId="formHospital">
                                        <Form.Label>Chọn nơi khám</Form.Label>
                                        <Form.Select value={selectedHospital} onChange={(e) => setSelectedHospital(e.target.value)} required>
                                            <option value="">--- Chọn bệnh viện ---</option>
                                            {hospitals.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group as={Col} md="6" controlId="formSpecialty">
                                        <Form.Label>Chọn chuyên khoa</Form.Label>
                                        <Form.Select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)} required>
                                            <option value="">--- Chọn chuyên khoa ---</option>
                                            {specialties.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </Form.Select>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} md="6" controlId="formDoctor">
                                        <Form.Label>
                                            Chọn bác sĩ
                                            {loadingDoctors && <Spinner animation="border" size="sm" className="ms-2" />}
                                        </Form.Label>
                                        <Form.Select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)} required disabled={!selectedHospital || !selectedSpecialty || loadingDoctors}>
                                            <option value="">--- Chọn bác sĩ ---</option>
                                            {doctors.map((d) => <option key={d.id} value={d.id}>{d.name || "Bác sĩ"}</option>)}
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group as={Col} md="6" controlId="formPatient">
                                        <Form.Label>Chọn bệnh nhân</Form.Label>
                                        <Form.Select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} required>
                                            <option value="">--- Chọn bệnh nhân ---</option>
                                            {patients.map((p) => <option key={p.id} value={p.id}>{p.name || p.fullName || `Bệnh nhân #${p.id}`}</option>)}
                                        </Form.Select>
                                    </Form.Group>
                                </Row>

                                <Row className="mb-3">
                                    <Form.Group as={Col} md="6" controlId="formDate">
                                        <Form.Label>Chọn ngày khám</Form.Label>
                                        <Form.Control type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} min={today} required disabled={!selectedDoctor} />
                                    </Form.Group>

                                    <Form.Group as={Col} md="6" controlId="formTime">
                                        <Form.Label>Chọn giờ khám</Form.Label>
                                        <Form.Control type="time" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} required disabled={!appointmentDate} />
                                    </Form.Group>
                                </Row>

                                <Form.Group className="mb-3" controlId="formSymptoms">
                                    <Form.Label>Triệu chứng hoặc ghi chú</Form.Label>
                                    <Form.Control as="textarea" rows={3} placeholder="Mô tả ngắn gọn tình trạng của bạn..." value={symptoms} onChange={(e) => setSymptoms(e.target.value)} />
                                </Form.Group>



                                <div className="d-grid">
                                    <Button variant="primary" size="lg" type="submit">
                                        Xác Nhận Đặt Lịch
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Booking;
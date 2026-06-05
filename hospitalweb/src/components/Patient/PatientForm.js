import { useContext, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { UserPlus, User, Phone, Mail } from "lucide-react";
import { authApis, endpoints } from "../../configs/Apis";
import { MyUserContext } from "../../configs/MyContexts";

const PatientForm = () => {
    const [user] = useContext(MyUserContext);
    const [patient, setPatient] = useState({});
    const [msg, setMsg] = useState();
    const [loading, setLoading] = useState(false);

    const info = [
        { title: "Tên", field: "name", type: "text", icon: <User size={16} /> },
        { title: "Tuổi", field: "age", type: "number", icon: <User size={16} /> },
        { title: "Số điện thoại", field: "phone", type: "tel", icon: <Phone size={16} /> },
        { title: "Email", field: "email", type: "email", icon: <Mail size={16} /> },
        { title: "Quê quán", field: "homeTown", type: "text", icon: <User size={16} /> },
        { title: "Giới tính", field: "gender", type: "text", icon: <User size={16} /> },
    ];

    const submit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);



            const payload = {
                ...patient,
                age: parseInt(patient.age),
                userId: user.id,
            };


            let res = await authApis().post(endpoints["patients"], payload);


            if (res.status === 201) {
                setMsg("Tạo bệnh nhân thành công!");
                setPatient({});
            }
        } catch (ex) {
            console.error(ex);
            setMsg("Có lỗi xảy ra!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-light min-vh-100 py-5">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="shadow-lg border-0">
                            <Card.Header className="bg-success text-white text-center py-4">
                                <div className="d-flex align-items-center justify-content-center mb-2">
                                    <UserPlus size={32} className="me-2" />
                                    <h3 className="mb-0 fw-bold">TẠO BỆNH NHÂN</h3>
                                </div>
                            </Card.Header>
                            <Card.Body className="p-4">
                                {msg && <Alert variant="info">{msg}</Alert>}
                                <Form onSubmit={submit}>
                                    {info.map((i) => (
                                        <Form.Group key={i.field} className="mb-3">
                                            <Form.Label className="fw-medium d-flex align-items-center">
                                                {i.icon}
                                                <span className="ms-2">{i.title}</span>
                                            </Form.Label>
                                            <Form.Control
                                                type={i.type}
                                                value={patient[i.field] || ""}
                                                onChange={(e) =>
                                                    setPatient({
                                                        ...patient,
                                                        [i.field]: e.target.value,
                                                    })
                                                }
                                                placeholder={`Nhập ${i.title.toLowerCase()}`}
                                                className="py-2"
                                            />
                                        </Form.Group>
                                    ))}

                                    <div className="d-grid">
                                        <Button type="submit" variant="success" disabled={loading}>
                                            {loading ? "Đang xử lý..." : "Tạo bệnh nhân"}
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default PatientForm;

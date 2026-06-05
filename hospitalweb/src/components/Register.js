import { Lock, Mail, Phone, User, User2, UserCircle, UserPlus } from "lucide-react";
import { useRef, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Apis, { endpoints } from "../configs/Apis";

const Register = () => {
    const info = [
        {
            title: "Tên",
            field: "firstName",
            type: "text",
            icon: <User size={16} />,
        },
        {
            title: "Họ và tên lót",
            field: "lastName",
            type: "text",
            icon: <User2 size={16} />,
        },
        {
            title: "Số điện thoại",
            field: "phone",
            type: "tel",
            icon: <Phone size={16} />,
        },
        {
            title: "Email",
            field: "email",
            type: "email",
            icon: <Mail size={16} />,
        },
        {
            title: "Tên đăng nhập",
            field: "username",
            type: "text",
            icon: <UserCircle size={16} />,
        },
        {
            title: "Mật khẩu",
            field: "password",
            type: "password",
            icon: <Lock size={16} />,
        },
        {
            title: "Xác nhận mật khẩu",
            field: "confirm",
            type: "password",
            icon: <Lock size={16} />,
        },
    ];

    const avatar = useRef();
    const [user, setUser] = useState({});
    const [msg, setMsg] = useState();
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    const validate = () => {
        if (
            !user.confirm ||
            !user.password ||
            user.confirm !== user.password
        ) {
            setMsg("Mật khẩu KHÔNG khớp!");
            return false;
        }
        setMsg("");
        return true;
    };

    const register = async (event) => {
        event.preventDefault();
        if (validate()) {
            try {
                setLoading(true);
                let formData = new FormData();
                for (let key in user) {
                    if (key !== "confirm") formData.append(key, user[key]);
                }
                if (avatar.current.files.length > 0) {
                    formData.append("avatar", avatar.current.files[0]);
                }

                let res = await Apis.post(endpoints["register"], formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (res.status === 201) {
                    nav("/login");
                }

                setTimeout(() => {
                    nav("/login");
                }, 1000);
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="bg-light min-vh-100 py-5">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="shadow-lg border-0">
                            <Card.Header className="bg-primary text-white text-center py-4">
                                <div className="d-flex align-items-center justify-content-center mb-2">
                                    <UserPlus size={32} className="me-2" />
                                    <h3 className="mb-0 fw-bold">ĐĂNG KÝ</h3>
                                </div>
                                <p className="mb-0 opacity-75">
                                    Tạo tài khoản
                                </p>
                            </Card.Header>

                            <Card.Body className="p-4">
                                {msg && (
                                    <Alert variant="danger" className="mb-4">
                                        {msg}
                                    </Alert>
                                )}

                                <Form onSubmit={register}>
                                    {info.map((i) => (
                                        <Form.Group
                                            controlId={i.field}
                                            className="mb-3"
                                            key={i.field}
                                        >
                                            <Form.Label className="fw-medium d-flex align-items-center">
                                                {i.icon}
                                                <span className="ms-2">{i.title}</span>
                                            </Form.Label>
                                            <Form.Control
                                                required
                                                value={user[i.field] || ""}
                                                onChange={(e) =>
                                                    setUser({
                                                        ...user,
                                                        [i.field]: e.target.value,
                                                    })
                                                }
                                                type={i.type}
                                                placeholder={`Nhập ${i.title.toLowerCase()}`}
                                                className="py-2"
                                            />
                                        </Form.Group>
                                    ))}

                                    <Form.Group className="mb-4" controlId="avatar">
                                        <Form.Label className="fw-medium d-flex align-items-center">
                                            <User size={16} />
                                            <span className="ms-2">Ảnh đại diện</span>
                                        </Form.Label>
                                        <Form.Control
                                            type="file"
                                            ref={avatar}
                                            accept="image/*"
                                            className="py-2"
                                        />
                                    </Form.Group>

                                    <div className="d-grid gap-2">
                                        {loading ? (
                                            <Button variant="primary" disabled>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                                Đang xử lý...
                                            </Button>
                                        ) : (
                                            <Button
                                                type="submit"
                                                variant="primary"
                                                size="lg"
                                                className="py-3"
                                            >
                                                <UserPlus size={20} className="me-2" />
                                                Đăng ký
                                            </Button>
                                        )}
                                    </div>
                                </Form>

                                <hr className="my-4" />

                                <div className="text-center">
                                    <span className="text-muted">Đã có tài khoản? </span>
                                    <Link
                                        to="/login"
                                        className="text-decoration-none fw-medium"
                                    >
                                        Đăng nhập ngay
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Register;

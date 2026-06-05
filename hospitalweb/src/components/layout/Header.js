import { useContext } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { MyUserContext } from "../../configs/MyContexts";

const Header = () => {
    const [user, dispatch] = useContext(MyUserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch({ type: "logout" });
        navigate("/");
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand as={Link} to="/">Hospital Website</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link className="nav-link" to="/">Trang chủ</Link>
                        <Link className="nav-link" to="/doctor">Bác sĩ</Link>

                        {/* Chỉ hiển thị khi đã đăng nhập */}
                        {user && (
                            <>
                                <Link className="nav-link" to="/booking">Đặt lịch</Link>
                                <Link className="nav-link" to="/PatientForm">Tạo thông tin</Link>
                                <Link className="nav-link" to="/PatientsTable">Danh sách bệnh nhân</Link>
                                <Link className="nav-link" to="/AppointmentsTable">Danh sách cuộc hẹn</Link>
                                <Link className="nav-link" to="/Payment">Thanh toan</Link>

                                <Link className="nav-link" to="/ListChat">List Chat</Link>

                            </>
                        )}
                    </Nav>

                    <Nav>
                        {user ? (
                            <>
                                <span className="nav-link text-success">Chào {user.username}</span>
                                <Button variant="danger" onClick={handleLogout}>Đăng xuất</Button>
                            </>
                        ) : (
                            <>
                                <Link className="nav-link text-success" to="/register">Đăng ký</Link>
                                <Link className="nav-link text-danger" to="/login">Đăng nhập</Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;


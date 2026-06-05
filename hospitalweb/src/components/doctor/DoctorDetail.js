import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import Apis, { endpoints } from "../../configs/Apis";
import { useNavigate } from "react-router-dom";
import { BsChatDotsFill } from "react-icons/bs";
const DoctorDetail = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate();


    const handleChat = () => {
        navigate(`/chat/${doctor.user?.id}`);
    };


    useEffect(() => {
        const loadDoctor = async () => {
            try {
                let res = await Apis.get(`${endpoints.doctors}/${id}`);
                setDoctor(res.data);
            } catch (err) {
                console.error("Error loading doctor:", err);
            }
        };

        const loadReviews = async () => {
            try {
                let res = await Apis.get(`${endpoints.doctors}/${id}/reviews`);
                setReviews(res.data || []);
            } catch (err) {
                console.error("Error loading reviews:", err);
            }
        };

        loadDoctor();
        loadReviews();
    }, [id]);

    if (!doctor) return <p className="text-center mt-4">Đang tải dữ liệu...</p>;

    return (
        <div className="container mt-4">
            <Card className="p-3 shadow-sm">
                <div className="row">
                    {/* Ảnh bác sĩ */}
                    <div className="col-md-4 text-center">
                        <img
                            src={doctor.image}
                            alt={doctor.name}
                            className="img-fluid rounded"
                            style={{ maxHeight: "300px", objectFit: "cover" }}
                        />
                    </div>

                    {/* Thông tin */}
                    <div className="col-md-8">
                        <h3 className="fw-bold text-primary">{doctor.name}</h3>
                        <span className="badge bg-secondary me-2">PGS.TS</span>
                        <h5 className="mt-2">
                            <img
                                src={doctor.specialty?.image}
                                alt="specialty"
                                style={{ width: "40px", marginRight: "8px" }}
                            />
                            {doctor.specialty?.name}
                        </h5>
                        <p className="text-muted">🏥 {doctor.hospital?.name}</p>
                        <p>{doctor.description}</p>

                    </div>
                    <Button
                        variant="primary"
                        onClick={handleChat}
                        className="d-flex align-items-center gap-2"
                    >
                        <BsChatDotsFill />
                        Chat
                    </Button>
                </div>
            </Card>

            <div className="mt-4">
                <h5>Đánh giá từ bệnh nhân</h5>
                {reviews.length === 0 ? (
                    <p>Chưa có bình luận nào.</p>
                ) : (
                    reviews.map((r, idx) => (
                        <Card key={idx} className="mb-2 p-2">
                            <p>{r.content}</p>
                            <small className="text-muted">
                                Bình luận {r.daysAgo} ngày trước bởi {r.user?.name}
                            </small>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default DoctorDetail;


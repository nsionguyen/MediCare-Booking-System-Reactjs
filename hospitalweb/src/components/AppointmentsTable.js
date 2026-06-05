import React, { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form } from "react-bootstrap";
import { MyUserContext } from "../configs/MyContexts";
import { authApis, endpoints } from "../configs/Apis";

function canCancelByCreated(createdDateISO) {
    const hoursSinceCreated = dayjs().diff(dayjs(createdDateISO), "hour");
    return hoursSinceCreated <= 24;
}

const AppointmentsTable = () => {
    const [user] = useContext(MyUserContext);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    // state cho đổi lịch
    const [showResModal, setShowResModal] = useState(false);
    const [selectedAppt, setSelectedAppt] = useState(null);
    const [newDate, setNewDate] = useState("");
    const [savingRes, setSavingRes] = useState(false);

    useEffect(() => {
        if (!user?.id) return;
        const fetch = async () => {
            try {
                setLoading(true);
                const res = await authApis().get(
                    endpoints.appointmentSchedulesUser(user.id)
                );
                setRows(res.data || []);
            } catch (e) {
                console.error("Fetch failed:", e?.response?.status, e?.message, e?.response?.data);
                setErr(e?.response?.data || e?.message || "Không tải được dữ liệu");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [user?.id]);

    const handleCancel = async (id, createdDate) => {
        if (!canCancelByCreated(createdDate)) {
            alert("Chỉ được hủy trong vòng 24 giờ kể từ lúc đặt lịch!");
            return;
        }
        if (!window.confirm("Bạn chắc muốn hủy lịch hẹn này?")) return;

        try {
            await authApis().put(endpoints.cancelAppointment(id));
            setRows(prev => prev.map(r => (r.id === id ? { ...r, status: "CANCEL" } : r)));
        } catch (e) {
            console.error("Cancel failed:", e?.response?.status, e?.message, e?.response?.data);
            alert(e?.response?.data || "Hủy lịch thất bại");
        }
    };

    // mở modal đổi lịch
    const openReschedule = (appt) => {
        if (!canCancelByCreated(appt.createdDate)) {
            alert("Chỉ được đổi trong vòng 24 giờ kể từ lúc đặt lịch!");
            return;
        }
        setSelectedAppt(appt);
        setNewDate(dayjs(appt.date).format("YYYY-MM-DDTHH:mm")); // format cho input datetime-local
        setShowResModal(true);
    };

    // gửi đổi lịch
    const submitReschedule = async () => {
        if (!selectedAppt) return;
        if (!newDate) {
            alert("Vui lòng chọn ngày giờ mới!");
            return;
        }
        setSavingRes(true);
        try {
            await authApis().put(
                endpoints.rescheduleAppointment(selectedAppt.id),
                { date: newDate }
            );
            setRows(prev =>
                prev.map(r => (r.id === selectedAppt.id ? { ...r, date: newDate } : r))
            );
            setShowResModal(false);
        } catch (e) {
            console.error("Reschedule failed:", e?.response?.status, e?.message, e?.response?.data);
            alert(e?.response?.data || "Đổi lịch thất bại");
        } finally {
            setSavingRes(false);
        }
    };

    const statusBadge = (status) => {
        const map = {
            ACCEPT: { className: "text-bg-primary", text: "Đã xác nhận" },
            CANCEL: { className: "text-bg-danger", text: "Đã hủy" },
            PENDING: { className: "text-bg-warning", text: "Chờ xác nhận" },
            DONE: { className: "text-bg-success", text: "Hoàn thành" },
        };
        const s = map[status] || { className: "text-bg-secondary", text: status };
        return <span className={`badge ${s.className}`}>{s.text}</span>;
    };

    if (!user?.id) return <div className="p-3">Vui lòng đăng nhập để xem lịch hẹn.</div>;
    if (loading) return <div className="p-3">Đang tải...</div>;
    if (err) return <div className="alert alert-danger m-3">{err}</div>;

    return (
        <>
            <div className="table-responsive">
                <table className="table align-middle table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>Ngày khám</th>
                            <th>Ngày đặt</th>
                            <th>Bác sĩ</th>
                            <th>Bệnh nhân</th>
                            <th>Triệu chứng</th>
                            <th>Ghi chú</th>
                            <th>Trạng thái</th>
                            <th className="text-end">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center text-muted py-4">Không có lịch hẹn</td>
                            </tr>
                        ) : (
                            rows.map(r => {
                                const allowAction = r.status !== "CANCEL" && canCancelByCreated(r.createdDate);
                                return (
                                    <tr key={r.id}>
                                        <td>{dayjs(r.date).format("HH:mm, DD/MM/YYYY")}</td>
                                        <td>{dayjs(r.createdDate).format("HH:mm, DD/MM/YYYY")}</td>
                                        <td>{r.doctor?.name || "-"}</td>
                                        <td>{r.patient?.name || "-"}</td>
                                        <td>{r.symptom || "-"}</td>
                                        <td>{r.note || "-"}</td>
                                        <td>{statusBadge(r.status)}</td>
                                        <td className="text-end">
                                            <button
                                                className="btn btn-outline-primary btn-sm me-2"
                                                onClick={() => openReschedule(r)}
                                                disabled={!allowAction}
                                                title={
                                                    allowAction
                                                        ? "Đổi thời gian hẹn"
                                                        : "Chỉ được đổi trong vòng 24 giờ kể từ lúc đặt, hoặc lịch đã hủy"
                                                }
                                            >
                                                Đổi lịch
                                            </button>
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => handleCancel(r.id, r.createdDate)}
                                                disabled={!allowAction}
                                                title={
                                                    allowAction
                                                        ? "Hủy lịch"
                                                        : "Chỉ được hủy trong vòng 24 giờ kể từ lúc đặt, hoặc lịch đã hủy"
                                                }
                                            >
                                                Hủy lịch
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal đổi lịch */}
            <Modal show={showResModal} onHide={() => setShowResModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Đổi lịch hẹn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Chọn ngày giờ mới</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                            />
                        </Form.Group>
                        {selectedAppt && (
                            <div className="mt-3 text-muted small">
                                Lịch hiện tại: {dayjs(selectedAppt.date).format("HH:mm, DD/MM/YYYY")}
                            </div>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowResModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={submitReschedule} disabled={savingRes}>
                        {savingRes ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AppointmentsTable;



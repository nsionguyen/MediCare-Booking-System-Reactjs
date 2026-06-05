
import 'bootstrap/dist/css/bootstrap.min.css';


import React, { useContext, useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import { MyUserContext } from "../../configs/MyContexts";

const PatientsTable = () => {
    const [user, dispatch] = useContext(MyUserContext);
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const loadPatients = async () => {
            try {
                let res = await authApis().get(endpoints["patients-booking"](user.id));
                setPatients(res.data || []);
            } catch (err) {
                console.error("Lỗi khi load patients:", err);
            }
        };

        loadPatients();
    }, [user.id]);

    return (
        <div className="container my-4">
            <h2 className="mb-4 text-primary fw-bold">
                <i className="bi bi-people-fill me-2"></i> Danh sách bệnh nhân
            </h2>

            <div className="table-responsive shadow-sm rounded">
                <table className="table table-striped table-hover table-bordered align-middle">
                    <thead className="table-primary text-center">
                        <tr>
                            <th>Tuổi</th>
                            <th>Email</th>
                            <th>Tên</th>
                            <th>Số điện thoại</th>
                            <th>Quê quán</th>
                            <th>Giới tính</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.length > 0 ? (
                            patients.map((p, idx) => (
                                <tr key={idx}>
                                    <td>{p.age}</td>
                                    <td>{p.email}</td>
                                    <td>{p.name}</td>
                                    <td>{p.phone}</td>
                                    <td>{p.homeTown}</td>
                                    <td>{p.gender}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-muted fst-italic">
                                    Không có bệnh nhân nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PatientsTable;
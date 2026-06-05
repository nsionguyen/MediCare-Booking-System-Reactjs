import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { useParams } from "react-router-dom";
import Apis, { endpoints } from "../../configs/Apis";

const DoctorCalendar = () => {
    const { id } = useParams();

    const [events, setEvents] = useState([]);
    const calendarRef = useRef(null); // ref để gọi changeView

    useEffect(() => {

        Apis.get(endpoints.calendar(id))
            .then((res) => setEvents(res.data))
            .catch((err) => console.log(err));
    }, [id]);

    const handleDateClick = (info) => {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.changeView("timeGridDay", info.dateStr); // chuyển sang view ngày
    };

    return (
        <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            dateClick={handleDateClick} // click vào ngày
            eventClick={(info) => {
                alert(`Lịch khám của: ${info.event.title} lúc ${info.event.start}`);
            }}
            slotLabelFormat={{
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }}
            firstDay={1}
            slotMinTime="07:00:00"
            slotMaxTime="18:00:00"
            expandRows={true}
        />
    );
};

export default DoctorCalendar;


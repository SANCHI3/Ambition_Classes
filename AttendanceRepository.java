package com.ambition.ambitionbackend.repository;

import com.ambition.ambitionbackend.model.Attendance;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AttendanceRepository extends MongoRepository<Attendance, String> {

    List<Attendance> findByStudentMobile(String studentMobile);

    List<Attendance> findByStudentMobileAndDate(String studentMobile, String date);
}
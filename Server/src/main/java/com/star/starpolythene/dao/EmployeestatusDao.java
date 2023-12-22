package com.star.starpolythene.dao;

import com.star.starpolythene.entity.Designation;
import com.star.starpolythene.entity.Employeestatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeestatusDao extends JpaRepository<Employeestatus,Integer> {
}

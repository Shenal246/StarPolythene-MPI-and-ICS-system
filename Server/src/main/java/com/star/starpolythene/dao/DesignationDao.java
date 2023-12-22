package com.star.starpolythene.dao;

import com.star.starpolythene.entity.Designation;
import com.star.starpolythene.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DesignationDao extends JpaRepository<Designation,Integer> {
}

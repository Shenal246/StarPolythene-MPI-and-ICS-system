package com.star.starpolythene.dao;

import com.star.starpolythene.entity.Employee;
import com.star.starpolythene.entity.Gender;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GenderDao extends JpaRepository<Gender,Integer> {
}

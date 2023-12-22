package com.star.starpolythene.dao;

import com.star.starpolythene.entity.Color;
import com.star.starpolythene.entity.Employee;
import com.star.starpolythene.entity.Grn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GrnDao extends JpaRepository<Grn,Integer> {

    @Query("select e from Grn e where e.id = :id")
    Grn findByMyId(@Param("id") Integer id);
}

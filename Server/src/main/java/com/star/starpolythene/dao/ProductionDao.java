package com.star.starpolythene.dao;

import com.star.starpolythene.entity.Production;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProductionDao extends JpaRepository<Production,Integer> {
//    Production findByCode(String code);
//
//    Optional<Production> findById(Integer id);
//
    @Query("select e from Production e where e.id = :id")
    Production findByMyId(@Param("id") Integer id);
}

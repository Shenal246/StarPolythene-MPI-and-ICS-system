package com.star.starpolythene.dao;

import com.star.starpolythene.entity.Productionproduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProductionproductDao extends JpaRepository<Productionproduct,Integer> {
//    Production findByCode(String code);
//
//    Optional<Production> findById(Integer id);
//
//    @Query("select p from Production p where p.id = :id")
//    Production findByMyId(@Param("id") Integer id);
}

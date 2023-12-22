package com.star.starpolythene.dao;

import com.star.starpolythene.entity.Productmaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ProductmaterialDao extends JpaRepository<Productmaterial,Integer> {
   
//    Optional<Productmaterial> findById(Integer id);
//
//    @Query("select p from Productmaterial p where p.id = :id")
//    Productmaterial findByMyId(@Param("id") Integer id);

}

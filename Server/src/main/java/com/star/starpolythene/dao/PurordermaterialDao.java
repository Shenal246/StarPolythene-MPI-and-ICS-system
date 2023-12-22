package com.star.starpolythene.dao;

import com.star.starpolythene.entity.Purordermaterial;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurordermaterialDao extends JpaRepository<Purordermaterial,Integer> {
   
//    Optional<Productmaterial> findById(Integer id);
//
//    @Query("select p from Productmaterial p where p.id = :id")
//    Productmaterial findByMyId(@Param("id") Integer id);

}

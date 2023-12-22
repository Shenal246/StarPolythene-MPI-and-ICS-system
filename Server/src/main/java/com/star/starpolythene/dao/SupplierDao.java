package com.star.starpolythene.dao;

import com.star.starpolythene.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SupplierDao extends JpaRepository<Supplier,Integer> {

    Optional<Supplier> findById(Integer id);

    @Query("select s from Supplier s where s.id = :id")
    Supplier findByMyId(@Param("id") Integer id);

    @Query("select s from Supplier s where s.tpnumber = :tpnumber")
    Supplier findByPhoneNo(@Param("tpnumber") String tpnumber);
}

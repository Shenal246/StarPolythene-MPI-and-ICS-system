package com.star.starpolythene.dao;

import com.star.starpolythene.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InvoiceDao extends JpaRepository<Invoice,Integer> {

    @Query("select p from Invoice p where p.id = :id")
    Invoice findByMyId(@Param("id") Integer id);

    @Query("SELECT i FROM Invoice i WHERE i.name = :name")
    Invoice findInvoiceByCode(String name);

}

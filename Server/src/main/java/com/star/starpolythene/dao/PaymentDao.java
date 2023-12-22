package com.star.starpolythene.dao;

import com.star.starpolythene.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.Optional;

public interface PaymentDao extends JpaRepository<Payment,Integer> {
    Payment findByChequeno(String chequeno);
    Payment findByDate(Date date);

    Optional<Payment> findById(Integer id);

    @Query("select p from Payment p where p.id = :id")
    Payment findByMyId(@Param("id") Integer id);
}

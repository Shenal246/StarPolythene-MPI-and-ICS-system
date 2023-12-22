package com.star.starpolythene.report.dao;

import com.star.starpolythene.report.entity.ProductByYear;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductByYearDao extends JpaRepository<ProductByYear,Integer> {

    @Query("SELECT NEW ProductByYear(p.code, SUM(p.qty)) FROM Product p WHERE EXTRACT(YEAR FROM p.dointroduced) = :year GROUP BY p.code")
    List<ProductByYear> getProductByYear(@Param("year") int year);

}

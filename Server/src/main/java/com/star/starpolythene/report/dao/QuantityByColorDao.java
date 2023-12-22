package com.star.starpolythene.report.dao;

import com.star.starpolythene.report.entity.CountByDesignation;
import com.star.starpolythene.report.entity.QuantityByColor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QuantityByColorDao extends JpaRepository<CountByDesignation, Integer> {
    @Query(value = "SELECT NEW QuantityByColor (c.name, p.qty) FROM Color c, Product p WHERE p.color.id = c.id GROUP BY c.id")
    List<QuantityByColor> quantityByColor();
}

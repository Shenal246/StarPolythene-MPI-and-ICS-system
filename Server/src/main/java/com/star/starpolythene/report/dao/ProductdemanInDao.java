package com.star.starpolythene.report.dao;

import com.star.starpolythene.report.entity.ProductdemanIn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductdemanInDao extends JpaRepository<ProductdemanIn,Integer> {

    @Query("SELECT new ProductdemanIn(YEAR(p.date),pp.product.id, pp.production.id, SUM(pp.qty), COUNT(*)) FROM Productionproduct pp, Production p WHERE pp.id = p.id GROUP BY YEAR(p.date), pp.id")
    List<ProductdemanIn> getProductSummaryByYear();

}

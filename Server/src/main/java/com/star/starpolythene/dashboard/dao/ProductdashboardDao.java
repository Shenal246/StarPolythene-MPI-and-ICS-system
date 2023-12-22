package com.star.starpolythene.dashboard.dao;

import com.star.starpolythene.dashboard.entity.Productdashboard;
import com.star.starpolythene.report.entity.InvoiceByShop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductdashboardDao extends JpaRepository<Productdashboard,Integer> {

//    @Query("SELECT new Productdashboard (p.id, FUNCTION('ROUND', p.qty))  FROM Product p GROUP BY p.id")
//    List<Productdashboard> getTotal();

//    @Query("SELECT new com.star.starpolythene.dashboard.entity.Productdashboard(p.id, SUM (p.qty)) " +
//            "FROM Product p")
//    List<Productdashboard> findTotal();

    @Query("SELECT new com.star.starpolythene.dashboard.entity.Productdashboard(p.id, SUM (p.qty)) " +
            "FROM Product p")
    Productdashboard findTotal();

}

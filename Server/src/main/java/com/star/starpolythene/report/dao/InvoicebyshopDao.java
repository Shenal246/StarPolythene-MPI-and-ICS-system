package com.star.starpolythene.report.dao;

import com.star.starpolythene.report.entity.InvoiceByShop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InvoicebyshopDao extends JpaRepository<InvoiceByShop,Integer> {

//    @Query("SELECT FUNCTION('YEAR', i.date) AS invoiceyear, SUM(i.grandtotal) AS totalgrandtotal, i.shop.id AS shopid FROM Invoice i GROUP BY i.shop.id, FUNCTION('YEAR', i.date)")
//    List<InvoiceByShop> getInvoiceByShop();

    @Query("SELECT new InvoiceByShop(i.id, FUNCTION('YEAR', i.date), i.date, SUM(i.grandtotal), i.shop.name) " +
            "FROM Invoice i " +
            "GROUP BY i.shop.id, FUNCTION('YEAR', i.date) " +
            "HAVING FUNCTION('YEAR', i.date) = :year")
    List<InvoiceByShop> getInvoiceByShop(@Param("year") int year);

}

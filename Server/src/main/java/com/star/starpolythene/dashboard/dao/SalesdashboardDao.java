package com.star.starpolythene.dashboard.dao;

import com.star.starpolythene.dashboard.entity.Salesdashboard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SalesdashboardDao extends JpaRepository<Salesdashboard,Integer> {


    @Query("SELECT new com.star.starpolythene.dashboard.entity.Salesdashboard(i.id, SUM (i.grandtotal)) " +
            "FROM Invoice i")
    Salesdashboard findTotal();

}

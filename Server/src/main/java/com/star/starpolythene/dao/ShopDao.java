package com.star.starpolythene.dao;

import com.star.starpolythene.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ShopDao extends JpaRepository<Shop,Integer> {

    Optional<Shop> findById(Integer id);

    @Query("select s from Shop s where s.tpnumber = :tpnumber")
    Shop findByTpnumber(String tpnumber);

    @Query("select s from Shop s where s.id = :id")
    Shop findByMyId(@Param("id") Integer id);
}

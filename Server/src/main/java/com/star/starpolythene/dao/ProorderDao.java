package com.star.starpolythene.dao;

import com.star.starpolythene.entity.Material;
import com.star.starpolythene.entity.Proorder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProorderDao extends JpaRepository<Proorder, Integer> {

    @Query("SELECT i FROM Proorder i WHERE i.code = :code")
    Proorder findProorderByCode(String code);

    @Query("SELECT NEW Proorder (p.id, p.code,p.date) FROM Proorder p")
    List<Proorder> findAllCodeDate();

}

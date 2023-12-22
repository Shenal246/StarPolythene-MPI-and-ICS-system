package com.star.starpolythene.dao;

import com.star.starpolythene.entity.Employee;
import com.star.starpolythene.entity.Purorder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PurorderDao extends JpaRepository<Purorder,Integer> {
    @Query("SELECT i FROM Purorder i WHERE i.code = :code")
    Purorder findPurorderByCode(String code);

    @Query("select e from Purorder e where e.id = :id")
    Purorder findByMyId(@Param("id") Integer id);

    @Query("SELECT NEW Purorder (p.id, p.code) FROM Purorder p")
    List<Purorder> findAllList();
}

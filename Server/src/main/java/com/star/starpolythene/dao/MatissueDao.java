package com.star.starpolythene.dao;

import com.star.starpolythene.entity.Employee;
import com.star.starpolythene.entity.Matissue;
import com.star.starpolythene.entity.Purorder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MatissueDao extends JpaRepository<Matissue,Integer> {
//    @Query("SELECT i FROM Matissue i WHERE i.code = :code")
//    Matissue findMatissueByCode(String code);

    Matissue findById(int id);

    @Query("select mi from Matissue mi where mi.id = :id")
    Matissue findByMyId(@Param("id") Integer id);
}

package com.star.starpolythene.dao;

import com.star.starpolythene.entity.Employee;
import com.star.starpolythene.entity.Material;
import com.star.starpolythene.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MaterialDao extends JpaRepository<Material,Integer> {
    Material findByCode(String code);

    Optional<Material> findById(Integer id);

    @Query("select m from Material m where m.id = :id")
    Material findByMyId(@Param("id") Integer id);

    @Query("SELECT NEW Material (m.id, m.code,m.name,m.qty) FROM Material m")
    List<Material> findAllNameId();

    @Query("SELECT NEW Material (m.id, m.code,m.name,m.qty,m.rop,m.unitprice) FROM Material m")
    List<Material> findAllLit();
}

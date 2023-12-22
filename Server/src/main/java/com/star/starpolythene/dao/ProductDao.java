package com.star.starpolythene.dao;

import com.star.starpolythene.entity.Employee;
import com.star.starpolythene.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductDao extends JpaRepository<Product,Integer> {
    Product findByCode(String code);

    Optional<Product> findById(Integer id);

    @Query("select p from Product p where p.id = :id")
    Product findByMyId(@Param("id") Integer id);

    @Query("SELECT NEW Product (p.id, p.code,p.name) FROM Product p")
    List<Product> findAllList();

    @Query("select NEW Product(p.id,p.name,p.code) from Product p")
    List<Product> findByIdNameCode();

    @Query("select NEW Product(p.id,p.code,p.qty) from Product p")
    List<Product> findByIdAndQty();
}

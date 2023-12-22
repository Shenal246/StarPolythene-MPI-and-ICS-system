package com.star.starpolythene.dao;

import com.star.starpolythene.entity.Operation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OperationDao extends JpaRepository<Operation,Integer> {
}

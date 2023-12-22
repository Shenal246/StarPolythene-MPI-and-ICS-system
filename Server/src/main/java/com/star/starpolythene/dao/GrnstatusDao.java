package com.star.starpolythene.dao;

import com.star.starpolythene.entity.Grnstatus;
import com.star.starpolythene.entity.Paymentstatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GrnstatusDao extends JpaRepository<Grnstatus,Integer> {
}

package com.star.starpolythene.dao;

import com.star.starpolythene.entity.Materialstatus;
import com.star.starpolythene.entity.Productstatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialstatusDao extends JpaRepository<Materialstatus,Integer> {
}

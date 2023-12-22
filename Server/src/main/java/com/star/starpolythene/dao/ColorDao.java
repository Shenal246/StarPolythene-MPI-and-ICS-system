package com.star.starpolythene.dao;

import com.star.starpolythene.entity.Color;
import com.star.starpolythene.entity.Designation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ColorDao extends JpaRepository<Color,Integer> {
}

package com.star.starpolythene.dao;


import com.star.starpolythene.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface UserDao extends JpaRepository<User,Integer> {
    User findByUsername(String username);
}

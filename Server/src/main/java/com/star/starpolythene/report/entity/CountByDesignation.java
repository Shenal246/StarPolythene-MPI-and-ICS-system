package com.star.starpolythene.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class CountByDesignation {
    private Integer id;
    private String designation;
    private Long count;
    private double percentage;

    public CountByDesignation() {
    }

    public CountByDesignation(String designation, Long count) {
        this.designation = designation;
        this.count = count;
    }

    @Id
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }
}

package com.star.starpolythene.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.math.BigDecimal;

@Entity
public class QuantityByColor {
    private Integer id;
    private String color;
    private BigDecimal qty;
    private double percentage;

    public QuantityByColor() {
    }

    public QuantityByColor(String color, BigDecimal qty) {
        this.color = color;
        this.qty = qty;
    }

    @Id
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public BigDecimal getQty() {
        return qty;
    }

    public void setQty(BigDecimal qty) {
        this.qty = qty;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }
}

package com.star.starpolythene.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.math.BigDecimal;

@Entity
public class ProductByYear {

    @Id
    private Integer id;
    private String code;
    private Double percentage;

    private BigDecimal quantity;


    public ProductByYear(String code, BigDecimal quantity) {
        this.code = code;
        this.quantity = quantity;
    }

    public ProductByYear() {

    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }
}

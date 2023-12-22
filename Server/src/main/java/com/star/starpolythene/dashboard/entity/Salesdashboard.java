package com.star.starpolythene.dashboard.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.math.BigDecimal;

@Entity
public class Salesdashboard {
    @Id
    private Integer id;
    private BigDecimal total;

    public Salesdashboard(Integer id, BigDecimal total) {
        this.id = id;
        this.total = total;
    }

    public Salesdashboard() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}

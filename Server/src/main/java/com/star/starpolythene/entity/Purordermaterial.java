package com.star.starpolythene.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.star.starpolythene.util.RegexPattern;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Objects;

@Entity
public class Purordermaterial {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "qty")
    private BigDecimal qty;
    @Basic
    @Column(name = "explinetotal")
    @RegexPattern(reg = "^[0-9]+$", msg = "Invalid Price Format")
    private BigDecimal explinetotal;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "purorder_id", referencedColumnName = "id", nullable = false)
    private Purorder purorder;
    @ManyToOne
    @JoinColumn(name = "material_id", referencedColumnName = "id", nullable = false)
    private Material material;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public BigDecimal getQty() {
        return qty;
    }

    public void setQty(BigDecimal qty) {
        this.qty = qty;
    }

    public BigDecimal getExplinetotal() {
        return explinetotal;
    }

    public void setExplinetotal(BigDecimal explinetotal) {
        this.explinetotal = explinetotal;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Purordermaterial that = (Purordermaterial) o;
        return Objects.equals(id, that.id) && Objects.equals(qty, that.qty) && Objects.equals(explinetotal, that.explinetotal);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, qty, explinetotal);
    }

    public Purorder getPurorder() {
        return purorder;
    }

    public void setPurorder(Purorder purorder) {
        this.purorder = purorder;
    }

    public Material getMaterial() {
        return material;
    }

    public void setMaterial(Material material) {
        this.material = material;
    }
}

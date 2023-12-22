package com.star.starpolythene.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.star.starpolythene.util.RegexPattern;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Purorder {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "code")
    private String code;
    @Basic
    @Column(name = "date")
    private Date date;
    @Basic
    @Column(name = "expectedcost")
//    @RegexPattern(reg = "^\\d{1,5}\\.\\d{2}$", msg = "Invalid Price Format")
    private BigDecimal expectedcost;
    @ManyToOne
    @JoinColumn(name = "purorderstatus_id", referencedColumnName = "id", nullable = false)
    private Purorderstatus purorderstatus;

    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;
    @OneToMany(mappedBy = "purorder",cascade = CascadeType.ALL,orphanRemoval = true)
    private Collection<Purordermaterial> purordermaterials;
    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id", nullable = false)
    private Supplier supplier;
    @JsonIgnore
    @OneToMany(mappedBy = "purorder")
    private Collection<Grn> grns;

    public Purorder() {
    }

    public Purorder(Integer id, String code) {
        this.id = id;
        this.code = code;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public BigDecimal getExpectedcost() {
        return expectedcost;
    }

    public void setExpectedcost(BigDecimal expectedcost) {
        this.expectedcost = expectedcost;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Purorder purorder = (Purorder) o;
        return Objects.equals(id, purorder.id) && Objects.equals(date, purorder.date) && Objects.equals(expectedcost, purorder.expectedcost);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, date, expectedcost);
    }

    public Purorderstatus getPurorderstatus() {
        return purorderstatus;
    }

    public void setPurorderstatus(Purorderstatus purorderstatus) {
        this.purorderstatus = purorderstatus;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Collection<Purordermaterial> getPurordermaterials() {
        return purordermaterials;
    }

    public void setPurordermaterials(Collection<Purordermaterial> purordermaterials) {
        this.purordermaterials = purordermaterials;
    }

    public Supplier getSupplier() {
        return supplier;
    }

    public void setSupplier(Supplier supplier) {
        this.supplier = supplier;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Collection<Grn> getgrns() {
        return grns;
    }

    public void setgrns(Collection<Grn> grns) {
        this.grns = grns;
    }
}

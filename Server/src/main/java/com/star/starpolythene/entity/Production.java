package com.star.starpolythene.entity;

import javax.persistence.*;
import java.sql.Date;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Production {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "date")
    private Date date;
    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;
    @ManyToOne
    @JoinColumn(name = "proorder_id", referencedColumnName = "id", nullable = false)
    private Proorder proorder;
    @OneToMany(mappedBy = "production",cascade = CascadeType.ALL,orphanRemoval = true)
    private Collection<Productionproduct> productionproducts;
//    @Basic
//    @Column(name = "code")
//    private String code;

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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Production that = (Production) o;
        return Objects.equals(id, that.id) && Objects.equals(date, that.date);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, date);
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Proorder getProorder() {
        return proorder;
    }

    public void setProorder(Proorder proorder) {
        this.proorder = proorder;
    }

    public Collection<Productionproduct> getProductionproducts() {
        return productionproducts;
    }

    public void setProductionproducts(Collection<Productionproduct> productionproducts) {
        this.productionproducts = productionproducts;
    }
//
//    public String getCode() {
//        return code;
//    }
//
//    public void setCode(String code) {
//        this.code = code;
//    }
}

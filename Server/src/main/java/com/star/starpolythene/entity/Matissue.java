package com.star.starpolythene.entity;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Matissue {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "date")
    private Date date;
    @ManyToOne
    @JoinColumn(name = "issuer_id", referencedColumnName = "id", nullable = false)
    private Employee employee;
    @ManyToOne
    @JoinColumn(name = "proorder_id", referencedColumnName = "id", nullable = false)
    private Proorder proorder;

    @OneToMany(mappedBy = "matissue",cascade = CascadeType.ALL,orphanRemoval = true)
    private Collection<Matissuematerial> matissuematerials;


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
        Matissue matissue = (Matissue) o;
        return Objects.equals(id, matissue.id) && Objects.equals(date, matissue.date);
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

    public Collection<Matissuematerial> getMatissuematerials() {
        return matissuematerials;
    }

    public void setMatissuematerials(Collection<Matissuematerial> matissuematerials) {
        this.matissuematerials = matissuematerials;
    }


}

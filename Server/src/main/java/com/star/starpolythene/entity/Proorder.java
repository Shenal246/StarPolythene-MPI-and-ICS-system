package com.star.starpolythene.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Proorder {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "code")
    private String code;
    @Basic
    @Column(name = "date")
    private Date date;
    @Basic
    @Column(name = "expdate")
    private Date expdate;
    @OneToMany(mappedBy = "proorder")
    @JsonIgnore
    private Collection<Matissue> matissues;

    @OneToMany(mappedBy = "proorder")
    @JsonIgnore
    private Collection<Production> productions;
    @ManyToOne
    @JoinColumn(name = "prodorderstatus_id", referencedColumnName = "id", nullable = false)
    private Proorderstatus proorderstatus;
    @ManyToOne
    @JoinColumn(name = "manager_id", referencedColumnName = "id", nullable = false)
    private Employee employee;
    @ManyToOne
    @JoinColumn(name = "supervisor_id", referencedColumnName = "id", nullable = false)
    private Employee supervisor;
    @OneToMany(mappedBy = "proorder",cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<Proorderproduct> proorderproducts;

    private BigDecimal grandtotal;

    public Proorder(int id, String code, java.util.Date date) {
        this.id = id;
        this.code = code;
        this.date = new Date(date.getTime());;
    }

    public Proorder() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Date getExpdate() {
        return expdate;
    }

    public void setExpdate(Date expdate) {
        this.expdate = expdate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Proorder proorder = (Proorder) o;
        return id == proorder.id && Objects.equals(code, proorder.code) && Objects.equals(date, proorder.date) && Objects.equals(expdate, proorder.expdate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, code, date, expdate);
    }

    public Collection<Matissue> getMatissues() {
        return matissues;
    }

    public void setMatissues(Collection<Matissue> matissues) {
        this.matissues = matissues;
    }

    public Collection<Production> getProductions() {
        return productions;
    }

    public void setProductions(Collection<Production> productions) {
        this.productions = productions;
    }

    public Proorderstatus getProorderstatus() {
        return proorderstatus;
    }

    public void setProorderstatus(Proorderstatus proorderstatus) {
        this.proorderstatus = proorderstatus;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Employee getSupervisor() {
        return supervisor;
    }

    public void setSupervisor(Employee supervisor) {
        this.supervisor = supervisor;
    }

    public Collection<Proorderproduct> getProorderproducts() {
        return proorderproducts;
    }

    public void setProorderproducts(Collection<Proorderproduct> proorderproducts) {
        this.proorderproducts = proorderproducts;
    }

    @Basic
    @Column(name = "grandtotal")
    public BigDecimal getGrandtotal() {
        return grandtotal;
    }

    public void setGrandtotal(BigDecimal grandtotal) {
        this.grandtotal = grandtotal;
    }
}

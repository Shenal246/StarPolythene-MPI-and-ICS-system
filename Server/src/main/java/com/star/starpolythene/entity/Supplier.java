package com.star.starpolythene.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.star.starpolythene.util.RegexPattern;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.sql.Date;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Supplier {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "name")
    private String name;
    @Basic
    @Column(name = "tpnumber")
    @Pattern(regexp = "^\\d{10}$", message = "Invalid Phone Number")
    private String tpnumber;
    @Basic
    @Column(name = "contactperson")
    private String contactperson;
    @Basic
    @Column(name = "contactpersontp")
    @Pattern(regexp = "^\\d{10}$", message = "Invalid Phone Number")
    private String contactpersontp;
    @Basic
    @Column(name = "address")
    private String address;
    @Basic
    @Column(name = "email")
    @Pattern(regexp = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$", message = "Invalid Email Address")
    private String email;
    @Basic
    @Column(name = "regdate")
    @RegexPattern(reg = "^\\d{2}-\\d{2}-\\d{2}$", msg = "Invalid Date Format")
    private Date regdate;
    @ManyToOne
    @JoinColumn(name = "supplierstatus_id", referencedColumnName = "id", nullable = false)
    private Supplierstatus supplierstatus;
    @OneToMany(mappedBy = "supplier",cascade = CascadeType.ALL,orphanRemoval = true)
    private Collection<Supply> supplies;

    @JsonIgnore
    @OneToMany(mappedBy = "supplier")
    private Collection<Purorder> purorders;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTpnumber() {
        return tpnumber;
    }

    public void setTpnumber(String tpnumber) {
        this.tpnumber = tpnumber;
    }

    public String getContactperson() {
        return contactperson;
    }

    public void setContactperson(String contactperson) {
        this.contactperson = contactperson;
    }

    public String getContactpersontp() {
        return contactpersontp;
    }

    public void setContactpersontp(String contactpersontp) {
        this.contactpersontp = contactpersontp;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Date getRegdate() {
        return regdate;
    }

    public void setRegdate(Date regdate) {
        this.regdate = regdate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Supplier supplier = (Supplier) o;
        return Objects.equals(id, supplier.id) && Objects.equals(name, supplier.name) && Objects.equals(tpnumber, supplier.tpnumber) && Objects.equals(contactperson, supplier.contactperson) && Objects.equals(contactpersontp, supplier.contactpersontp) && Objects.equals(address, supplier.address) && Objects.equals(email, supplier.email) && Objects.equals(regdate, supplier.regdate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, tpnumber, contactperson, contactpersontp, address, email, regdate);
    }

    public Supplierstatus getSupplierstatus() {
        return supplierstatus;
    }

    public void setSupplierstatus(Supplierstatus supplierstatus) {
        this.supplierstatus = supplierstatus;
    }

    public Collection<Supply> getSupplies() {
        return supplies;
    }

    public void setSupplies(Collection<Supply> supplies) {
        this.supplies = supplies;
    }

    public Collection<Purorder> getpurorders() {
        return purorders;
    }

    public void setpurorders(Collection<Purorder> purorders) {
        this.purorders = purorders;
    }
}

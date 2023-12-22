package com.star.starpolythene.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.star.starpolythene.util.RegexPattern;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Shop {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "name")
    private String name;
    @Basic
    @Column(name = "address")
    @Pattern(regexp = "^([\\w\\/\\-,\\s]{2,})$", message = "Invalid Address")
    private String address;
    @Basic
    @Column(name = "tpnumber")
    @Pattern(regexp = "^\\d{10}$", message = "Invalid Phone Number")
    private String tpnumber;
    @Basic
    @Column(name = "email")
    @Pattern(regexp = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$", message = "Invalid Email Address")
    private String email;
    @Basic
    @Column(name = "contactperson")
    @Pattern(regexp = "^[A-Za-z]+$", message = "Can contain Only letters")
    private String contactperson;
    @Basic
    @Column(name = "contactpno")
    @Pattern(regexp = "^\\d{10}$", message = "Invalid Phone Number")
    private String contactpno;
    @Basic
    @Column(name = "dointroduced")
    @RegexPattern(reg = "^\\d{2}-\\d{2}-\\d{2}$", msg = "Invalid Date Format")
    private Date dointroduced;
    @Basic
    @Column(name = "creditlimit")
    @RegexPattern(reg = "^[0-9]+$", msg = "Invalid Price")
    private BigDecimal creditlimit;
    @ManyToOne
    @JoinColumn(name = "shopstatus_id", referencedColumnName = "id", nullable = false)
    private Shopstatus shopstatus;
    @JsonIgnore
    @OneToMany(mappedBy = "shop")
    private Collection<Invoice> invoices;

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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getTpnumber() {
        return tpnumber;
    }

    public void setTpnumber(String tpnumber) {
        this.tpnumber = tpnumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContactperson() {
        return contactperson;
    }

    public void setContactperson(String contactperson) {
        this.contactperson = contactperson;
    }

    public String getContactpno() {
        return contactpno;
    }

    public void setContactpno(String contactpno) {
        this.contactpno = contactpno;
    }

    public Date getDointroduced() {
        return dointroduced;
    }

    public void setDointroduced(Date dointroduced) {
        this.dointroduced = dointroduced;
    }

    public BigDecimal getCreditlimit() {
        return creditlimit;
    }

    public void setCreditlimit(BigDecimal creditlimit) {
        this.creditlimit = creditlimit;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Shop shop = (Shop) o;
        return Objects.equals(id, shop.id) && Objects.equals(name, shop.name) && Objects.equals(address, shop.address) && Objects.equals(tpnumber, shop.tpnumber) && Objects.equals(email, shop.email) && Objects.equals(contactperson, shop.contactperson) && Objects.equals(contactpno, shop.contactpno) && Objects.equals(dointroduced, shop.dointroduced) && Objects.equals(creditlimit, shop.creditlimit);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, address, tpnumber, email, contactperson, contactpno, dointroduced, creditlimit);
    }

    public Shopstatus getShopstatus() {
        return shopstatus;
    }

    public void setShopstatus(Shopstatus shopstatus) {
        this.shopstatus = shopstatus;
    }

    public Collection<Invoice> getInvoices() {
        return invoices;
    }

    public void setInvoices(Collection<Invoice> invoices) {
        this.invoices = invoices;
    }
}

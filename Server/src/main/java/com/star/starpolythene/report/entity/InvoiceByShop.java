package com.star.starpolythene.report.entity;


import javax.persistence.Entity;
import javax.persistence.Id;
import java.math.BigDecimal;
import java.util.Date;

@Entity
public class InvoiceByShop {

    @Id
    private Integer id;
    private Date date;
    private Integer invoiceyear;
    private BigDecimal totalgrandtotal;
    private String shop;


    public InvoiceByShop(){ }

    public InvoiceByShop(Integer id,Integer invoiceyear, Date date, BigDecimal totalgrandtotal, String shop) {
        this.id = id;
        this.invoiceyear = invoiceyear;
        this.date = date;
        this.totalgrandtotal = totalgrandtotal;
        this.shop = shop;
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

    public Integer getInvoiceyear() {
        return invoiceyear;
    }

    public void setInvoiceyear(Integer invoiceyear) {
        this.invoiceyear = invoiceyear;
    }

    public BigDecimal getTotalgrandtotal() {
        return totalgrandtotal;
    }

    public void setTotalgrandtotal(BigDecimal totalgrandtotal) {
        this.totalgrandtotal = totalgrandtotal;
    }

    public String getShop() {
        return shop;
    }

    public void setShop(String shop) {
        this.shop = shop;
    }
}

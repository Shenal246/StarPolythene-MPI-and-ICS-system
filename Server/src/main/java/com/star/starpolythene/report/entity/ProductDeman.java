package com.star.starpolythene.report.entity;


import javax.persistence.Entity;
import javax.persistence.Id;
import java.math.BigDecimal;

@Entity
public class ProductDeman {

    @Id
    private Integer id;
    private BigDecimal qtyStartYear;
    private BigDecimal qtyEndYear;
    private Integer prductid;
    private String prductname;
    private String code;
    private Long increase;

    public ProductDeman(){ }

    public ProductDeman(BigDecimal qty2022,BigDecimal qty2023, Integer prductid,
                        String prductname,String code, Integer increase ){
    }

    public void setId(Integer id) {this.id = id;}

    public Integer getId() {return id;}

    public BigDecimal getqtyStartYear() {
        return qtyStartYear;
    }

    public void setqtyStartYear(BigDecimal qtyStartYear) { this.qtyStartYear = qtyStartYear;}

    public BigDecimal getQtyEndYear() {
        return qtyEndYear;
    }

    public void setQtyEndYear(BigDecimal qtyEndYear) {this.qtyEndYear = qtyEndYear;}

    public Integer getPrductId() {
        return prductid;
    }

    public void setPrductid(Integer prductid) {this.prductid = prductid;  }

    public String getPrductName() {
        return prductname;
    }

    public void setProductName(String prductname) {this.prductname = prductname;  }


    public String getCode() {return code; }


    public void setCode(String code) {this.code = code;}

    public Long getIncrease() {
        return increase;
    }

    public void setIncrease(Long increase) {this.increase = increase; }


}

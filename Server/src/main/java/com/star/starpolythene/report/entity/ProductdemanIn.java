package com.star.starpolythene.report.entity;


import javax.persistence.Entity;
import javax.persistence.Id;
import java.math.BigDecimal;

@Entity
public class ProductdemanIn {

    @Id
    private Integer id;
    private Integer year;
    private Integer prductid;
    private Integer productionid;
    private BigDecimal sum;
    private Long count;


    public ProductdemanIn(){ }

    public ProductdemanIn(Integer year, Integer productionid,Integer prductid, BigDecimal sum, Long count){
        this.year = year;
        this.prductid = prductid;
        this.productionid = productionid;
        this.sum = sum;
        this.count = count;
    }
    
    public void setId(Integer id) {this.id = id;}

    public Integer getId() {return id;}

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getPrductId() {
        return prductid;
    }
    public void setPrductId(Integer prductid) {this.prductid = prductid;  }

    public Integer getPrducttionId() {
        return productionid;
    }
    public void setProductionId(Integer productionid) {this.productionid = productionid;  }

    public BigDecimal getSum() {
        return sum;
    }

    public void setSum(BigDecimal sum) {this.sum = sum; }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
    
}

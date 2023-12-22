package com.star.starpolythene.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.star.starpolythene.util.RegexPattern;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Material {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "code")
    @Pattern(regexp = "^[A-Z]{5}$", message = "Invalid Code")
    private String code;
    @Basic
    @Column(name = "name")
    //@Pattern(regexp = "^([A-Z][a-z]+)$", message = "Invalid Name")
    private String name;
    @Basic
    @Column(name = "qty")
    @RegexPattern(reg = "^\\d+(\\.\\d+)?$", msg = "Invalid Quentity")
    private BigDecimal qty;
    @Basic
    @Column(name = "rop")
    @RegexPattern(reg = "^\\d+(\\.\\d+)?$", msg = "Invalid Reorder point")
    private BigDecimal rop;
    @Basic
    @Column(name = "unitprice")
    @RegexPattern(reg = "^\\d+(\\.\\d+)?$", msg = "Invalid Price")
    private BigDecimal unitprice;
    @Basic
    @Column(name = "description")
    @Pattern(regexp = "^.*$", message = "Invalid Description")
    private String description;
    @Basic
    @Column(name = "dointroduced")
    @RegexPattern(reg = "^\\d{2}-\\d{2}-\\d{2}$", msg = "Invalid Date Format")
    private Date dointroduced;
    @Basic
    @Column(name = "photo")
    private byte[] photo;
    @ManyToOne
    @JoinColumn(name = "materialcatogary_id", referencedColumnName = "id", nullable = false)
    private Materialcategory materialcategory;
    @ManyToOne
    @JoinColumn(name = "materialstatus_id", referencedColumnName = "id", nullable = false)
    private Materialstatus materialstatus;
    @OneToMany(mappedBy = "material")
    @JsonIgnore
    private Collection<Supply> supplies;
    @OneToMany(mappedBy = "material")
    @JsonIgnore
    private Collection<Productmaterial> productmaterials;

    @JsonIgnore
    @OneToMany(mappedBy = "material")
    private Collection<Purordermaterial> purordermaterials;

    @JsonIgnore
    @OneToMany(mappedBy = "material")
    private Collection<Matissuematerial> matissuematerials;

    @JsonIgnore
    @OneToMany(mappedBy = "material")
    private Collection<Grnmaterial> grnmaterials;

    public Material() {
    }

    public Material(Integer id, String code, String name, BigDecimal qty) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.qty = qty;
    }

    public Material(Integer id, String code, String name, BigDecimal qty, BigDecimal rop, BigDecimal unitprice) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.qty = qty;
        this.rop = rop;
        this.unitprice = unitprice;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getQty() {
        return qty;
    }

    public void setQty(BigDecimal qty) {
        this.qty = qty;
    }

    public BigDecimal getRop() {
        return rop;
    }

    public void setRop(BigDecimal rop) {
        this.rop = rop;
    }

    public BigDecimal getUnitprice() {
        return unitprice;
    }

    public void setUnitprice(BigDecimal unitprice) {
        this.unitprice = unitprice;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDointroduced() {
        return dointroduced;
    }

    public void setDointroduced(Date dointroduced) {
        this.dointroduced = dointroduced;
    }

    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Material material = (Material) o;
        return Objects.equals(id, material.id) && Objects.equals(code, material.code) && Objects.equals(name, material.name) && Objects.equals(qty, material.qty) && Objects.equals(rop, material.rop) && Objects.equals(unitprice, material.unitprice) && Objects.equals(description, material.description) && Objects.equals(dointroduced, material.dointroduced) && Arrays.equals(photo, material.photo);
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(id, code, name, qty, rop, unitprice, description, dointroduced);
        result = 31 * result + Arrays.hashCode(photo);
        return result;
    }

    public Materialcategory getMaterialcategory() {
        return materialcategory;
    }

    public void setMaterialcategory(Materialcategory materialcategory) {
        this.materialcategory = materialcategory;
    }

    public Materialstatus getMaterialstatus() {
        return materialstatus;
    }

    public void setMaterialstatus(Materialstatus materialstatus) {
        this.materialstatus = materialstatus;
    }

    public Collection<Supply> getSupplies() {
        return supplies;
    }

    public void setSupplies(Collection<Supply> supplies) {
        this.supplies = supplies;
    }

    public Collection<Productmaterial> getProductmaterials() {
        return productmaterials;
    }

    public void setProductmaterials(Collection<Productmaterial> productmaterials) {
        this.productmaterials = productmaterials;
    }

    public Collection<Purordermaterial> getPurordermaterials() {
        return purordermaterials;
    }

    public void setPurordermaterials(Collection<Purordermaterial> purordermaterials) {
        this.purordermaterials = purordermaterials;
    }

    public Collection<Matissuematerial> getMatissuematerials() {
        return matissuematerials;
    }

    public void setMatissuematerials(Collection<Matissuematerial> matissuematerials) {
        this.matissuematerials = matissuematerials;
    }

    public Collection<Grnmaterial> getGrnmaterials() {
        return grnmaterials;
    }

    public void setGrnmaterials(Collection<Grnmaterial> grnmaterials) {
        this.grnmaterials = grnmaterials;
    }
}


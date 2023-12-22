package com.star.starpolythene.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.star.starpolythene.util.RegexPattern;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import javax.xml.bind.annotation.XmlTransient;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.Arrays;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Product {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "code")
    @Pattern(regexp = "^[A-Z]{2}\\d{3}$", message = "Invalid Code")
    private String code;
    @Basic
    @Column(name = "name")
    @Pattern(regexp = "^([A-Z][a-z]+)$", message = "Invalid Name")
    private String name;
    @Basic
    @Column(name = "qty")
    private BigDecimal qty;
    @Basic
    @Column(name = "dointroduced")
    @RegexPattern(reg = "^\\d{2}-\\d{2}-\\d{2}$", msg = "Invalid Date Format")
    private Date dointroduced;
    @Basic
    @Column(name = "unitprice")
    private BigDecimal unitprice;
    @Basic
    @Column(name = "description")
    @Pattern(regexp = "^.*$", message = "Invalid Description")
    private String description;
    @Basic
    @Column(name = "photo")
    private byte[] photo;
    @ManyToOne
    @JoinColumn(name = "producttype_id", referencedColumnName = "id", nullable = false)
    private Producttype producttype;
    @ManyToOne
    @JoinColumn(name = "productstatus_id", referencedColumnName = "id", nullable = false)
    private Productstatus productstatus;
    @ManyToOne
    @JoinColumn(name = "color_id", referencedColumnName = "id", nullable = false)
    private Color color;
    @ManyToOne
    @JoinColumn(name = "size_id", referencedColumnName = "id", nullable = false)
    private Size size;
    @ManyToOne
    @JoinColumn(name = "thickness_id", referencedColumnName = "id", nullable = false)
    private Thickness thickness;
    @OneToMany(mappedBy = "product",cascade = CascadeType.ALL)
    private Collection<Productmaterial> productmaterials;

    @OneToMany(mappedBy = "product",cascade = CascadeType.ALL)
    @JsonIgnore
    private Collection<Proorderproduct> proorderproducts;

    @JsonIgnore
    @OneToMany(mappedBy = "product",cascade = CascadeType.ALL)
    private Collection<Productionproduct> productionproducts;
    @JsonIgnore
    @OneToMany(mappedBy = "product",cascade = CascadeType.ALL)
    private Collection<Invoiceproduct> invoiceproducts;

    public Product(Integer id, String code, String name) {
        this.id = id;
        this.code = code;
        this.name = name;
    }

    public Product(Integer id, String code, BigDecimal qty) {
        this.id = id;
        this.code = code;
        this.qty = qty;
    }

    public Product() {
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

    public Date getDointroduced() {
        return dointroduced;
    }

    public void setDointroduced(Date dointroduced) {
        this.dointroduced = dointroduced;
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
        Product product = (Product) o;
        return Objects.equals(id, product.id) && Objects.equals(code, product.code) && Objects.equals(name, product.name) && Objects.equals(qty, product.qty) && Objects.equals(dointroduced, product.dointroduced) && Objects.equals(unitprice, product.unitprice) && Objects.equals(description, product.description) && Arrays.equals(photo, product.photo);
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(id, code, name, qty, dointroduced, unitprice, description);
        result = 31 * result + Arrays.hashCode(photo);
        return result;
    }

    public Producttype getProducttype() {
        return producttype;
    }

    public void setProducttype(Producttype producttype) {
        this.producttype = producttype;
    }

    public Productstatus getProductstatus() {
        return productstatus;
    }

    public void setProductstatus(Productstatus productstatus) {
        this.productstatus = productstatus;
    }

    public Color getColor() {
        return color;
    }

    public void setColor(Color color) {
        this.color = color;
    }

    public Size getSize() {
        return size;
    }

    public void setSize(Size size) {
        this.size = size;
    }

    public Thickness getThickness() {
        return thickness;
    }

    public void setThickness(Thickness thickness) {
        this.thickness = thickness;
    }

    public Collection<Productmaterial> getProductmaterials() {
        return productmaterials;
    }

    public void setProductmaterials(Collection<Productmaterial> productmaterials) {
        this.productmaterials = productmaterials;
    }

    public Collection<Productionproduct> getProductionproducts() {
        return productionproducts;
    }

    public void setProductionproducts(Collection<Productionproduct> productionproducts) {
        this.productionproducts = productionproducts;
    }

    public Collection<Proorderproduct> getProorderproducts() {
        return proorderproducts;
    }

    public void setProorderproducts(Collection<Proorderproduct> proorderproducts) {
        this.proorderproducts = proorderproducts;
    }

    public Collection<Invoiceproduct> getInvoiceproducts() {
        return invoiceproducts;
    }

    public void setInvoiceproducts(Collection<Invoiceproduct> invoiceproducts) {
        this.invoiceproducts = invoiceproducts;
    }
}

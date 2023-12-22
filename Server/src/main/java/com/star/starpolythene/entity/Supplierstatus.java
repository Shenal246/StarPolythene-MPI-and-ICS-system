package com.star.starpolythene.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Collection;
import java.util.Objects;

@Entity
public class Supplierstatus {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "name")
    private String name;
    @OneToMany(mappedBy = "supplierstatus")
    @JsonIgnore
    private Collection<Supplier> suppliers;

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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Supplierstatus that = (Supplierstatus) o;
        return Objects.equals(id, that.id) && Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }

    public Collection<Supplier> getSuppliers() {
        return suppliers;
    }

    public void setSuppliers(Collection<Supplier> suppliers) {
        this.suppliers = suppliers;
    }
}

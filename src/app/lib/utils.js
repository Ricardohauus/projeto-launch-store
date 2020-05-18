module.exports = {
  formatPrice(price) {
    return new Intl.NumberFormat('pt-br', {
      style: 'currency',
      currency: 'BRL'
    }).format(price / 100)
  },
  formatCPfCnpj(value) {
    value = value.replace(/\D/g, "");
    if (value.length == 11) {
      // CPF - 123.456.789-11
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    } else if (value.length == 14) {
      // CNPJ - 12.345.678/9000-14
      value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
    } else if (value.length > 14) {
      value = value.substring(0, 14);
      value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
    }
    return value;
  },
  formatCep(value) {
    value = value.replace(/\D/g, "");
    if (value.length == 8) {
      // CEP 12345-678
      value = value.replace(/(\d{5})(\d{3})/, "$1-$2")
    } else if (value.length > 8) {
      value = value.substring(0, 8);
      value = value.replace(/(\d{5})(\d{3})/, "$1-$2")
    }
    return value;
  }
}

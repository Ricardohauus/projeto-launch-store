const Mask = {
  apply(input, func) {
    setTimeout(() => {
      input.value = Mask[func](input.value)
    }, 1);
  },
  formatBRL(value) {
    value = value.replace(/\D/g, "");
    return new Intl.NumberFormat('pt-br', {
      style: 'currency',
      currency: 'BRL'
    }).format(value / 100)
  }
}

const PhotosUpload = {
  uploadLimit: 6,
  handleFileInput(event) {
    const { files: fileList } = event.target;

    if (this.hasLimit()) return

    Array.from(fileList).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.src = String(reader.result)
        const div = PhotosUpload.getContainer(image);
        document.querySelector("#photos-preview").appendChild(div);
      }
      reader.readAsDataURL(file);

    })

  },
  getContainer(image) {
    const div = document.createElement('div');
    div.classList.add('photo');
    div.onclick = () => alert("Remover foto");
    div.appendChild(image);
    return div;
  },
  hasLimit(event) {
    const { uploadLimit } = PhotosUpload;
    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos`);
      event.preventDefault();
      return true;
    }
    return false;
  }


}
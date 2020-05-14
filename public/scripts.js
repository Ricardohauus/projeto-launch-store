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
  input: "",
  preview: document.querySelector("#photos-preview"),
  uploadLimit: 6,
  files: [],
  handleFileInput(event) {
    const { files: fileList } = event.target;
    this.input = event.target;
    if (this.hasLimit(event)) return

    Array.from(fileList).forEach(file => {
      this.files.push(file);
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.src = String(reader.result)
        const div = PhotosUpload.getContainer(image);
        this.preview.appendChild(div);
      }
      reader.readAsDataURL(file);

    })
    this.input.files = this.getAllFiles();
  },
  getContainer(image) {
    const div = document.createElement('div');
    div.classList.add('photo');
    div.onclick = (e) => this.removePhoto(e);
    div.appendChild(image);
    div.appendChild(this.getRemoveButton());

    return div;
  },
  hasLimit(event) {
    const { uploadLimit, input, preview } = this
    const { files: fileList } = input

    if (fileList.length > uploadLimit) {
      alert(`Envie no máximo ${uploadLimit} fotos`);
      event.preventDefault();
      return true;
    }

    const photoDiv = []
    preview.childNodes.forEach(item => {
      if (item.classList && item.classList.value == "photo") {
        photoDiv.push(item);
      }
    })

    const totalPhotos = fileList.length + photoDiv.length;
    if (totalPhotos > uploadLimit) {
      alert(`Você atingiu o limite máximo de ${uploadLimit} fotos`);
      return true;
    }
    return false;
  },
  getAllFiles() {
    const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer();
    this.files.forEach(file => dataTransfer.items.add(file))
    return dataTransfer.files;
  },
  getRemoveButton() {
    const button = document.createElement('i')
    button.classList.add('material-icons')
    button.innerHTML = "close"
    return button;
  },
  removePhoto(event) {
    const photoDiv = event.target.parentNode;
    const photosArray = Array.from(this.preview.children);
    const index = photosArray.indexOf(photoDiv)
    this.files.splice(index, 1);
    this.input.files = this.getAllFiles();

    photoDiv.remove();
  },
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode;

    if (photoDiv.id) {
      const removedFiles = document.querySelector("input[name='removed_files']")

      if (removedFiles) {
        removedFiles.value += `${photoDiv.id},`
      }
    }
    this.removePhoto(event);
  }
}
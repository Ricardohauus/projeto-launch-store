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
  },
  cpfCnpj(value) {
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
  cep(value) {
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

const ImageGallery = {
  highlight: document.querySelector(".gallery .highlight > img"),
  previews: document.querySelectorAll('.gallery-preview img'),
  setImage(e) {
    const { target } = e

    this.previews.forEach(preview => preview.classList.remove('active'))
    target.classList.add('active')

    this.highlight.src = target.src
    LightBox.image.src = target.src

  }
}

const LightBox = {
  target: document.querySelector(".lightbox-target "),
  image: document.querySelector(".lightbox-target img"),
  closeButton: document.querySelector(".lightbox-target a.lightbox-close"),
  open() {
    this.target.style.opacity = 1
    this.target.style.top = 0
    this.target.style.bottom = 0
    this.closeButton.style.top = 0
  },
  close() {
    this.target.style.opacity = 0
    this.target.style.top = "-100%"
    this.target.style.bottom = "inital"
    this.closeButton.style.top = "-80px"
  }

}

const Validate = {
  apply(input, func) {
    this.clearErrors(input);
    let results = Validate[func](input.value)
    input.value = results.value
    if (results.error) {
      this.displayErrors(input, results.error)
    }
  },
  displayErrors(input, error) {
    const button = document.querySelector(".button");
    const div = document.createElement('div')
    div.classList.add('error')
    div.innerHTML = error
    input.parentNode.appendChild(div)
    button.setAttribute("disabled", true)
    button.classList.add("disabled")
  },
  clearErrors(input) {
    const errorDiv = input.parentNode.querySelector(".error")
    const button = document.querySelector(".button");
    if (errorDiv) {
      errorDiv.remove();
      button.removeAttribute("disabled")
      button.classList.remove("disabled")
    }
  },
  isEmail(value) {
    let error = null;
    const mailFormat = /^\w+([\.-_]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!value.match(mailFormat)) {
      error = "Email inválido"
    }
    return { error, value };
  },
  isCpfCnpj(value) {
    let error = null

    const cleanValues = value.replace(/\D/g, "")

    if (cleanValues.length > 11 && cleanValues.length !== 14) {
      error = "CNPJ inválido"
    }
    else if (cleanValues.length < 12 && cleanValues.length !== 11) {
      error = "CPF inválido"
    }

    return { error, value }
  },
  isCep(value) {
    let error = null

    const cleanValues = value.replace(/\D/g, "")

    if (cleanValues.length !== 8) {
      error = "CEP inválido"
    }

    return { error, value }
  },
  isPassword(value) {
    let error = null

    const password = document.querySelector("#password");
    const passwordRepeat = document.querySelector("#passwordRepeat");

    if (passwordRepeat) {
      if (password.value != passwordRepeat.value) {
        error = "As senhas não conferem!"
      } else {
        this.clearErrors(password);
        this.clearErrors(passwordRepeat);
      }
    }

    return { error, value }
  }
}

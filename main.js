const incompleteBookshelfList = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

function generateId() {
  return +new Date();
}

function generateBookObject(
  id,
  inputBookTitle,
  inputBookAuthor,
  inputBookYear,
  isCompleted
) {
  return {
    id,
    inputBookTitle,
    inputBookAuthor,
    inputBookYear,
    isCompleted,
  };
}

function findBook(bookId) {
  for (const bookItem of incompleteBookshelfList) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
}

function findBookIndex(bookId) {
  for (const index in incompleteBookshelfList) {
    if (incompleteBookshelfList[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(incompleteBookshelfList);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      incompleteBookshelfList.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const { id, inputBookTitle, inputBookAuthor, inputBookYear, isCompleted } =
    bookObject;

  const textTitle = document.createElement("h3");
  textTitle.innerText = "Judul Buku: " + inputBookTitle;

  const textPenulis = document.createElement("p");
  textPenulis.innerText = "Penulis Buku:  " + inputBookAuthor;

  const textTahun = document.createElement("p");
  textTahun.innerText = "Tahun Terbit Buku: " + inputBookYear;

  const action = document.createElement("div");
  action.classList.add("action");

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(textTitle, textPenulis, textTahun, action);
  container.setAttribute("id", `book-${id}`);

  if (isCompleted) {
    const trashButton = document.createElement("button");
    trashButton.innerText = "hapus buku";
    trashButton.classList.add("red");
    trashButton.addEventListener("click", function (event) {
      event.stopPropagation();
      if (confirm("apakah buku " + inputBookTitle + " mau dihapus")) {
        hapusBuku(id);
        alert("Buku " + inputBookTitle + " telah dihapus");
      } else {
        alert("buku tidak dihapus");
        return null;
      }
    });
    const undoButton = document.createElement("button");
    undoButton.innerText = "Buku belum dibaca";
    undoButton.classList.add("orange");
    undoButton.addEventListener("click", function () {
      undoBuku(id);
      alert("Buku belum dibaca");
    });
    action.append(undoButton);
    action.append(trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.innerText = "Buku selesai dibaca";
    checkButton.classList.add("green");
    checkButton.addEventListener("click", function () {
      tambahBukuSelesai(id);
      alert("Buku sudah selesai dibaca");
    });
    const trashButton = document.createElement("button");
    trashButton.innerText = "hapus buku";
    trashButton.classList.add("red");
    trashButton.addEventListener("click", function (event) {
      event.stopPropagation();
      if (confirm("apakah buku " + inputBookTitle + " mau dihapus")) {
        hapusBuku(id);
        alert("Buku " + inputBookTitle + " telah dihapus");
      } else {
        alert("buku tidak dihapus");
        return null;
      }
    });
    action.append(checkButton);
    action.append(trashButton);
  }
  return container;
}

function addBook() {
  const judulBuku = document.getElementById("inputBookTitle").value;
  const penulisBuku = document.getElementById("inputBookAuthor").value;
  const tahunBuku = document.getElementById("inputBookYear").value;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    judulBuku,
    penulisBuku,
    tahunBuku,
    false
  );
  incompleteBookshelfList.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  alert("Buku berhasil ditambahkan");
}

function tambahBukuSelesai(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function hapusBuku(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  incompleteBookshelfList.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBuku(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log("Data berhasil di simpan.");
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedTODOList = document.getElementById(
    "incompleteBookshelfList"
  );
  const listCompleted = document.getElementById("completeBookshelfList");

  uncompletedTODOList.innerHTML = "";
  listCompleted.innerHTML = "";

  for (const bookItem of incompleteBookshelfList) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      listCompleted.append(bookElement);
    } else {
      uncompletedTODOList.append(bookElement);
    }
  }
});

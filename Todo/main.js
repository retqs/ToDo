// book class: represents a book
class Book {
	constructor(title,author,isbn) {
		this.title = title;
		this.author = author;
		this.isbn = isbn;
	}
}

//UI class:Handle UI 
class UI  {
	static displayBooks() {
		const books = Store.getBooks();

		books.forEach((book) => UI.addBookToList(book));
	}
	
	static addBookToList(book) {
		const list = document.querySelector('#book-list');

		const row = document.createElement('tr'); // basic method to add HTML element
		row.innerHTML = `
		<td>${book.title}</td>
		<td>${book.author}</td>
		<td>${book.isbn}</td>
		<td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
		`;

		list.appendChild(row);


	}

	static deleteBook(el) {
		if(el.classList.contains('delete')) {
			el.parentElement.parentElement.remove();
		}
	}

	static showAlert(message,className) {
		const div  = document.createElement('div');
		div.className = `alert alert-${className}`;
		div.appendChild(document.createTextNode(message));
		const container = document.querySelector('.container');
		const form =document.querySelector('#book-form');
		container.insertBefore(div,form);
		// Vanish in a couple of seconds
		setTimeout(()=>document.querySelector('.alert').remove(),3000);
	}

	static clearField() {
		document.querySelector('#title').value = '';
		document.querySelector('#author').value = '';
		document.querySelector('#isbn').value = '';
	}
}

// Store class:Handles storage
class Store {
	static getBooks() { //static - for call directly 
		let books;
		if(localStorage.getItem('books') === null) {
			books = [];
		} else {
			books = JSON.parse(localStorage.getItem('books'));
		}
		return books;
	}	
	static addBook(book) {
		const books = Store.getBooks();
		books.push(book);

		localStorage.setItem('books',JSON.stringify(books));
	}
	static removeBook(isbn) {
		const books = Store.getBooks();
		books.forEach((book,index) => {
			if(book.isbn === isbn) {
				books.splice(index,1);
			}
		});

		localStorage.setItem('books',JSON.stringify(books));
	}
}

//Events : display books
document.addEventListener('DOMContentLoaded',UI.displayBooks);

//Event to add a book
document.querySelector('#book-form').addEventListener('submit',(e)=> {
	//Prevent actuall submit 
	e.preventDefault();

	//Get form values
	const title = document.querySelector('#title').value;
	const author = document.querySelector('#author').value;
	const isbn = document.querySelector('#isbn').value;

	//validate
	if(title === '' || author === '' || isbn === '') {
		UI.showAlert('Please be fullfilled','danger');
	} else {


	// instaniate book 
	const book = new Book(title,author,isbn);
	//add book to UI
	UI.addBookToList(book);

	Store.addBook(book);

	//Clear fields
	UI.clearField();
 }
});


//Event to remove
document.querySelector('#book-list').addEventListener('click',(e)=> {
	UI.deleteBook(e.target);

	Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
});

